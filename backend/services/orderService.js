const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const notificationService = require("./notificationService");

// ================= CREATE ORDER =================

const createOrder = async (orderData) => {
  const order = await Order.create(orderData);

  // Notify customer
  await notificationService.createNotification({
    user: order.user,
    title: "Order Created",
    message: "Your order has been created successfully.",
    type: "ORDER",
  });

  // Notify admin
  const admin = await notificationService.getAdminUser();

  if (admin) {
    await notificationService.createNotification({
      user: admin._id,
      title: "New Order",
      message: "A new order has been placed.",
      type: "ORDER",
    });
  }

  return order;
};

// ================= GET USER ORDERS =================

const getOrdersByUser = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });

  return orders;
};

// ================= GET ALL ORDERS =================

const getAllOrders = async ({
  page = 1,
  limit = 10,
  search = "",
  orderStatus = "",
  paymentStatus = "",
} = {}) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const perPage = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (currentPage - 1) * perPage;

  const query = {};

  if (orderStatus) {
    query.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  const searchText = search.trim();

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
    }).select("_id");

    const searchConditions = [
      {
        user: {
          $in: users.map((user) => user._id),
        },
      },
    ];

    if (/^[0-9a-fA-F]{24}$/.test(searchText)) {
      searchConditions.push({
        _id: searchText,
      });
    }

    query.$or = searchConditions;
  }

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / perPage);

  const orders = await Order.find(query)
    .populate("items.product")
    .populate("user", "-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);

  return {
    orders,
    currentPage,
    totalPages,
    totalOrders,
  };
};
const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate("items.product")
    .populate("user", "-password");

  return order;
};

// ================= UPDATE ORDER STATUS =================

const updateOrderStatus = async (orderId, orderStatus) => {
  const existingOrder = await Order.findById(orderId);

  if (!existingOrder) {
    return null;
  }

  // Restore stock only when an order is cancelled
  if (
    orderStatus === "CANCELLED" &&
    existingOrder.orderStatus !== "CANCELLED"
  ) {
    for (const item of existingOrder.items) {
      const updatedProduct = await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          new: true,
        }
      );

      console.log(
        "STOCK RESTORED:",
        item.product,
        "Quantity:",
        item.quantity,
        "New Stock:",
        updatedProduct
          ? updatedProduct.stock
          : "PRODUCT NOT FOUND"
      );
    }
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Notify customer about status change
  if (order) {
    await notificationService.createNotification({
      user: order.user,
      title: "Order Status Updated",
      message: `Your order status is now ${orderStatus}.`,
      type: "ORDER",
    });
  }

  return order;
};

// ================= BEST SELLING PRODUCTS =================





const requestReturn = async (orderId, userId, reason) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    throw new Error("You are not authorized to request return for this order");
  }

  if (order.orderStatus !== "DELIVERED") {
    throw new Error("Return can be requested only for delivered orders");
  }

  if (order.returnStatus !== "NONE") {
    throw new Error("Return request already exists for this order");
  }

  if (!reason || !reason.trim()) {
    throw new Error("Return reason is required");
  }

  order.returnStatus = "REQUESTED";
  order.returnReason = reason.trim();
  order.returnRequestedAt = new Date();

  await order.save();

  return order;
};

// ADMIN APPROVE / REJECT RETURN
const updateReturnStatus = async (orderId, returnStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    return null;
  }

  if (order.returnStatus !== "REQUESTED") {
    throw new Error("There is no pending return request for this order");
  }

  if (!["APPROVED", "REJECTED"].includes(returnStatus)) {
    throw new Error("Invalid return status");
  }

  order.returnStatus = returnStatus;

  if (returnStatus === "APPROVED") {
    order.refundStatus = "PENDING";
    order.refundAmount = order.finalAmount;
  }

  if (returnStatus === "REJECTED") {
    order.refundStatus = "NOT_APPLICABLE";
    order.refundAmount = 0;
  }

  await order.save();

  return order;
};
const getBestSellingProducts = async () => {
  const bestSellers = await Order.aggregate([
    {
      $match: {
        paymentStatus: "PAID",
        orderStatus: {
          $nin: ["CANCELLED"],
        },
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: "$items.product",
        totalSold: {
          $sum: "$items.quantity",
        },
      },
    },

    {
      $sort: {
        totalSold: -1,
      },
    },

    {
      $limit: 10,
    },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },

    {
      $unwind: "$product",
    },

    {
      $project: {
        _id: 0,
        product: 1,
        totalSold: 1,
      },
    },
  ]);

  return bestSellers;
};

const updateRazorpayOrder = async (
  orderId,
  razorpayOrderId,
  userId
) => {
  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      user: userId,
    },
    {
      razorpayOrderId: razorpayOrderId,
    },
    {
      new: true,
    }
  );

  return order;
};
const verifyRazorpayPayment = async (
  orderId,
  userId,
  razorpayPaymentId,
  razorpaySignature
) => {
  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      user: userId,
    },
    {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
      razorpayPaymentId,
      razorpaySignature,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return order;
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  requestReturn,
  updateReturnStatus,
  getBestSellingProducts,
  updateRazorpayOrder,
  verifyRazorpayPayment,
};

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const createOrder = async (orderData) => {
  const order = await Order.create(orderData);
  return order;
};

const getOrdersByUser = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });

  return orders;
};

// Get all customers' orders with pagination, search and filters
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

  // Order status filter
  if (orderStatus) {
    query.orderStatus = orderStatus;
  }

  // Payment status filter
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  // Search by customer name, email, or order ID
  if (search && search.trim()) {
    const searchText = search.trim();
    const regex = new RegExp(searchText, "i");

    const users = await User.find({
      $or: [
        { name: regex },
        { email: regex },
      ],
    }).select("_id");

    const searchConditions = [
      { user: { $in: users.map((user) => user._id) } },
    ];

    // Search by order ID if valid MongoDB ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(searchText)) {
      searchConditions.push({ _id: searchText });
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

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("items.product")
    .populate("user", "-password");

  return order;
};

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
        { $inc: { stock: item.quantity } },
        { new: true }
      );

      console.log(
        "STOCK RESTORED:",
        item.product,
        "Quantity:",
        item.quantity,
        "New Stock:",
        updatedProduct ? updatedProduct.stock : "PRODUCT NOT FOUND"
      );
    }
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  return order;
};

// CUSTOMER REQUEST RETURN
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

module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  requestReturn,
  updateReturnStatus,
  getBestSellingProducts,
};

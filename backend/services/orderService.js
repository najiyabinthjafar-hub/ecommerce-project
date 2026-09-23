const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const notificationService = require("./notificationService");
const productService = require("./productService");

// ================= STOCK HELPERS =================

const getProductId = (item) => {
  if (!item) return null;
  return item.product?._id || item.product;
};

const validateStockAvailability = async (items = []) => {
  for (const item of items) {
    const productId = getProductId(item);
    const quantity = Number(item.quantity);

    if (!productId) {
      throw new Error("Product is required for each order item");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }

    const product = await Product.findById(productId).select("name stock");

    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `Not enough stock for ${product.name}. Available stock: ${product.stock}, requested: ${quantity}`
      );
    }
  }
};

const restoreStock = async (items = []) => {
  for (const item of items) {
    const productId = getProductId(item);
    const quantity = Number(item.quantity);

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      continue;
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $inc: {
            stock: quantity,
          },
        },
        {
          new: true,
        }
      );

      console.log(
        "STOCK RESTORED:",
        productId,
        "Quantity:",
        quantity,
        "New Stock:",
        updatedProduct ? updatedProduct.stock : "PRODUCT NOT FOUND"
      );
    } catch (error) {
      console.error(
        "Failed to restore stock:",
        productId,
        error.message
      );
    }
  }
};

const reduceStockForItems = async (items = []) => {
  const reducedItems = [];

  try {
    for (const item of items) {
      const productId = getProductId(item);
      const quantity = Number(item.quantity);

      const product = await productService.reduceProductStock(
        productId,
        quantity
      );

      if (!product) {
        throw new Error(
          `Not enough stock for product ${productId}`
        );
      }

      reducedItems.push({
        product: productId,
        quantity,
      });
    }

    return reducedItems;
  } catch (error) {
    if (reducedItems.length > 0) {
      await restoreStock(reducedItems);
    }

    throw error;
  }
};

// ================= CREATE ORDER =================

const createOrder = async (orderData) => {
  const items = orderData.items || [];
  const paymentMethod = String(
    orderData.paymentMethod || ""
  ).toUpperCase();

  // Validate stock before creating any order.
  await validateStockAvailability(items);

  let reducedItems = [];

  // COD: reduce stock immediately.
  if (paymentMethod === "COD") {
    reducedItems = await reduceStockForItems(items);
  }

  // Razorpay: do NOT reduce stock here.
  // Stock will be reduced only after successful payment.
  let order;

  try {
    order = await Order.create(orderData);
  } catch (error) {
    if (reducedItems.length > 0) {
      await restoreStock(reducedItems);
    }

    throw error;
  }

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
    .populate("user")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);

  const safeOrders = orders.map((order) => {
    const orderObject = order.toObject();

    if (orderObject.user) {
      orderObject.user = {
        _id: orderObject.user._id,
        name: orderObject.user.name,
        email: orderObject.user.email,
        phone: orderObject.user.phone,
        role: orderObject.user.role,
        status: orderObject.user.status,
        isEmailVerified: orderObject.user.isEmailVerified,
        profileCompleted: orderObject.user.profileCompleted,
      };
    }

    return orderObject;
  });

  return {
    orders: safeOrders,
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
    .populate({ path: "user", select: "_id name email phone role status isEmailVerified profileCompleted" });

  return order;
};

// ================= UPDATE ORDER STATUS =================

const updateOrderStatus = async (orderId, orderStatus) => {
  const existingOrder = await Order.findById(orderId);

  if (!existingOrder) {
    return null;
  }

  const paymentMethod = String(
    existingOrder.paymentMethod || ""
  ).toUpperCase();

  // Restore stock only if stock was previously deducted.
  // COD -> stock deducted when order was created.
  // Razorpay -> stock deducted only after payment became PAID.
  const stockWasDeducted =
    paymentMethod === "COD" ||
    (paymentMethod === "RAZORPAY" &&
      existingOrder.paymentStatus === "PAID") ||
    (!paymentMethod && existingOrder.orderStatus !== "PENDING");

  if (
    orderStatus === "CANCELLED" &&
    existingOrder.orderStatus !== "CANCELLED" &&
    stockWasDeducted
  ) {
    await restoreStock(existingOrder.items);
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
  const existingOrder = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!existingOrder) {
    return null;
  }

  // Prevent duplicate payment callbacks from reducing stock twice.
  if (existingOrder.paymentStatus === "PAID") {
    return existingOrder;
  }

  const paymentMethod = String(
    existingOrder.paymentMethod || ""
  ).toUpperCase();

  if (paymentMethod === "COD") {
    throw new Error(
      "Razorpay payment verification is allowed only for Razorpay orders"
    );
  }

  // Razorpay: reduce stock only after successful payment verification.
  const reducedItems = await reduceStockForItems(
    existingOrder.items || []
  );

  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        user: userId,
        paymentStatus: { $ne: "PAID" },
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

    // Another payment callback may have completed first.
    // Restore the stock reduced by this callback.
    if (!order) {
      await restoreStock(reducedItems);

      return await Order.findOne({
        _id: orderId,
        user: userId,
      });
    }

    return order;
  } catch (error) {
    await restoreStock(reducedItems);
    throw error;
  }
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



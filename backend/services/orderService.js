const Order = require("../models/Order");
const notificationService = require("./notificationService");



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

const getOrdersByUser = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });

  return orders;
};

// Get all customers' orders
const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("items.product")
    .populate("user", "-password")
    .sort({ createdAt: -1 });

  return orders;
};

const getOrderById = async (orderId,userId) => {
  const order = await Order.findOne({
  _id: orderId,
  user: userId,
})
    .populate("items.product")
    .populate("user", "-password");

  return order;
};

const updateOrderStatus = async (
  orderId,
  orderStatus
) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    {
      new: true,
      runValidators: true,
    }
  );

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
  getBestSellingProducts,
  updateRazorpayOrder,
  verifyRazorpayPayment,
};
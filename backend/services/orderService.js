const Order = require("../models/Order");
const Product = require("../models/Product");
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

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("items.product")
    .populate("user", "-password")
    .sort({ createdAt: -1 });

  return orders;
};

// ================= GET ORDER BY ID =================

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
  getBestSellingProducts,
};
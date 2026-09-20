const Order = require("../models/Order");
const Product = require("../models/Product");

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

// Get all customers' orders
const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("items.product")
    .populate("user", "-password")
    .sort({ createdAt: -1 });

  return orders;
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("items.product")
    .populate("user", "-password");

  return order;
};

const updateOrderStatus = async (
  orderId,
  orderStatus
) => {
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






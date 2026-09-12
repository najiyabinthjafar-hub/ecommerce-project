const Order = require("../models/Order");

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

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("items.product")
    .populate("user", "-password");

  return order;
};

const updateOrderStatus = async (orderId, orderStatus) => {
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
  getOrderById,
  updateOrderStatus,
  getBestSellingProducts,
};
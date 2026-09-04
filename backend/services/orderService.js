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

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
};
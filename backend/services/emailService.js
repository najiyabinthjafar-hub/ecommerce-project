
require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const getSender = () => {
  if (!process.env.EMAIL_FROM) {
    throw new Error(
      "EMAIL_FROM is missing. Configure a verified sender email in Render."
    );
  }

  return process.env.EMAIL_FROM;
};

// ================= SEND REGISTRATION OTP =================

const sendOtpEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: getSender(),
      to: [email],
      subject: "E-Commerce Email Verification OTP",
      text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
    });

    if (error) throw new Error(error.message);

    console.log("Registration OTP email sent successfully");
    return data;
  } catch (error) {
    console.error("Registration OTP email failed:", error.message);
    throw new Error("Failed to send OTP email");
  }
};

// ================= SEND RESET PASSWORD OTP =================

const sendResetOtpEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: getSender(),
      to: [email],
      subject: "E-Commerce Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
    });

    if (error) throw new Error(error.message);

    console.log("Password reset OTP email sent successfully");
    return data;
  } catch (error) {
    console.error("Password reset OTP email failed:", error.message);
    throw new Error("Failed to send password reset OTP email");
  }
};

// ================= SEND CONTACT MESSAGE =================

const sendContactEmail = async ({ name, email, phone, comment }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: getSender(),
      to: [process.env.EMAIL_USER],
      replyTo: email,
      subject: "New Contact Form Message - E-Commerce",
      text: `
New Contact Form Message

Name: ${name}
Email: ${email}
Phone: ${phone}

Comment:
${comment}

This message was submitted from the E-Commerce website Contact page.
      `,
    });

    if (error) throw new Error(error.message);

    console.log("Contact email sent successfully");
    return data;
  } catch (error) {
    console.error("Contact email failed:", error.message);
    throw new Error("Failed to send contact email");
  }
};

// ================= SEND ORDER CONFIRMATION EMAIL =================

const sendOrderConfirmationEmail = async ({
  order,
  user,
  invoiceBuffer,
}) => {
  try {
    if (!user?.email) {
      throw new Error("Customer email not found");
    }

    const customerName =
      user.name || order.shippingAddress?.fullName || "Customer";

    const orderId = order._id?.toString() || "N/A";
    const finalAmount = Number(order.finalAmount || 0);

    const emailPayload = {
      from: getSender(),
      to: [user.email],
      subject: `Order Confirmation - #${orderId}`,
      text: `
Hello ${customerName},

Thank you for your order!

Your order has been confirmed successfully.

Order ID: ${orderId}
Payment Method: ${order.paymentMethod || "N/A"}
Payment Status: ${order.paymentStatus || "N/A"}
Order Status: ${order.orderStatus || "N/A"}
Total Amount: Rs. ${finalAmount.toFixed(2)}

Your invoice is attached to this email as a PDF.

Thank you for choosing Rizo Fashion!
      `,
    };

    if (invoiceBuffer) {
      emailPayload.attachments = [
        {
          filename: `invoice-${orderId}.pdf`,
          content: Buffer.from(invoiceBuffer).toString("base64"),
        },
      ];
    }

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) throw new Error(error.message);

    console.log("Order confirmation email sent successfully");
    return data;
  } catch (error) {
    console.error("Order confirmation email failed:", error.message);
    throw error;
  }
};

// ================= SEND NEW ORDER ADMIN EMAIL =================

const sendNewOrderAdminEmail = async ({ order, customer }) => {
  try {
    const adminEmail = process.env.EMAIL_USER;

    if (!adminEmail) {
      throw new Error("Admin email not configured");
    }

    const orderId = order._id?.toString() || "N/A";
    const customerName =
      customer?.name || order.shippingAddress?.fullName || "Customer";

    const customerEmail = customer?.email || "N/A";
    const finalAmount = Number(order.finalAmount || 0);

    const { data, error } = await resend.emails.send({
      from: getSender(),
      to: [adminEmail],
      subject: `New Order Received - #${orderId}`,
      text: `
New Order Received

A new order has been placed on Rizo Fashion.

Order ID: ${orderId}
Customer Name: ${customerName}
Customer Email: ${customerEmail}
Payment Method: ${order.paymentMethod || "N/A"}
Payment Status: ${order.paymentStatus || "N/A"}
Order Status: ${order.orderStatus || "N/A"}
Total Amount: Rs. ${finalAmount.toFixed(2)}

Please log in to the admin panel to view the complete order details.
      `,
    });

    if (error) throw new Error(error.message);

    console.log("New order admin email sent successfully");
    return data;
  } catch (error) {
    console.error("New order admin email failed:", error.message);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
  sendResetOtpEmail,
  sendContactEmail,
  sendOrderConfirmationEmail,
  sendNewOrderAdminEmail,
};

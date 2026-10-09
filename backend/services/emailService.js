
require("dotenv").config();

const { google } = require("googleapis");

// ================= GOOGLE GMAIL API =================

const getGmailClient = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error("Google OAuth environment variables are missing");
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
  });
};

// ================= EMAIL SENDER =================

const getSender = () => {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is missing");
  }

  return process.env.EMAIL_FROM;
};

// ================= SEND EMAIL =================

const sendEmail = async ({ to, subject, text, attachments = [], replyTo }) => {
  if (!to) {
    throw new Error("Recipient email is missing");
  }

  const gmail = getGmailClient();
  const boundary = `boundary_${Date.now()}_${Math.random()
    .toString(16)
    .slice(2)}`;

  const headers = [
    `From: ${getSender()}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
  ];

  let message;

  if (attachments.length > 0) {
    headers.push("MIME-Version: 1.0");
    headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);

    const parts = [
      headers.join("\r\n"),
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(text, "utf8").toString("base64"),
    ];

    for (const attachment of attachments) {
      parts.push(
        `--${boundary}`,
        `Content-Type: ${attachment.contentType || "application/octet-stream"}; name="${attachment.filename}"`,
        `Content-Disposition: attachment; filename="${attachment.filename}"`,
        "Content-Transfer-Encoding: base64",
        "",
        Buffer.from(attachment.content).toString("base64")
      );
    }

    parts.push(`--${boundary}--`);
    message = parts.join("\r\n");
  } else {
    message = [
      ...headers,
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(text, "utf8").toString("base64"),
    ].join("\r\n");
  }

  const raw = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return response.data;
};

// ================= SEND REGISTRATION OTP =================

const sendOtpEmail = async (email, otp) => {
  try {
    const result = await sendEmail({
      to: email,
      subject: "E-Commerce Email Verification OTP",
      text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("Registration OTP email sent successfully");
    return result;
  } catch (error) {
    console.error("Registration OTP email failed:", error.message);
    throw new Error("Failed to send OTP email");
  }
};

// ================= SEND RESET PASSWORD OTP =================

const sendResetOtpEmail = async (email, otp) => {
  try {
    const result = await sendEmail({
      to: email,
      subject: "E-Commerce Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
    });

    console.log("Password reset OTP email sent successfully");
    return result;
  } catch (error) {
    console.error("Password reset OTP email failed:", error.message);
    throw new Error("Failed to send password reset OTP email");
  }
};

// ================= SEND CONTACT MESSAGE =================

const sendContactEmail = async ({ name, email, phone, comment }) => {
  try {
    const result = await sendEmail({
      to: process.env.EMAIL_USER,
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

    console.log("Contact email sent successfully");
    return result;
  } catch (error) {
    console.error("Contact email failed:", error.message);
    throw new Error("Failed to send contact email");
  }
};

// ================= SEND ORDER CONFIRMATION EMAIL =================

const sendOrderConfirmationEmail = async ({ order, user, invoiceBuffer }) => {
  try {
    if (!user?.email) {
      throw new Error("Customer email not found");
    }

    const customerName =
      user.name || order.shippingAddress?.fullName || "Customer";

    const orderId = order._id?.toString() || "N/A";
    const finalAmount = Number(order.finalAmount || 0);

    const attachments = [];

    if (invoiceBuffer) {
      attachments.push({
        filename: `invoice-${orderId}.pdf`,
        content: Buffer.from(invoiceBuffer),
        contentType: "application/pdf",
      });
    }

    const result = await sendEmail({
      to: user.email,
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
      attachments,
    });

    console.log("Order confirmation email sent successfully");
    return result;
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

    const result = await sendEmail({
      to: adminEmail,
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

    console.log("New order admin email sent successfully");
    return result;
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

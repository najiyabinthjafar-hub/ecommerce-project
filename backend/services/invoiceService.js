const PDFDocument = require("pdfkit");

const generateInvoicePdf = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      const orderId = order._id?.toString() || "N/A";
      const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN");

      const shipping = order.shippingAddress || {};

      // ================= HEADER =================

      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("RIZO FASHION", { align: "center" });

      doc
        .moveDown(0.5)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("INVOICE", { align: "center" });

      doc.moveDown(1);

      // ================= ORDER DETAILS =================

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Order ID: ${orderId}`)
        .text(`Order Date: ${orderDate}`)
        .text(`Payment Method: ${order.paymentMethod || "N/A"}`)
        .text(`Payment Status: ${order.paymentStatus || "N/A"}`);

      doc.moveDown(1);

      // ================= CUSTOMER DETAILS =================

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Customer Details");

      doc
        .moveDown(0.3)
        .fontSize(10)
        .font("Helvetica")
        .text(`Name: ${shipping.fullName || "N/A"}`)
        .text(`Phone: ${shipping.phone || "N/A"}`)
        .text(`Address: ${shipping.address || "N/A"}`)
        .text(
          `Location: ${shipping.city || "N/A"}, ${shipping.state || "N/A"} - ${shipping.pincode || "N/A"}`
        );

      doc.moveDown(1);

      // ================= ITEMS =================

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Order Items");

      doc.moveDown(0.5);

      const startX = 50;
      const productX = 50;
      const quantityX = 330;
      const priceX = 390;
      const amountX = 470;

      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("Product", productX, doc.y)
        .text("Qty", quantityX, doc.y)
        .text("Price", priceX, doc.y)
        .text("Amount", amountX, doc.y);

      doc.moveDown(0.5);

      doc
        .moveTo(startX, doc.y)
        .lineTo(545, doc.y)
        .stroke();

      doc.moveDown(0.5);

      const items = order.items || [];

      items.forEach((item) => {
        const product = item.product || {};

        const productName =
          typeof product === "object"
            ? product.name || "Product"
            : "Product";

        const quantity = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        const amount = quantity * price;

        const rowY = doc.y;

        doc
          .font("Helvetica")
          .fontSize(9)
          .text(productName, productX, rowY, {
            width: 260,
            ellipsis: true,
          })
          .text(quantity.toString(), quantityX, rowY)
          .text(`Rs. ${price.toFixed(2)}`, priceX, rowY)
          .text(`Rs. ${amount.toFixed(2)}`, amountX, rowY);

        doc.moveDown(0.8);
      });

      doc.moveDown(0.5);

      doc
        .moveTo(startX, doc.y)
        .lineTo(545, doc.y)
        .stroke();

      doc.moveDown(0.8);

      // ================= TOTALS =================

      const totalAmount = Number(order.totalAmount || 0);
      const discountAmount = Number(order.discountAmount || 0);
      const finalAmount = Number(order.finalAmount || 0);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Subtotal: Rs. ${totalAmount.toFixed(2)}`, {
          align: "right",
        })
        .text(`Discount: Rs. ${discountAmount.toFixed(2)}`, {
          align: "right",
        })
        .moveDown(0.3)
        .fontSize(13)
        .font("Helvetica-Bold")
        .text(`Grand Total: Rs. ${finalAmount.toFixed(2)}`, {
          align: "right",
        });

      doc.moveDown(2);

      // ================= FOOTER =================

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(
          "Thank you for shopping with us!",
          { align: "center" }
        );

      doc
        .moveDown(0.3)
        .text(
          "This is a computer-generated invoice.",
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePdf,
};


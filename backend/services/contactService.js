const Contact = require("../models/Contact");
const { sendContactEmail } = require("./emailService");

// ================= CREATE CONTACT =================

const createContact = async ({
  name,
  email,
  phone,
  comment,
}) => {
  // Save contact message in database
  const contact = await Contact.create({
    name,
    email,
    phone,
    comment,
  });

  // Send contact message to admin email
  await sendContactEmail({
    name,
    email,
    phone,
    comment,
  });

  return contact;
};

// ================= GET ALL CONTACTS =================

const getAllContacts = async () => {
  const contacts = await Contact.find().sort({
    createdAt: -1,
  });

  return contacts;
};

// ================= DELETE CONTACT =================

const deleteContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    throw new Error("Contact message not found");
  }

  return {
    message: "Contact message deleted successfully",
  };
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact,
};
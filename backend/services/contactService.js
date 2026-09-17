const Contact = require("../models/Contact");

// ================= CREATE CONTACT MESSAGE =================

const createContact = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  return contact;
};

// ================= GET ALL CONTACT MESSAGES =================

const getAllContacts = async () => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  return contacts;
};

// ================= UPDATE CONTACT STATUS =================

const updateContactStatus = async (contactId, status) => {
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    throw new Error("Contact message not found");
  }

  return contact;
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
  updateContactStatus,
  deleteContact,
};
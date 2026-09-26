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

// ================= UPDATE CONTACT STATUS =================

const updateContactStatus = async (
  contactId,
  status
) => {
  // Only allow valid contact statuses
  if (!["read", "replied"].includes(status)) {
    throw new Error(
      "Invalid contact status. Status must be read or replied."
    );
  }

  const contact =
    await Contact.findByIdAndUpdate(
      contactId,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!contact) {
    throw new Error("Contact message not found");
  }

  return contact;
};

// ================= DELETE CONTACT =================

const deleteContact = async (contactId) => {
  const contact =
    await Contact.findByIdAndDelete(contactId);

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
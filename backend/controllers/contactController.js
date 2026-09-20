const contactService = require("../services/contactService");

// ================= CREATE CONTACT =================

const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      comment,
    } = req.body;

    if (!name || !email || !phone || !comment) {
      return res.status(400).json({
        message: "Name, email, phone and comment are required",
      });
    }

    const contact = await contactService.createContact({
      name,
      email,
      phone,
      comment,
    });

    res.status(201).json({
      message: "Your message has been submitted successfully",
      contact,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// ================= GET ALL CONTACTS =================

const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();

    res.status(200).json({
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE CONTACT =================

const deleteContact = async (req, res) => {
  try {
    const result = await contactService.deleteContact(
      req.params.id
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact,
};
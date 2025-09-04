import { useState, useEffect } from "react";
import ContactService from "../service/ContactService";

const useContactSummary = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ContactService.listMy();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching contacts:", err.message);
      setError(err.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  // Add a contact
  const addContact = async (contact) => {
    try {
      const newContact = await ContactService.create(contact);
      setContacts((prev) => [...prev, newContact]);
      return newContact;
    } catch (err) {
      console.error("Error creating contact:", err.message);
      setError(err.message || "Failed to create contact");
      throw err;
    }
  };

  // Remove a contact
  const removeContact = async (id) => {
    try {
      await ContactService.remove(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error removing contact:", err.message);
      setError(err.message || "Failed to delete contact");
    }
  };

  // Sort contacts by name
  const sortByName = () =>
    [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  // Sort contacts by created date (newest first)
  const sortByDateLatest = () =>
    [...contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Sort contacts by created date (oldest first)
  const sortByDateOldest = () =>
    [...contacts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    addContact,
    removeContact,
    sortByName,
    sortByDateLatest,
    sortByDateOldest,
  };
};

export { useContactSummary };

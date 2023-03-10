import React, { useState } from "react";
// import { contacts } from "../contacts";

const ContactList = ({ contacts, onContactSelect }) => {
  const [selectedContactId, setSelectedContactId] = useState(null);

  const handleContactClick = (contact) => {
    onContactSelect(contact);
    setSelectedContactId(contact.id);
  };

  console.log(contacts);

  return (
    <div className="flex-column contact-list">
      <div className="contact-list-header">
        <span>AI Tool Directory</span>
      </div>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`flex-row contact ${
            selectedContactId === contact.id ? "active" : ""
          }`}
          onClick={() => handleContactClick(contact)}
        >
          <div
            className={`contact-picture-wrap ${
              selectedContactId === contact.id ? "active" : ""
            }`}
          >
            <img
              className={`contact-picture ${
                selectedContactId === contact.id ? "active" : ""
              }`}
              src={contact.picture}
            />
          </div>
          <div className="flex-column contact-details">
            <div className="contact-name">{contact.name}</div>
            <div className="contact-role">{contact.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;

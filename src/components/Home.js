import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ContactList from "./ContactList";
import Chat from "./Chat";
import { setSelectedContact } from "../store";

const Home = () => {
  const dispatch = useDispatch();
  const [selectedContact, setSelectedContact] = useState(null);
  const contacts = useSelector((state) => state.contacts);

  const handleContactSelect = (contact) => {
    // dispatch(setSelectedContact(contact));
    setSelectedContact(contact);
  };

  return (
    <div className="flex-row home">
      <ContactList contacts={contacts} onContactSelect={handleContactSelect} />
      {selectedContact ? (
        <Chat selectedContact={selectedContact} />
      ) : (
        <div className="flex-column chatbot placeholder">
          <span>Select an AI tool to begin the chat</span>
        </div>
      )}
    </div>
  );
};

export default Home;

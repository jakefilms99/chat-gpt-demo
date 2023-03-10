import React, { useState, useEffect } from "react";
import { contacts } from "../contacts";

const Messages = ({ selectedContact }) => {
  const [messages, setMessages] = useState(selectedContact.messages);

  useEffect(() => {
    setMessages(selectedContact.messages);
  }, [selectedContact.messages]);

  return (
    <div className="messages">
      {messages.slice(1).map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          {message.content}
        </div>
      ))}
    </div>
  );
};

export default Messages;

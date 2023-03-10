import React, { useState } from "react";

const Input = ({ selectedContact }) => {
  const [input, setInput] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create user message object
    const userMessage = {
      role: "user",
      content: input,
    };

    // Add user message to messages array in selected contact
    selectedContact.messages.push(userMessage);

    // Clear input field
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={handleChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default Input;

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store";
import { ReactComponent as SendIcon } from "../images/icon-send.svg";

const Chat = ({ selectedContact }) => {
  const dispatch = useDispatch();
  const messages = useSelector(
    (state) => state.contacts.find((c) => c.id === selectedContact.id).messages
  );
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState("");
  const [shouldMakeApiCall, setShouldMakeApiCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // new state variable for loading message

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const sendMessage = () => {
    // Create user message object
    const userMessage = {
      role: "user",
      content: input,
    };

    // Dispatch action to add user message to selected contact messages
    dispatch(
      addMessage({ contactId: selectedContact.id, message: userMessage })
    );

    // Clear input field
    setInput("");

    // Set flag to true
    setShouldMakeApiCall(true);
  };

  useEffect(() => {
    const makeApiCall = async () => {
      // Check if the last message in `messages` was added by the user
      if (messages[messages.length - 1].role !== "user") {
        return;
      }

      // Set loading flag to true
      setIsLoading(true);

      // Make API request to ChatGPT
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages,
            max_tokens: 2048,
            temperature: 0.5,
          }),
        }
      );

      const json = await response.json();
      console.log(json);

      // Create assistant message object
      const assistantMessage = {
        role: "assistant",
        content: json.choices[0].message.content.trim(),
      };

      // Dispatch action to add assistant message to selected contact messages
      dispatch(
        addMessage({ contactId: selectedContact.id, message: assistantMessage })
      );

      // Reset flag to false
      setShouldMakeApiCall(false);

      // Set loading flag to false
      setIsLoading(false);
    };

    // Only make the API call if there are messages to send and flag is true
    if (messages && messages.length > 0 && shouldMakeApiCall) {
      makeApiCall();
    }
  }, [messages, shouldMakeApiCall, dispatch, selectedContact.id]);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-column chatbot">
      <div className="flex-row contact-header">
        <div className="contact-picture-wrap active">
          <img
            className="contact-picture active"
            src={selectedContact.picture}
          />
        </div>
        <div className="flex-column contact-details">
          <div className="contact-name">{selectedContact.name}</div>
          <div className="contact-role">{selectedContact.role}</div>
        </div>
      </div>
      <div className="flex-column messages">
        {messages.slice(1).map((message, index) => (
          <p key={index} className={`message ${message.role}`}>
            {message.content.split("\n").map((line, index) => {
              return (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              );
            })}
          </p>
        ))}
        {isLoading && (
          <div className="flex-row message assistant loading-message">
            <div className="message-bubble">
              <p>Hold on, I'm thinking...</p>
              <div className="loader"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-column input-container">
        <textarea
          className="message-input"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={handleChange}
        />
        <button className="button-primary" onClick={sendMessage}>
          <SendIcon className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default Chat;

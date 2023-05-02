import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store";
import { ReactComponent as SendIcon } from "../images/icon-send.svg";

const Chat = ({ selectedContact }) => {
  const [assistantPartialMessage, setAssistantPartialMessage] = useState("");

  const dispatch = useDispatch();
  const messages = useSelector(
    (state) => state.contacts.find((c) => c.id === selectedContact.id).messages
  );
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState("");
  const [shouldMakeApiCall, setShouldMakeApiCall] = useState(false);

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
      if (messages[messages.length - 1].role !== "user") {
        return;
      }
    
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            stream: true,
          }),
        });
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
    
        let assistantMessageContent = "";
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
    
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          const parsedLines = lines
            .map((line) => line.replace(/^data: /, "").trim())
            .filter((line) => line !== "" && line !== "[DONE]")
            .map((line) => JSON.parse(line));
    
          for (const parsedLine of parsedLines) {
            const { choices } = parsedLine;
            const { delta } = choices[0];
            const { content } = delta;
            if (content) {
              assistantMessageContent += content;
              console.log("Received content:", content);
              setAssistantPartialMessage(assistantMessageContent); // Update the partial message in the state
            }
          }
        }
    
        const assistantMessage = {
          role: "assistant",
          content: assistantMessageContent.trim(),
        };
    
        dispatch(
          addMessage({ contactId: selectedContact.id, message: assistantMessage })
        );
        setAssistantPartialMessage(""); // Reset the partial message in the state
    
      } catch (error) {
        console.error("Error:", error);
      }
    };    

    if (messages && messages.length > 0 && shouldMakeApiCall) {
      makeApiCall();
      setShouldMakeApiCall(false);
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
        {assistantPartialMessage && (
          <p className="message assistant">
            {assistantPartialMessage.split("\n").map((line, index) => {
              return (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              );
            })}
          </p>
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

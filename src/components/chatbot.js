import { useState, useEffect, useRef } from "react";
import "./chatbot.css";  // Import the normal CSS file

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [...prev, { text: data.text, sender: "bot" }]);
      } else {
        console.error("Error in bot response:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-button"
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            Chatbot Assistant
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="chatbot-input"
            />
            <button
              onClick={handleSend}
              className="chatbot-send-button"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

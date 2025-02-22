import { useState, useEffect, useRef } from "react";
import 'animate.css'; 

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

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
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-600 to-blue-500 p-6">
      <div className="flex-1 overflow-y-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg max-w-[75%] transition-all duration-300 ease-in-out transform ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto shadow-xl"
                  : "bg-gray-300 text-black self-start mr-auto shadow-md"
              } animate__animated animate__fadeIn`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-4 mt-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="border rounded-full p-3 w-full focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 ease-in-out shadow-lg"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

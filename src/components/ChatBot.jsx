import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Mic, PaperclipIcon } from "lucide-react";

const ChatBot = ({ person_name }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [userName, setUserName] = useState("");

  const [messages, setMessages] = useState([
    {
      text: `Hello ${userName}! I'm ICICI Bank's AI assistant. How can I help you today?`,
      sender: "bot",
      time: new Date(),
    },
  ]);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("iciciUserDetails");
    if (storedUserDetails) {
      const parsedDetails = JSON.parse(storedUserDetails);
      setUserName(parsedDetails.name);

      // Set initial message after retrieving userName
      setMessages([
        {
          text: `Hello ${parsedDetails.name}! I'm ICICI Bank's AI assistant. How can I help you today?`,
          sender: "bot",
          time: new Date(),
        },
      ]);
    } else {
      // Default message if userName is not found
      setMessages([
        {
          text: `Hello! I'm ICICI Bank's AI assistant. How can I help you today?`,
          sender: "bot",
          time: new Date(),
        },
      ]);
    }
  }, []);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage = { text: newMessage, sender: "user", time: new Date() };
    setMessages([...messages, userMessage]);
    setNewMessage("");
    await handlePostRequest(newMessage, messages);
  };
  const handlePostRequest = async (question, message) => {
    // Set up the data to be sent in the body of the POST request
    const data = {
      policy: `smart`,
      question,
      history: messages,
      hybrid: true,
    };

    try {
      const response = await fetch("https://interactive.hivoco.com/api/chat", {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(data), // Convert the data object to JSON
      });

      // Handle the response
      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      let botResponse = {
        text: result.answer,
        sender: "bot",
        time: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (err) {
      //   setError(err.message); // Handle any errors
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format time for messages
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-all duration-300
                  ${
                    isOpen
                      ? "bg-red-500 rotate-90 hover:bg-red-600"
                      : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageSquare size={24} className="text-white" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform origin-bottom-right
                  ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        style={{
          maxHeight: isOpen ? "500px" : "1px",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {/* Chat header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
              <MessageSquare size={16} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-white">ICICI Bank Assistant</h3>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="text-white hover:text-white/80"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat messages */}
        <div className="p-4 h-80 overflow-y-auto bg-gray-50 text-start">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-orange-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none"
                }`}
              >
                <p className="text-sm ">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.time)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-full text-black py-2 px-4 focus:outline-none focus:border-orange-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <button
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-r-full"
              onClick={handleSend}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

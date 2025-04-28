import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ComplaintChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help with your customer service needs.", sender: "bot" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    email: "",
    orderNumber: "",
    category: "general" 
  });
  const [step, setStep] = useState("welcome");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplaintMode, setIsComplaintMode] = useState(false);
  const [complainDetails, setComplainDetails] = useState("");
  const messagesEndRef = useRef(null);

  const productCategories = [
    "Men's Shoes",
    "Women's Shoes",
    "Sports Shoes",
    "Casual Shoes",
    "Formal Shoes",
    "Men's Clothing",
    "Women's Clothing",
    "Kid's Clothing"  ,
    "Men's Watches",
    "Women's Watches",
    "Smartwatches",
    "Luxury Watches" ,
    "Mobile Accessories",
    "Laptop Accessories",
    "Other Accessories" 
  ];

  const greetingPhrases = [
    "hello", "hi", "hey", "good morning", "good afternoon", 
    "good evening", "how are you", "what's up", "help",
    "thank you", "thanks", "ok", "okay", "bye", "goodbye"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const isGreeting = (text) => {
    const lowercaseText = text.toLowerCase();
    return greetingPhrases.some(phrase => lowercaseText.includes(phrase)) && 
           lowercaseText.split(" ").length < 5; 
  };

  const startChat = () => {
    if (!customerInfo.customerName || !customerInfo.email) {
      setMessages([
        ...messages,
        { text: "Please fill in at least your name and email to continue.", sender: "bot" }
      ]);
      return;
    }
    
    setMessages([
      ...messages,
      { text: `Thank you ${customerInfo.customerName}! How can I help you today? You can check order status, browse products, or file a complaint.`, sender: "bot" }
    ]);
    setStep("chat");
  };

  const handleOrderStatus = () => {
    if (!customerInfo.orderNumber) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Please provide your order number to check status:", sender: "bot" }
      ]);
      setStep("orderInput");
      return;
    }
    
    checkOrderStatus();
  };

  const checkOrderStatus = () => {
    setMessages(prevMessages => [
      ...prevMessages,
      { text: "Checking order status...", sender: "bot", isLoading: true }
    ]);
    
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isLoading)
      );
      
      setMessages(prevMessages => [
        ...prevMessages,
        { text: `Your order #${customerInfo.orderNumber} is currently in transit and expected to arrive in this week.`, sender: "bot" }
      ]);
    }, 1500);
  };

  const handleCategorySelect = (category) => {
    setCustomerInfo({
      ...customerInfo,
      category
    });
    
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `You've selected ${category}. Please describe your complaint in detail:`, sender: "bot" }
    ]);
    
    setIsComplaintMode(true);
  };

  const showComplaintOptions = () => {
    setMessages(prevMessages => [
      ...prevMessages,
      { text: "Please select the category for your complaint:", sender: "bot" }
    ]);
    
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        categories: productCategories, 
        sender: "bot",
        type: "categorySelection"
      }
    ]);
  };

  const submitComplaint = async () => {
    if (!complainDetails.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Please provide details about your complaint before submitting.", sender: "bot" }
      ]);
      return;
    }
    
    setIsSubmitting(true);
    
    setMessages(prevMessages => [
      ...prevMessages, 
      { text: "Processing your complaint...", sender: "bot", isLoading: true }
    ]);

    try {
      const response = await axios.post("http://localhost:5000/api/complaints", { 
        message: complainDetails,
        customerName: customerInfo.customerName,
        email: customerInfo.email,
        orderNumber: customerInfo.orderNumber,
        category: customerInfo.category
      });
      
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isLoading)
      );
      
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: `Your complaint #${response.data.complaintId || "C" + Math.floor(Math.random() * 10000)} has been registered. Our team will review it and contact you within 24 hours.`, 
          sender: "bot" 
        }
      ]);
      
      setIsComplaintMode(false);
      setComplainDetails("");
    } catch (error) {
      console.error("Error sending complaint:", error);
      
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isLoading)
      );
      
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: "Sorry, there was an error processing your complaint. Please try again later.", 
          sender: "bot",
          isError: true
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrowseProducts = () => {
    setMessages(prevMessages => [
      ...prevMessages,
      { text: "Please select a product category to browse:", sender: "bot" }
    ]);
    
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        categories: productCategories, 
        sender: "bot",
        type: "productBrowsing"
      }
    ]);
  };

  const handleProductCategory = (category) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { text: `Showing top products in ${category}:`, sender: "bot" }
    ]);
    
    const products = [
      { name: `Click on below Link `, price: "http://localhost:3000/products", rating: "Fashniz" },
    ];
    
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        products, 
        sender: "bot",
        type: "productList"
      }
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    const messageText = newMessage.trim();
    
    const userMessage = { text: messageText, sender: "user" };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    setNewMessage("");
    
    if (isComplaintMode) {
      setComplainDetails(messageText);
      
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          text: `You're about to submit the following complaint in the ${customerInfo.category} category:\n\n"${messageText}"\n\nIs this correct?`, 
          sender: "bot",
          type: "confirmation",
          confirmAction: "submitComplaint"
        }
      ]);
      return;
    }
    
    if (messageText.toLowerCase().includes("order status") || 
        messageText.toLowerCase().includes("track") || 
        messageText.toLowerCase().includes("where is my order")) {
      handleOrderStatus();
      return;
    }
    
    if (messageText.toLowerCase().includes("browse") || 
        messageText.toLowerCase().includes("show products") || 
        messageText.toLowerCase().includes("catalog")) {
      handleBrowseProducts();
      return;
    }
    
    if (messageText.toLowerCase().includes("complaint") || 
        messageText.toLowerCase().includes("issue") || 
        messageText.toLowerCase().includes("problem") || 
        messageText.toLowerCase().includes("not working")) {
      showComplaintOptions();
      return;
    }
    
    if (isGreeting(messageText)) {
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          text: "How can I help you today? You can:\n• Check order status\n• Browse products\n• File a complaint\n\nJust let me know what you need!", 
          sender: "bot" 
        }
      ]);
      return;
    }
    
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        text: "I notice you might have an issue. Would you like to file a formal complaint about this?", 
        sender: "bot",
        type: "complaintQuestion"
      }
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  const handleConfirmation = (action, response) => {
    if (response === "yes" && action === "submitComplaint") {
      submitComplaint();
    } else {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Would you like to revise your complaint or try something else?", sender: "bot" }
      ]);
      setIsComplaintMode(false);
    }
  };

  const handleSpecialButtonClick = (type, value) => {
    if (type === "categorySelection") {
      handleCategorySelect(value);
    } else if (type === "productBrowsing") {
      handleProductCategory(value);
    } else if (type === "confirmation") {
      handleConfirmation("submitComplaint", value);
    } else if (type === "complaintQuestion") {
      if (value === "yes") {
        showComplaintOptions();
      } else {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "How else can I help you today?", sender: "bot" }
        ]);
      }
    }
  };

  const renderSpecialMessage = (message) => {
    if (message.type === "categorySelection" || message.type === "productBrowsing") {
      return (
        <div className="grid grid-cols-2 gap-2 my-2">
          {message.categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => handleSpecialButtonClick(message.type, category)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded text-sm transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      );
    }
    
    if (message.type === "productList") {
      return (
<div className="bg-gray-100 p-2 rounded">
  {message.products.map((product, idx) => (
    <div key={idx} className="border-b border-gray-200 py-2 last:border-b-0">
      <div className="font-medium">{product.name}</div>
      <div className="flex justify-between text-sm">
        <a
          href={product.price}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {product.price}
        </a>
        <span className="text-yellow-600">★ {product.rating}</span>
      </div>
    </div>
  ))}
</div>
      );
    }
    
    if (message.type === "confirmation") {
      return (
        <div className="my-2">
          <div className="flex space-x-2">
            <button
              onClick={() => handleSpecialButtonClick(message.type, "yes")}
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
            >
              Yes, Submit
            </button>
            <button
              onClick={() => handleSpecialButtonClick(message.type, "no")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded text-sm"
            >
              No, Revise
            </button>
          </div>
        </div>
      );
    }
    
    if (message.type === "complaintQuestion") {
      return (
        <div className="my-2">
          <div className="flex space-x-2">
            <button
              onClick={() => handleSpecialButtonClick(message.type, "yes")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
            >
              Yes, File Complaint
            </button>
            <button
              onClick={() => handleSpecialButtonClick(message.type, "no")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded text-sm"
            >
              No, Just Asking
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Icon Button */}
      <button 
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center relative"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between">
            <h3 className="font-medium">Customer Support</h3>
            {step == "chat" && (
              <div className="flex space-x-2">
                <button 
                  onClick={handleOrderStatus}
                  className="bg-blue-700 hover:bg-blue-800 text-xs px-2 py-1 rounded"
                >
                  Track Order
                </button>
                <button 
                  onClick={showComplaintOptions}
                  className="bg-blue-700 hover:bg-blue-800 text-xs px-2 py-1 rounded"
                >
                  File Complaint
                </button>
              </div>
            )}
          </div>

          {/* Chat Content */}
          {step === "welcome" && (
            <div className="p-4">
              <p className="mb-4">To help us assist you better, please provide your information:</p>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Name*</label>
                  <input 
                    type="text" 
                    name="customerName"
                    value={customerInfo.customerName}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address*</label>
                  <input 
                    type="email" 
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Number (if applicable)</label>
                  <input 
                    type="text" 
                    name="orderNumber"
                    value={customerInfo.orderNumber}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <button
                  type="button"
                  onClick={startChat}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                >
                  Start Chat
                </button>
              </form>
            </div>
          )}

          {step === "orderInput" && (
            <div className="p-4">
              <p className="mb-4">Please enter your order number:</p>
              <form className="space-y-3">
                <div>
                  <input 
                    type="text" 
                    name="orderNumber"
                    value={customerInfo.orderNumber}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g., ORD12345"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={checkOrderStatus}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                >
                  Check Status
                </button>
              </form>
            </div>
          )}

          {(step === "chat") && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-80">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[85%] ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : message.isError 
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.text}
                      {message.isLoading && (
                        <span className="ml-2 inline-block animate-pulse">...</span>
                      )}
                    </div>
                    {message.sender === "bot" && renderSpecialMessage(message)}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="border-t p-4 flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isComplaintMode ? "Describe your complaint in detail..." : "Type your message here..."}
                  className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className={`${
                    isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 rounded-r-lg`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
          
          {/* Chat Footer */}
          <div className="bg-gray-100 p-2 text-xs text-center text-gray-500">
            {isComplaintMode ? "Complaint mode active" : "Customer support powered by AI"}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintChatbot;
import React from "react";

const DeliveryMethod = ({ selectedMethod, updateDeliveryMethod, onNext, onBack }) => {
  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Delivery within 5-7 working days",
      cost: 150,
      estimatedDays: "5-7 business days",
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Delivery within 2-3 working days",
      cost: 200,
      estimatedDays: "2-3 business days",
    },
    {
      id: "same-day",
      name: "Same Day Delivery",
      description: "Available only in select metro cities",
      cost: 500,
      estimatedDays: "Today (Order before 11 AM)",
    },
  ];

  const handleMethodChange = (method, cost) => {
    updateDeliveryMethod(method, cost);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Delivery Method</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {deliveryOptions.map((option) => (
            <div
              key={option.id}
              className={`border rounded-lg p-4 transition cursor-pointer ${
                selectedMethod === option.id
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleMethodChange(option.id, option.cost)}
            >
              <div className="flex items-start md:items-center">
                <input
                  type="radio"
                  id={option.id}
                  name="deliveryMethod"
                  checked={selectedMethod === option.id}
                  onChange={() => handleMethodChange(option.id, option.cost)}
                  className="mt-1 h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                />
                <label
                  htmlFor={option.id}
                  className="ml-3 flex-grow cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{option.name}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Estimated arrival: {option.estimatedDays}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <span className="text-lg font-medium">
                      {option.cost === 0 ? "FREE" : `Rs ${option.cost}`}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="order-2 sm:order-1 px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Address
            </button>
            <button
              type="submit"
              className="order-1 sm:order-2 px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeliveryMethod;
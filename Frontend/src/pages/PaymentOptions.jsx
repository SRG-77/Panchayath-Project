import React from "react";
import { FaCreditCard, FaUniversity, FaMobileAlt } from "react-icons/fa"; // modern icons

export default function PaymentOptions() {
  const paymentMethods = [
    {
      id: 1,
      name: "UPI",
      description: "Pay instantly using your favorite UPI app (Google Pay, PhonePe, Paytm).",
      icon: <FaMobileAlt size={50} className="text-green-500" />,
    },
    {
      id: 2,
      name: "Credit / Debit Card",
      description: "Pay securely using Visa, MasterCard, or Rupay cards.",
      icon: <FaCreditCard size={50} className="text-blue-500" />,
    },
    {
      id: 3,
      name: "Net Banking",
      description: "Transfer directly from your bank account using net banking.",
      icon: <FaUniversity size={50} className="text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-teal-50 p-10">
      {/* Quote Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
          “Even a small donation can make a big difference in someone’s world”
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose a payment method below to support our cause. Every contribution matters.
        </p>
      </div>

      {/* Payment Method Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center text-center hover:scale-105 duration-300"
          >
            <div className="mb-4">{method.icon}</div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">{method.name}</h2>
            <p className="text-gray-600">{method.description}</p>
            <button
              className="mt-6 bg-green-600 text-white py-3 px-8 rounded-2xl hover:bg-green-700 transition-colors font-medium"
              onClick={() =>
                alert(`You selected ${method.name}. Payment functionality coming soon!`)
              }
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

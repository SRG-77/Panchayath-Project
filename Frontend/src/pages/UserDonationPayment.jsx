import React, { useState, useEffect } from "react";

export default function PaymentOptions() {
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [donations, setDonations] = useState([]);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch recent donations
  const fetchDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/payment/all");
      const data = await res.json();
      // Only show successful payments
      const successful = data.filter(d => d.status === "paid");
      setDonations(successful);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();

      const options = {
        key: "rzp_test_RWaFw1XRMDC4xl",
        amount: data.amount,
        currency: "INR",
        name: "Donation",
        description: "Donate for Good",
        order_id: data.id,
        handler: async function (response) {
          const verifyRes = await fetch("http://localhost:5000/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.status === "success") {
            const newDonation = {
              _id: data.id,
              amount: Number(amount) * 100,
              status: "paid",
              createdAt: new Date(),
            };
            setDonations([newDonation, ...donations]);
            setPaymentStatus({ success: true, message: `Payment of ₹${amount} successful!` });
            setAmount("");
          } else {
            setPaymentStatus({ success: false, message: "Payment failed. Please try again." });
          }
        },
        prefill: { name: "John Doe", email: "john@example.com", contact: "9999999999" },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setPaymentStatus({ success: false, message: "Payment failed, try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-teal-50 p-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
          “Even a small donation can make a big difference in someone’s world”
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Enter your donation amount and click "Donate for Good".
        </p>
      </div>

      <div className="text-center mb-8">
        <input
          type="number"
          placeholder="Enter donation amount in ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border-2 border-gray-300 rounded-xl p-3 w-64 text-center"
        />
      </div>

      <div className="text-center">
        <button
          className="bg-green-600 text-white py-3 px-8 rounded-2xl hover:bg-green-700 transition-colors font-medium"
          onClick={handlePayment}
        >
          Donate for Good
        </button>
      </div>

      {paymentStatus && (
        <div
          className={`mt-8 text-center p-4 rounded-xl ${
            paymentStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {paymentStatus.message}
        </div>
      )}

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Recent Donations</h2>
        {donations.length === 0 ? (
          <p className="text-gray-600">No donations yet. Be the first!</p>
        ) : (
          <ul className="space-y-4">
            {donations.map((d) => (
              <li
                key={d._id}
                className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">₹{d.amount / 100}</p>
                  <p className="text-gray-500 text-sm">Paid</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

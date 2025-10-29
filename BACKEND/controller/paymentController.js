const Razorpay = require("../config/razorpay");
const Payment = require("../model/payment");
const crypto = require("crypto");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ msg: "Invalid amount" });

    const order = await Razorpay.orders.create({
      amount: amount * 100, // convert rupees to paise
      currency: "INR",
      receipt: "receipt_" + Math.floor(Math.random() * 10000),
    });

    const payment = new Payment({
      orderId: order.id,
      amount: order.amount,
      method: "Razorpay", // optional field for record-keeping
    });
    await payment.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id, status: "paid" }
      );
      return res.json({ status: "success" });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Fetch recent donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Payment.find().sort({ createdAt: -1 }).limit(10);
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const mongoose = require('mongoose');

/**
 * Counter schema for generating sequential order numbers per user.
 */
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

/**
 * Generate a sequential, human-readable order number.
 * Format: ORD-00001, ORD-00002, etc.
 * Each user gets their own sequence.
 *
 * @param {string} userId - The user's ID
 * @returns {string} The generated order number
 */
const generateOrderNumber = async (userId) => {
  const counter = await Counter.findByIdAndUpdate(
    `order_${userId}`,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `ORD-${String(counter.seq).padStart(5, '0')}`;
};

module.exports = generateOrderNumber;

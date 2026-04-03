const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  type: { type: String, enum: ['remote', 'on-ground'], required: true },
  status: { type: String, enum: ['open', 'accepted', 'closed'], default: 'open' },
  deadline: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

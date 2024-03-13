const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    due_date: { type: Date, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO', required: true },
    priority: { type: Number, default: 0 },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

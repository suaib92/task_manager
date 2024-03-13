const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    status: { type: Number, enum: [0, 1], default: 0 },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SubTask', subTaskSchema);

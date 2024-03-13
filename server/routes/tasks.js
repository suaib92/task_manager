const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticateToken = require('../middleware/authenticateToken');
const  mongoose  = require('mongoose');

// Apply authentication middleware to all routes in this router
router.use(authenticateToken);

// Create task
router.post('/', async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        const task = new Task({
            title,
            description,
            due_date,
            user_id:  new mongoose.Types.ObjectId(req.user.user_id), // Use req.user._id to ensure proper user_id assignment
            status: "TODO"
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all user tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user_id: req.user._id });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { due_date, status } = req.body;
        const task = await Task.findByIdAndUpdate(id, { due_date, status }, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete task (soft deletion)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, { deleted_at: Date.now() }, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

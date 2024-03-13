const express = require('express');
const router = express.Router();
const SubTask = require('../models/SubTask');
const authenticateToken = require('../middleware/authenticateToken');
const mongoose = require('mongoose');

// Apply authentication middleware to all routes in this router
router.use(authenticateToken);

// Create subtask
router.post('/', async (req, res) => {
    try {
        const { task_id } = req.body;
        const subTask = new SubTask({ task_id, status: 0 });
        await subTask.save();
        console.log(subTask)
        res.status(201).json(subTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all user subtasks
router.get('/', async (req, res) => {
    try {
        const { task_id } = req.query;
        let subTasks;
        if (task_id) {
            subTasks = await SubTask.find({ task_id });
        } else {
            subTasks = await SubTask.find();
        }
        res.json(subTasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update subtask
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const subTask = await SubTask.findByIdAndUpdate(id, { status }, { new: true });
        if (!subTask) {
            return res.status(404).json({ error: 'Sub Task not found' });
        }
        res.json(subTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete subtask (soft deletion)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const subTask = await SubTask.findByIdAndUpdate(id, { deleted_at: Date.now() }, { new: true });
        if (!subTask) {
            return res.status(404).json({ error: 'Sub Task not found' });
        }
        res.json({ message: 'Sub Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

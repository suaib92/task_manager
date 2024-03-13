const express = require('express');
const cronJobs = require('./cronJobs');
const taskRoutes = require('./routes/tasks');
const subTaskRoutes = require('./routes/subtasks');
const connector = require('./connector');
const authenticateToken = require('./middleware/authenticateToken');
require('dotenv').config();

// Call connector to establish MongoDB connection
connector();

const app = express();
app.use(express.json());



// API routes
app.use('/tasks', authenticateToken, taskRoutes); // Protected route
app.use('/subtasks', authenticateToken, subTaskRoutes); // Protected route

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

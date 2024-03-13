const cron = require('node-cron');
const Task = require('./models/Task');
const User = require('./models/User');
const twilio = require('twilio');

// Replace these values with your actual Twilio credentials
const accountSid = 'AC2d98e265dc6af99b2d0a6185013838e8';
const authToken = 'ce97a35ce4bc842a7646618dbcd71e00';

// Cron logic for changing priority of task based on due_date
cron.schedule('0 0 * * *', async () => {
    try {
        const tasks = await Task.find();
        tasks.forEach(async task => {
            const today = new Date();
            const dueDate = new Date(task.due_date);
            const differenceInDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            let priority;
            if (differenceInDays === 0) {
                priority = 0;
            } else if (differenceInDays <= 2) {
                priority = 1;
            } else if (differenceInDays <= 4) {
                priority = 2;
            } else {
                priority = 3;
            }

            await Task.findByIdAndUpdate(task._id, { priority });
        });
    } catch (err) {
        console.error('Error in changing priority:', err);
    }
});

// Cron logic for voice calling using Twilio if a task passes its due_date
cron.schedule('0 0 * * *', async () => {
    try {
        const users = await User.find().sort({ priority: 'asc' });
        for (const user of users) {
            const tasks = await Task.find({ user_id: user._id, status: 'TODO', due_date: { $lt: new Date() } });
            for (const task of tasks) {
                await callUser(task, user.phone_number);
            }
        }
    } catch (err) {
        console.error('Error in voice calling:', err);
    }
});

async function callUser(task, phoneNumber) {
    try {
        // Make Twilio voice call
        await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: phoneNumber,
            from: 'YOUR_TWILIO_PHONE_NUMBER'
        });
        // Update task status to IN_PROGRESS after making the call
        await Task.findByIdAndUpdate(task._id, { status: 'IN_PROGRESS' });
    } catch (err) {
        console.error('Error making voice call:', err);
    }
}

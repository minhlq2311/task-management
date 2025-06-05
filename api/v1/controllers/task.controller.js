// function to get all tasks
const Task = require('../models/task.model');

const index = async (req, res) => {
    try {
        const tasks = await Task.find({ deleted: false });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}

// function to get task details by id
const details = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        if (!task || task.deleted) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task details' });
    }  
}

module.exports = {
    index,
    details
};
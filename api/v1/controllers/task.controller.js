// function to get all tasks
const Task = require('../models/task.model');
const paginationHelper = require('../../../helpers/pagination.js');
const searchHelper = require('../../../helpers/search.js');

// [GET] /api/v1/tasks
const index = async (req, res) => {
    try {
        const find = {
            deleted: false
        }
        // Filter status 
        if(req.query.status){
            find.status = req.query.status;
        }

        // Pagination
        const countRecords = await Task.countDocuments(find);
        let objectPagination = paginationHelper({
            limitItems: 2,
            currentPage: 1,
        }, req.query, countRecords);

        // Search
        const objectSearch = searchHelper(req.query);
        if(objectSearch.regex){
            find.title = objectSearch.regex;
        }
        // Sort
        const sort = {};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue
        }
        const tasks = await Task.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItems);

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}

// [GET] /api/v1/tasks/details/:id
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

// [PATCH] /api/v1/tasks/change-status/:id
const changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    const validStatuses = ['initial', 'doing', 'pending', 'finish'];
    try {
        const task = await Task.findById(id);
        if (!task || task.deleted) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        task.status = status;
        await task.save();
        res.json({
            code: 200,
            message: 'Task status updated successfully',
            task: task
        });
    } catch (error) {
        res.status(500).json({ message: 'Error changing task status' });
    }
};

module.exports = {
    index,
    details,
    changeStatus
};
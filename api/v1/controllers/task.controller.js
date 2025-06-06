// function to get all tasks
const Task = require('../models/task.model');
const paginationHelper = require('../../../helpers/pagination.js');
const searchHelper = require('../../../helpers/search.js');

// [GET] /api/v1/tasks
const index = async (req, res) => {
    try {
        const find = {
            $or: [
                {createdBy: req.user._id},
                {listUsers: req.user._id}
            ],
            deleted: false
        };
        // Filter status
        if (req.query.status) {
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
        if (objectSearch.regex) {
            find.title = objectSearch.regex;
        }
        // Sort
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
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

// [PATCH] /api/v1/tasks/change-multi
const changeMulti = async (req, res) => {
    const { ids, key, value } = req.body;
    switch (key) {
        case 'status':
            const validStatuses = ['initial', 'doing', 'pending', 'finish'];
            if (!validStatuses.includes(value)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            await Task.updateMany(
                { _id: { $in: ids }, deleted: false },
                { $set: { status: value } }
            );
            return res.json({
                code: 200,
                message: 'Tasks status updated successfully',
            });
            break;

        case 'deleted':
            await Task.updateMany(
                { _id: { $in: ids }, deleted: false },
                { $set: { deleted: true, deletedAt: new Date() } }
            );
            return res.json({
                code: 200,
                message: 'Tasks deleted successfully',
            });
        default:
            return res.status(400).json({ message: 'Invalid key' });
    }
};

// [POST] /api/v1/tasks/create
const create = async (req, res) => {
    try {
        const task = new Task(req.body);
        task.createdBy = req.user._id; // Attach the user ID to the task
        await task.save();
        res.status(201).json({
            code: 201,
            message: 'Task created successfully',
            task: task
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
};

// [PATCH] /api/v1/tasks/update/:id
const update = async (req, res) => {
    const id = req.params.id;
    try {
        await Task.updateOne(
            { _id: id, deleted: false },
            { $set: req.body }
        );
        res.json({
            code: 200,
            message: 'Task updated successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};


// [DELETE] /api/v1/tasks/delete/:id
const deleteTask = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        if (!task || task.deleted) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.deleted = true;
        task.deletedAt = new Date();
        await task.save();
        res.json({
            code: 200,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

module.exports = {
    index,
    details,
    changeStatus,
    changeMulti,
    create,
    update,
    deleteTask
};
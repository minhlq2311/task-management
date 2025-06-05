// function to get all tasks
const Task = require('../models/task.model');
const paginationHelper = require('../../../helpers/pagination.js');
const searchHelper = require('../../../helpers/search.js');
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
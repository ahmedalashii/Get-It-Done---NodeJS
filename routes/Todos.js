const express = require('express');
const router = express.Router();
//! Router is a middleware in Express that allows you to group the route handlers for a particular part of a site together and access them using a common route-prefix.
const Todo = require('../models/Todos');

// Get All Todo routes
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find(); // find() method returns all the documents in a collection.
        res.json(todos);
    } catch (err) {
        res.json({ message: err });
    }
});

// CRUD >> Create, Read, Update, Delete
// Create a Todo route >> POST method
router.post('/new', async (req, res) => {
    /*
        Schema:
        {
            todo: String,
            author: String,
            creationDate: Date,
            sort: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
            enum: Object.values(status),
             status: {
                type: String,
                enum: ["NOT_STARTED", "IN_PROGRESS", "DONE", "CANCELLED"],
                default: "NOT_STARTED"
            },
            subTodos: [{
                todo: String,
                author: String,
                creationDate: Date,
                sort: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
                enum: Object.values(status),
                status: {
                    type: String,
                    enum: ["NOT_STARTED", "IN_PROGRESS", "DONE", "CANCELLED"],
                    default: "NOT_STARTED"
                },
            }]
        }
    */
    const newTodo = new Todo(
        // req.body is the data that the Vue App will send
        // {
        //     todo: req.body.todo,
        //     author: req.body.author,
        //     creationDate: req.body.creationDate,
        //     sort: req.body.sort,
        //     status: req.body.status,
        //     subTodos: req.body.subTodos
        // },
        //! I'll make it static for now
        {
            todo: "I'll clean my room",
            author: "Ahmed Alashi",
            creationDate: new Date(),
            sort: 1,
            status: "NOT_STARTED",
            subTodos: [
                {
                    todo: "I'll clean my desk",
                    author: "Ahmed Alashi",
                    creationDate: new Date(),
                    sort: 1,
                    status: "NOT_STARTED",
                },
                {
                    todo: "I'll clean my bed",
                    author: "Ahmed Alashi",
                    creationDate: new Date(),
                    sort: 2,
                    status: "NOT_STARTED",
                },
            ],
        },
    );
    try {
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Add a subTodo route >> POST method
router.post('/new-sub-todo/:todoId', async (req, res) => {
    /*
        Schema:
        {
            todo: String,
            author: String,
            creationDate: Date,
            sort: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
            enum: Object.values(status),
            status: {
                type: String,
                enum: ["NOT_STARTED", "IN_PROGRESS", "DONE", "CANCELLED"],
                default: "NOT_STARTED"
            },
        }
    */
    const newSubTodo = {
        todo: req.body.todo,
        author: req.body.author,
        creationDate: req.body.creationDate,
        sort: req.body.sort,
        status: req.body.status,
    };
    try {
        const savedSubTodo = await Todo.updateOne(
            { _id: req.params.todoId },
            { $push: { subTodos: newSubTodo } },
        ); // updateOne() method updates a single document within the collection based on the filter.
        res.json(savedSubTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get a specific Todo route by ID >> GET method
router.get('/get/:todoId', async (req, res) => { // :todoId is a parameter >> it's like a path parameter in laravel
    try {
        const specificTodo = await Todo.findById({ _id: req.params.todoId }); // findById() method returns a single document by its _id field.
        res.json(specificTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get a specific subTodo route by ID >> GET method
router.get('/get-sub-todo/:todoId/:subTodoId', async (req, res) => {
    try {
        const specificSubTodo = await Todo.findOne(
            { _id: req.params.todoId },
            { subTodos: { $elemMatch: { _id: req.params.subTodoId } } },
        ); // findOne() method returns a single document that satisfies the specified query criteria.
        res.json(specificSubTodo);
    } catch (err) {
        res.json({ message: err });
    }
});


// Delete a specific Todo route by ID >> DELETE method
router.delete('/delete/:todoId', async (req, res) => {
    try {
        const removedTodo = await Todo.findByIdAndDelete({ _id: req.params.todoId }); // findByIdAndDelete() method deletes a single document based on its _id field.
        res.json(removedTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Delete a subTodo route by ID >> DELETE method
router.delete('/delete-sub-todo/:todoId/:subTodoId', async (req, res) => {
    try {
        const removedSubTodo = await Todo.updateOne(
            { _id: req.params.todoId },
            { $pull: { subTodos: { _id: req.params.subTodoId } } },
        ); // updateOne() method updates a single document within the collection based on the filter.
        res.json(removedSubTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Update a specific Todo route by ID >> PUT method
router.put('/update/:todoId', async (req, res) => {
    try {
        const todo = {
            todo: req.body.todo,
            author: req.body.author,
            status: req.body.status,
            sort: req.body.sort,
            subTodos: req.body.subTodos,
        }
        const updatedTodo = await Todo.updateOne(
            { _id: req.params.todoId },
            { $set: todo },
        ); // updateOne() method updates a single document within the collection based on the filter.
        res.json(updatedTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Update a specific subTodo route by ID >> PATCH method
router.patch('/update-sub-todo/:todoId/:subTodoId', async (req, res) => {
    try {
        const updatedSubTodo = await Todo.updateOne(
            { _id: req.params.todoId, "subTodos._id": req.params.subTodoId },
            { $set: { "subTodos.$.todo": req.body.todo } },
        ); // updateOne() method updates a single document within the collection based on the filter.
        res.json(updatedSubTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
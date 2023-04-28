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

/*
    Schema:
    {
        todo: String,
        author: String,
        created_at: Date,
        updated_at: Date,
        deadline: Date,
        completed_at: Date,
        sort: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
        enum: Object.values(status),
         status: {
            type: String,
            enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"],
            default: "NOT_STARTED"
        },
        subTodos: [{
            todo: String,
            author: String,
            created_at: Date,
            updated_at: Date,
            deadline: Date,
            completed_at: Date,
            sort: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
            enum: Object.values(status),
            status: {
                type: String,
                enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"],
                default: "NOT_STARTED"
            },
        }]
    }
*/

// CRUD >> Create, Read, Update, Delete
// Create a Todo route >> POST method
router.post('/new', async (req, res) => {
    const request = req.body;   // req.body is the data that the Vue App will send
    // Validating the data before we create a new Todo >> A best practice is to validate the data on the client side as well
    if (!request.todo || !request.author || !request.deadline || !request.sort) { // Mongoose Schema also offer validation, We can use express-validator as well , but for now we will just check if the required fields are filled
        return res.status(400).json({ message: "Please fill in all the required fields (todo, author, deadline, sort)." });
    }
    const newTodo = new Todo(
        {
            todo: request.todo,
            author: request.author,
            created_at: new Date(),
            updated_at: new Date(),
            deadline: request.deadline,
            sort: request.sort,
            status: request.status ?? "NOT_STARTED", // when we create a todo it will be "NOT_STARTED" by default >> ?? is a Nullish coalescing operator
            subTodos: request.subTodos ?? [],
        },
    );
    if (newTodo.status === "COMPLETED") { // if the todo is added as completed then we will add the completed_at date >> this is only if there's a possibility to choose the status when adding a todo
        newTodo.completed_at = new Date();
    }
    try {
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Add a subTodo route >> POST method
router.post('/new-sub-todo/:todoId', async (req, res) => {
    // Validating the data before we create a new subTodo >> A best practice is to validate the data on the client side as well
    const request = req.body;
    if (!request.todo || !request.author || !request.sort || !request.deadline) {
        return res.status(400).json({ message: "Please fill in all the required fields (todo, author, deadline, sort)." });
    }
    const newSubTodo = {
        todo: request.todo,
        author: request.author,
        created_at: new Date(),
        updated_at: new Date(),
        deadline: request.deadline,
        sort: request.sort,
        status: request.status ?? "NOT_STARTED", // when we create a subTodo it will be "NOT_STARTED" by default
    };
    if (newSubTodo.status === "COMPLETED") { // if the subTodo is added as completed then we will add the completed_at date >> this is only if there's a possibility to choose the status when adding a subTodo
        newSubTodo.completed_at = new Date();
    }
    try {
        const savedSubTodo = await Todo.updateOne(
            { _id: req.params.todoId },
            { $push: { subTodos: newSubTodo } }, // $push operator appends a specified value to an array.
        ); // updateOne() method updates a single document within the collection based on the filter.
        res.json(savedSubTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get a specific Todo route by ID >> GET method
router.get('/get/:todoId', async (req, res) => {
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

// Update a specific Todo route by ID >> PUT method
router.put('/update/:todoId', async (req, res) => {
    try {
        const request = req.body;
        // Validating the data before we update a Todo >> A best practice is to validate the data on the client side as well
        if (!request.todo && !request.author && !request.sort && !request.status && !request.subTodos && !request.deadline) {
            return res.status(400).json({ message: "Please fill in at least one field to update (todo, author, deadline, sort, status, subTodos)." });
        }
        const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
        if (request.status && !statuses.includes(request.status)) {
            return res.status(400).json({ message: "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED." });
        }
        const oldTodo = await Todo.findById({ _id: req.params.todoId });
        const todo = {
            todo: request.todo ?? oldTodo.todo,
            author: request.author ?? oldTodo.author,
            updated_at: new Date(),
            deadline: request.deadline ?? oldTodo.deadline,
            sort: request.sort ?? oldTodo.sort,
            status: request.status ?? oldTodo.status,
            subTodos: request.subTodos ?? oldTodo.subTodos,
        };
        if (todo.status === "COMPLETED") {
            todo.completed_at = new Date();
        }
        const updatedTodo = await Todo.updateOne(
            { _id: req.params.todoId },
            { $set: todo },
        );
        res.json(updatedTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

// Update a specific subTodo route by ID >> PATCH method
router.patch('/update-sub-todo/:todoId/:subTodoId', async (req, res) => {
    try {
        const request = req.body;
        // Validating the data before we update a subTodo >> A best practice is to validate the data on the client side as well
        if (!request.todo && !request.author && !request.status && !request.sort && !request.deadline) {
            return res.status(400).json({ message: "Please fill in at least one field to update (todo, author, deadline, sort, status)." });
        }
        const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
        if (request.status && !statuses.includes(request.status)) {
            return res.status(400).json({ message: "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED." });
        }
        const parentTodo = await Todo.findById({ _id: req.params.todoId });
        //? Can we update a subTodo for a canceled todo? >> No, we can't update
        if (parentTodo.status === "CANCELED") {
            return res.status(400).json({ message: "You can't update a subTodo for a canceled todo." });
        }
        const oldSubTodo = await Todo.findOne(
            { _id: req.params.todoId, "subTodos._id": req.params.subTodoId },
        );
        const subTodo = {
            todo: request.todo ?? oldSubTodo.subTodos[0].todo,
            author: request.author ?? oldSubTodo.subTodos[0].author,
            status: request.status ?? oldSubTodo.subTodos[0].status,
            updated_at: new Date(),
            deadline: request.deadline ?? oldSubTodo.subTodos[0].deadline,
            sort: request.sort ?? oldSubTodo.subTodos[0].sort,
        };
        if (subTodo.status === "IN_PROGRESS" || subTodo.status === "COMPLETED") {
            if (subTodo.status === "COMPLETED") {
                subTodo.completed_at = new Date();
            }
            await Todo.updateOne(
                { _id: req.params.todoId },
                { $set: { status: "IN_PROGRESS" } }, // For the subtodo, being in progress or completed means that the todo is in progress >> completed subtodo doesn't mean that the todo is completed >> it may have other subtodos that are not completed yet
            );
        }
        const updatedSubTodo = await Todo.updateOne(
            { _id: req.params.todoId, "subTodos._id": req.params.subTodoId },
            { $set: { "subTodos.$": subTodo } },
        );
        res.json(updatedSubTodo);
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
        );
        res.json(removedSubTodo);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;
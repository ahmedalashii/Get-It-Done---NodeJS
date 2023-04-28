const express = require('express');
const router = express.Router();
//! Router is a middleware in Express that allows you to group the route handlers for a particular part of a site together and access them using a common route-prefix.
const TodoController = require("../controllers/todo.controller");

// Get All Todo routes
router.get('/', TodoController.apiGetAllTodos);

// Get a specific Todo route by ID >> GET method
router.get('/get/:todoId', TodoController.apiGetTodoById);

// Get a specific subTodo route by ID >> GET method
router.get('/get-sub-todo/:todoId/:subTodoId', TodoController.apiGetSubTodoByIDs);

// Create a Todo route >> POST method
router.post('/new', TodoController.apiCreateNewTodo);

// Add a subTodo route >> POST method
router.post('/new-sub-todo/:todoId', TodoController.apiCreateNewSubTodoByTodoId);

// Update a specific Todo route by ID >> PUT method
router.put('/update/:todoId', TodoController.apiUpdateTodoById);

// Update a specific subTodo route by ID >> PATCH method
router.patch('/update-sub-todo/:todoId/:subTodoId', TodoController.apiUpdateSubTodoByIDs);

// Delete a specific Todo route by ID >> DELETE method
router.delete('/delete/:todoId', TodoController.apiDeleteTodoById);

// Delete a subTodo route by ID >> DELETE method
router.delete('/delete-sub-todo/:todoId/:subTodoId', TodoController.apiDeleteSubTodoByIDs);

module.exports = router;


/*
    ! Note: The structure of the Project is as follows:

    ├───── `index.js`
    ├───── `controllers`
        ├── todo.controller.js
    ├───── `models`
        ├── Todo.js
    ├───── `routes`
        ├── todo.routes.js
    ├───── `services`
        ├── TodoService.js
*/

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
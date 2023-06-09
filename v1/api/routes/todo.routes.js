const express = require('express');
const router = express.Router();
//! Router is a middleware in Express that allows you to group the route handlers for a particular part of a site together and access them using a common route-prefix.
const TodoController = require("../../../controllers/todo.controller");

//^ The pattern below is called "Chaining Routes" or "Route Grouping" or "Builder Design Pattern"
// Get All Todo routes
router.get('/', TodoController.apiGetAllTodos)
    // Get a specific Todo route by ID >> GET method
    .get('/get/:todoId', TodoController.apiGetTodoById)
    // Get a specific subTodo route by ID >> GET method
    .get('/get-sub-todo/:todoId/:subTodoId', TodoController.apiGetSubTodoByIDs)
    // Create a Todo route >> POST method
    .post('/new', TodoController.apiCreateNewTodo)
    // Add a subTodo route >> POST method
    .post('/new-sub-todo/:todoId', TodoController.apiCreateNewSubTodoByTodoId)
    // Update a specific Todo route by ID >> PUT method
    .put('/update/:todoId', TodoController.apiUpdateTodoById)
    // Update a specific subTodo route by ID >> PUT/PATCH method (PATCH is used to update a specific part of the object which is what we need here)
    .put('/update-sub-todo/:todoId/:subTodoId', TodoController.apiUpdateSubTodoByIDs)
    // Delete a specific Todo route by ID >> DELETE method
    .delete('/delete/:todoId', TodoController.apiDeleteTodoById)
    // Delete a subTodo route by ID >> DELETE method
    .delete('/delete-sub-todo/:todoId/:subTodoId', TodoController.apiDeleteSubTodoByIDs)
    // Delete All Todos route >> DELETE method
    .delete('/delete-all', TodoController.apiDeleteUserTodos)
    // User Todos Statistics
    .get('/statistics', TodoController.apiGetStatistics);

module.exports = router;

/*
    ! Note: The structure of the Project is as follows:

    ├───── `index.js`
    ├───── `controllers`
        ├── todo.controller.js
        ├── user.controller.js
    ├───── `models`
        ├── Todo.js
        ├── User.js
    ├───── `routes`
        ├── todo.routes.js
        ├── user.routes.js
    ├───── `services`
        ├── TodoService.js
        ├── UserService.js
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
        sequence: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
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
            sequence: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
            enum: Object.values(status),
            status: {
                type: String,
                enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"],
                default: "NOT_STARTED"
            },
        }]
    }
*/
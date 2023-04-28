const { request } = require("express");
const TodoService = require("../services/TodoService");

const todoController = class TodoController {
    static async apiGetAllTodos(request, response, next) {
        try {
            const todos = await TodoService.getAllTodos();
            if (!todos) {
                response.status(404).json({ message: "Couldn't Get All Todos" });
            }
            response.status(200).json(todos);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiGetTodoById(request, response, next) {
        try {
            const todo = await TodoService.getTodoById(request.params.todoId); // request.params.todoId is the id that we will get from the url >> /api/todos/:todoId
            if (!todo) {
                response.status(404).json({ message: "Couldn't Get Todo By Id" });
            }
            response.status(200).json(todo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiGetSubTodoByIDs(request, response, next) {
        try {
            const subTodo = await TodoService.getSubTodoByIDs(request.params.todoId, request.params.subTodoId);
            if (!subTodo) {
                response.status(404).json({ message: "Couldn't Get SubTodo By IDs" });
            }
            response.status(200).json(subTodo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiCreateNewTodo(request, response, next) {
        try {
            const body = request.body; // request.body is the data that the Vue App will send
            // Validating the data before we create a new Todo >> A best practice is to validate the data on the client side as well
            if (!body.todo || !body.author || !body.deadline || !body.sort) { // Mongoose Schema also offer validation, We can use express-validator as well , but for now we will just check if the required fields are filled
                response.status(400).json({ message: "Please fill in all the required fields (todo, author, deadline, sort)." });
            }
            const createdTodo = await TodoService.createNewTodo(body);
            if (!createdTodo) {
                response.status(404).json({ message: "Couldn't Create New Todo" });
            }
            response.status(200).json(createdTodo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiCreateNewSubTodoByTodoId(request, response, next) {
        try {
            // Validating the data before we create a new subTodo >> A best practice is to validate the data on the client side as well
            const body = request.body;
            if (!body.todo || !body.author || !body.sort || !body.deadline) {
                response.status(400).json({ message: "Please fill in all the required fields (todo, author, deadline, sort)." });
            }
            const createdSubTodo = await TodoService.createNewSubTodoByTodoId(request.params.todoId, body);
            if (!createdSubTodo) {
                response.status(404).json({ message: "Couldn't Create New SubTodo" });
            }
            response.status(200).json(createdSubTodo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiUpdateTodoById(request, response, next) {
        try {
            const body = request.body;
            // Validating the data before we update a Todo >> A best practice is to validate the data on the client side as well
            if (!body.todo && !body.author && !body.sort && !body.status && !body.subTodos && !body.deadline) {
                response.status(400).json({ message: "Please fill in at least one field to update (todo, author, deadline, sort, status, subTodos)." });
            }
            const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
            if (body.status && !statuses.includes(body.status)) {
                response.status(400).json({ message: "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED." });
            }
            const updatedTodo = await TodoService.updateTodoById(request.params.todoId, request.body);
            if (!updatedTodo || updatedTodo.modifiedCount === 0) {
                response.status(404).json({ message: "Couldn't Update Todo By Id" });
            }
            response.status(200).json(updatedTodo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiUpdateSubTodoByIDs(request, response, next) {
        try {
            const body = request.body;
            // Validating the data before we update a subTodo >> A best practice is to validate the data on the client side as well
            if (!body.todo && !body.author && !body.status && !body.sort && !body.deadline) {
                res.status(400).json({ message: "Please fill in at least one field to update (todo, author, deadline, sort, status)." });
            }
            const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
            if (body.status && !statuses.includes(body.status)) {
                response.status(400).json({ message: "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED." });
            }
            const updatedSubTodo = await TodoService.updateSubTodoByIDs(request.params.todoId, request.params.subTodoId, body);
            if (!updatedSubTodo || updatedSubTodo.modifiedCount === 0) {
                response.status(404).json({ message: "Couldn't Update SubTodo By IDs" });
            }
            response.status(200).json(updatedSubTodo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiDeleteTodoById(request, response, next) {
        try {
            const deletedTodo = await TodoService.deleteTodoById(request.params.todoId);
            if (!deletedTodo) {
                response.status(404).json({ message: "Couldn't Delete Todo By Id" });
            }
            response.status(200).json(deletedTodo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }

    static async apiDeleteSubTodoByIDs(request, response, next) {
        try {
            const deletedSubTodo = await TodoService.deleteSubTodoByIDs(request.params.todoId, request.params.subTodoId);
            if (!deletedSubTodo) {
                response.status(404).json({ message: "Couldn't Delete SubTodo By IDs" });
            }
            response.status(200).json(deletedSubTodo);
        } catch (error) {
            response.status(500).json({ error: error });
        }
    }
}

module.exports = todoController;
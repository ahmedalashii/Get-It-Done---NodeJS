const { request } = require("express");
const TodoService = require("../services/TodoService");
const UserService = require("../services/UserService");

const todoController = class TodoController {
    static async apiGetAllTodos(request, response, next) {
        try {
            // We want to get all todos of the logged in user, so we will get the user id from the request object
            const todos = await TodoService.getAllTodos(request.user);
            if (!todos) {
                return response.status(404).json({ message: "Couldn't Get All Todos" });
            }
            return response.status(200).json(todos);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiGetTodoById(request, response, next) {
        try {
            const todo = await TodoService.getTodoById(request.params.todoId); // request.params.todoId is the id that we will get from the url >> /api/todos/:todoId
            if (!todo) {
                return response.status(404).json({ message: "Couldn't Get Todo By Id" });
            }
            return response.status(200).json(todo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiGetSubTodoByIDs(request, response, next) {
        try {
            const subTodo = await TodoService.getSubTodoByIDs(request.params.todoId, request.params.subTodoId);
            if (!subTodo) {
                return response.status(404).json({ message: "Couldn't Get SubTodo By IDs" });
            }
            return response.status(200).json(subTodo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiCreateNewTodo(request, response, next) {
        try {
            const body = request.body; // request.body is the data that the Vue App will send
            // Validating the data before we create a new Todo >> A best practice is to validate the data on the client side as well
            if (!body.todo || !body.deadline || !body.sequence) { // Mongoose Schema also offer validation, We can use express-validator as well , but for now we will just check if the required fields are filled
                return response.status(400).json({ message: "Please fill in all the required fields (todo, deadline, sequence)." });
            }
            const createdTodo = await TodoService.createNewTodo(request.user, body);
            if (!createdTodo) {
                return response.status(404).json({ message: "Couldn't Create New Todo" });
            }
            return response.status(200).json(createdTodo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiCreateNewSubTodoByTodoId(request, response, next) {
        try {
            // Validating the data before we create a new subTodo >> A best practice is to validate the data on the client side as well
            const body = request.body;
            if (!body.todo || !body.sequence || !body.deadline) {
                return response.status(400).json({ message: "Please fill in all the required fields (todo, deadline, sequence)." });
            }
            const createdSubTodo = await TodoService.createNewSubTodoByTodoId(request.params.todoId, body);
            if (!createdSubTodo) {
                return response.status(404).json({ message: "Couldn't Create New SubTodo" });
            }
            return response.status(200).json(createdSubTodo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiUpdateTodoById(request, response, next) {
        try {
            const body = request.body;
            // Validating the data before we update a Todo >> A best practice is to validate the data on the client side as well
            if (!body.todo && !body.sequence && !body.status && !body.subTodos && !body.deadline) {
                return response.status(400).json({ message: "Please fill in at least one field to update (todo, deadline, sequence, status, subTodos)." });
            }
            const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
            if (body.status && !statuses.includes(body.status)) {
                return response.status(400).json({ message: "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED." });
            }
            const updatedTodo = await TodoService.updateTodoById(request.params.todoId, request.body);
            if (!updatedTodo || updatedTodo.modifiedCount === 0) {
                return response.status(404).json({ message: "Couldn't Update Todo By Id" });
            }
            return response.status(200).json(updatedTodo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiUpdateSubTodoByIDs(request, response, next) {
        try {
            const body = request.body;
            // Validating the data before we update a subTodo >> A best practice is to validate the data on the client side as well
            if (!body.todo && !body.status && !body.sequence && !body.deadline) {
                return response.status(400).json({ message: "Please fill in at least one field to update (todo, deadline, sequence, status)." });
            }
            const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
            if (body.status && !statuses.includes(body.status)) {
                return response.status(400).json({ message: "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED." });
            }
            const updatedSubTodo = await TodoService.updateSubTodoByIDs(request.params.todoId, request.params.subTodoId, body);
            if (!updatedSubTodo || updatedSubTodo.modifiedCount === 0) {
                return response.status(404).json({ message: "Couldn't Update SubTodo By IDs" });
            }
            return response.status(200).json(updatedSubTodo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiDeleteTodoById(request, response, next) {
        try {
            const deletedTodo = await TodoService.deleteTodoById(request.params.todoId);
            if (!deletedTodo) {
                return response.status(404).json({ message: "Couldn't Delete Todo By Id" });
            }
            return response.status(200).json(deletedTodo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiDeleteSubTodoByIDs(request, response, next) {
        try {
            const deletedSubTodo = await TodoService.deleteSubTodoByIDs(request.params.todoId, request.params.subTodoId);
            if (!deletedSubTodo) {
                return response.status(404).json({ message: "Couldn't Delete SubTodo By IDs" });
            }
            return response.status(200).json(deletedSubTodo);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }

    static async apiGetStatistics(request, response, next) {
        try {
            const statistics = await TodoService.apiGetStatistics(request);
            if (!statistics) {
                return response.status(404).json({ message: "Couldn't Get Statistics!" });
            }
            return response.status(200).json(statistics);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    }
}

module.exports = todoController;
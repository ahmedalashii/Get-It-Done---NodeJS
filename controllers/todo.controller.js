const { request } = require("express");
const TodoService = require("../services/TodoService");
const UserService = require("../services/UserService");
const createHttpError = require("http-errors");
const { deleteSubTodoByIDs } = require("../services/TodoService");
const todoController = class TodoController {
    static async apiGetAllTodos(request, response, next) {
        try {
            // We want to get all todos of the logged in user, so we will get the user id from the request object
            const sortQueriesMap = {};
            const sortWays = ["asc", "desc", "ascending", "descending", 1, -1];
            const queryParam = request.query; // request.query is the data that we will get from the url >> /api/todos?status=COMPLETED
            const created_at = queryParam.created_at;
            const completed_at = queryParam.completed_at;
            const sequence = queryParam.sequence;
            // Pagination Logic >> We will use the query params perPage and page to implement pagination
            const perPage = parseInt(queryParam.per_page);
            const page = parseInt(queryParam.page);
            /*
                Page   PerPage(Limit)    Offset (Skip)
                1       10                  0
                2       10                  10
                3       10                  20
                4       10                  30
                5       10                  40
                6       10                  50
                7       10                  60
                8       10                  70
                ..      ..                   ..
            */
            if (isNaN(perPage) || isNaN(page)) {
                const error = createHttpError(400, "Please enter a valid value for perPage and page.");
                return next(error);
            }
            if (page <= 0) {
                const error = createHttpError(400, "Please enter a positive value starting from 1 for page.");
                return next(error);
            }
            if (created_at) {
                if (!sortWays.includes(created_at)) {
                    const error = createHttpError(400, "Please enter a valid value for created_at (asc, desc, ascending, descending, 1, -1).");
                    return next(error);
                } else {
                    sortQueriesMap.created_at = created_at;
                }
            }
            if (completed_at) {
                if (!sortWays.includes(completed_at)) {
                    const error = createHttpError(400, "Please enter a valid value for completed_at (asc, desc, ascending, descending, 1, -1).");
                    return next(error);
                } else {
                    sortQueriesMap.completed_at = completed_at;
                }
            }
            if (sequence) {
                if (!sortWays.includes(sequence)) {
                    const error = createHttpError(400, "Please enter a valid value for sequence (asc, desc, ascending, descending, 1, -1).");
                    return next(error);
                } else {
                    sortQueriesMap.sequence = sequence;
                }
            }
            const todos = await TodoService.getAllTodos(request.user, sortQueriesMap, perPage, page);
            if (!todos) {
                const error = createHttpError(404, "Couldn't Get All Todos");
                return next(error);
            }
            return response.status(200).json(todos);
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiGetTodoById(request, response, next) {
        try {
            const todo = await TodoService.getTodoById(request.params.todoId); // request.params.todoId is the id that we will get from the url >> /api/todos/:todoId
            if (todo.error) {
                const error = createHttpError(400, todo.message);
                return next(error);
            }
            if (!todo) {
                const error = createHttpError(404, "Couldn't Get Todo By Id");
                return next(error);
            }
            return response.status(200).json({ status: true, data: todo });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiGetSubTodoByIDs(request, response, next) {
        try {
            const subTodo = await TodoService.getSubTodoByIDs(request.params.todoId, request.params.subTodoId);
            if (subTodo.error) {
                const error = createHttpError(400, subTodo.message);
                return next(error);
            }
            if (!subTodo) {
                const error = createHttpError(404, "Couldn't Get SubTodo By IDs");
                return next(error);
            }
            return response.status(200).json({ status: true, data: subTodo });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiCreateNewTodo(request, response, next) {
        try {
            const body = request.body; // request.body is the data that the Vue App will send
            // Validating the data before we create a new Todo >> A best practice is to validate the data on the client side as well
            if (!body.todo || !body.deadline || !body.sequence) { // Mongoose Schema also offer validation, We can use express-validator as well , but for now we will just check if the required fields are filled
                const error = createHttpError(400, "Please fill in all the required fields (todo, deadline, sequence).");
                return next(error);
            }
            const createdTodo = await TodoService.createNewTodo(request.user, body);
            if (!createdTodo) {
                const error = createHttpError(404, "Couldn't Create New Todo");
                return next(error);
            }
            return response.status(200).json({ status: true, message: "Todo Created Successfully", data: createdTodo });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiCreateNewSubTodoByTodoId(request, response, next) {
        try {
            // Validating the data before we create a new subTodo >> A best practice is to validate the data on the client side as well
            const body = request.body;
            if (!body.todo || !body.sequence || !body.deadline) {
                const error = createHttpError(400, "Please fill in all the required fields (todo, deadline, sequence).");
                return next(error);
            }
            const updatedTodo = await TodoService.createNewSubTodoByTodoId(request.params.todoId, body);
            if (!updatedTodo) {
                const error = createHttpError(404, "Couldn't Create New SubTodo By Todo Id");
                return next(error);
            }
            if (updatedTodo.error) {
                const error = createHttpError(400, updatedTodo.message);
                return next(error);
            }
            return response.status(200).json({ status: true, message: "SubTodo Created Successfully", data: updatedTodo });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiUpdateTodoById(request, response, next) {
        try {
            const body = request.body;
            // Validating the data before we update a Todo >> A best practice is to validate the data on the client side as well
            if (!body.todo && !body.sequence && !body.status && !body.subTodos && !body.deadline) {
                const error = createHttpError(400, "Please fill in at least one field to update (todo, deadline, sequence, status, subTodos).");
                return next(error);
            }
            const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
            if (body.status && !statuses.includes(body.status)) {
                const error = createHttpError(400, "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED.");
                return next(error);
            }

            const updatedTodo = await TodoService.updateTodoById(request.params.todoId, request.body);
            if (!updatedTodo) {
                const error = createHttpError(404, "Couldn't Update Todo By Id");
                return next(error);
            }
            if (updatedTodo.error) {
                const error = createHttpError(400, updatedTodo.message);
                return next(error);
            }
            return response.status(200).json({ status: true, message: "Todo Updated Successfully", data: updatedTodo });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiUpdateSubTodoByIDs(request, response, next) {
        try {
            const body = request.body;
            // Validating the data before we update a subTodo >> A best practice is to validate the data on the client side as well
            if (!body.todo && !body.status && !body.sequence && !body.deadline) {
                const error = createHttpError(400, "Please fill in at least one field to update (todo, deadline, sequence, status).");
                return next(error);
            }
            const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
            if (body.status && !statuses.includes(body.status)) {
                const error = createHttpError(400, "Status can only be one of the following: NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELED.");
                return next(error);
            }
            const data = await TodoService.updateSubTodoByIDs(request.params.todoId, request.params.subTodoId, body);
            if (!data) {
                const error = createHttpError(404, "Couldn't Update SubTodo By IDs");
                return next(error);
            }
            if (data.error) {
                const error = createHttpError(400, data.message);
                return next(error);
            }
            return response.status(200).json({ status: true, message: "SubTodo Updated Successfully", data: data });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiDeleteTodoById(request, response, next) {
        try {
            const deletedTodo = await TodoService.deleteTodoById(request.params.todoId);
            if (!deletedTodo) {
                const error = createHttpError(404, "Couldn't Delete Todo By Id");
                return next(error);
            }
            if (deletedTodo.error) {
                const error = createHttpError(400, deletedTodo.message);
                return next(error);
            }
            return response.status(200).json({ status: true, message: "Todo Deleted Successfully", data: deletedTodo });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiDeleteUserTodos(request, response, next) {
        try {
            const result = await TodoService.deleteUserTodos(request.user);
            if (!result || result.deletedCount == 0) {
                const error = createHttpError(404, "Couldn't Delete All Todos");
                return next(error);
            }
            return response.status(200).json({ status: true, message: "All Todos Deleted Successfully", data: result });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiDeleteSubTodoByIDs(request, response, next) {
        try {
            const deletedSubTodo = await TodoService.deleteSubTodoByIDs(request.params.todoId, request.params.subTodoId);
            if (!deletedSubTodo) {
                const error = createHttpError(404, "Couldn't Delete SubTodo By IDs");
                return next(error);
            }
            if (deletedSubTodo.error) {
                const error = createHttpError(400, deletedSubTodo.message);
                return next(error);
            }
            return response.status(200).json({ status: true, message: "SubTodo Deleted Successfully", data: deletedSubTodo });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    static async apiGetStatistics(request, response, next) {
        try {
            const statistics = await TodoService.apiGetStatistics(request);
            if (!statistics) {
                const error = createHttpError(404, "Couldn't Get Statistics!");
                return next(error);
            }
            if (statistics.error) {
                const error = createHttpError(400, statistics.message);
                return next(error);
            }
            return response.status(200).json({ status: true, data: statistics });
        } catch (err) {
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }
}

module.exports = todoController;
const Todo = require('../models/Todo');

const todoService = class TodoService {

    static async getAllTodos() {
        try {
            const allTodos = await Todo.find(); // find() method returns all the documents in a collection.
            return allTodos;
        } catch (err) {
            console.log("Couldn't Get All Todos: ", err);
        }
    }

    static async getTodoById(todoId) {
        try {
            const specificTodo = await Todo.findById({ _id: todoId }); // findById() method returns a single document by its _id field.
            return specificTodo;
        } catch (err) {
            console.log("Couldn't Get Todo By Id: ", err);
        }
    }

    static async getSubTodoByIDs(todoId, subTodoId) {
        try {
            const specificSubTodo = await Todo.findOne(
                { _id: todoId },
                { subTodos: { $elemMatch: { _id: subTodoId } } },
            ); // findOne() method returns a single document that satisfies the specified query criteria.
            return specificSubTodo;
        } catch (err) {
            console.log("Couldn't Get SubTodo By Id: ", err);
        }
    }

    static async createNewTodo(data) {
        const newTodo = new Todo(
            {
                todo: data.todo,
                author: data.author,
                created_at: new Date(),
                updated_at: new Date(),
                deadline: data.deadline,
                sort: data.sort,
                status: data.status ?? "NOT_STARTED", // when we create a todo it will be "NOT_STARTED" by default >> ?? is a Nullish coalescing operator
                subTodos: data.subTodos ?? [],
            },
        );
        if (newTodo.status === "COMPLETED") { // if the todo is added as completed then we will add the completed_at date >> this is only if there's a possibility to choose the status when adding a todo
            newTodo.completed_at = new Date();
        }
        try {
            const createdTodo = await newTodo.save();
            return createdTodo;
        } catch (err) {
            console.log("Couldn't Create New Todo: ", err);
        }
    }

    static async createNewSubTodoByTodoId(todoId, data) {
        const newSubTodo = {
            todo: data.todo,
            author: data.author,
            created_at: new Date(),
            updated_at: new Date(),
            deadline: data.deadline,
            sort: data.sort,
            status: data.status ?? "NOT_STARTED", // when we create a subTodo it will be "NOT_STARTED" by default
        };
        if (newSubTodo.status === "COMPLETED") { // if the subTodo is added as completed then we will add the completed_at date >> this is only if there's a possibility to choose the status when adding a subTodo
            newSubTodo.completed_at = new Date();
        }
        try {
            const createdSubTodo = await Todo.updateOne(
                { _id: todoId },
                { $push: { subTodos: newSubTodo } }, // $push operator appends a specified value to an array.
            ); // updateOne() method updates a single document within the collection based on the filter.
            return createdSubTodo;
        } catch (err) {
            console.log("Couldn't Create New SubTodo: ", err);
        }
    }

    static async updateTodoById(todoId, data) {
        try {
            const oldTodo = await Todo.findById({ _id: todoId });
            const todo = {
                todo: data.todo ?? oldTodo.todo,
                author: data.author ?? oldTodo.author,
                updated_at: new Date(),
                deadline: data.deadline ?? oldTodo.deadline,
                sort: data.sort ?? oldTodo.sort,
                status: data.status ?? oldTodo.status,
                subTodos: data.subTodos ?? oldTodo.subTodos,
            };
            if (todo.status === "COMPLETED") {
                todo.completed_at = new Date();
            }
            const updatedTodo = await Todo.updateOne(
                { _id: todoId },
                { $set: todo },
            );
            return updatedTodo;
        } catch (err) {
            console.log("Couldn't Update Todo By Id: ", err);
        }
    }

    static async updateSubTodoByIDs(todoId, subTodoId, data) {
        try {
            const parentTodo = await Todo.findById({ _id: todoId });
            //? Can we update a subTodo for a canceled todo? >> No, we can't update
            if (parentTodo.status === "CANCELED") {
                const error = { message: "You can't update a subTodo for a canceled todo." };
                return error;
            }
            const oldSubTodo = await Todo.findOne(
                { _id: todoId, "subTodos._id": subTodoId },
            );
            const subTodo = {
                todo: data.todo ?? oldSubTodo.subTodos[0].todo,
                author: data.author ?? oldSubTodo.subTodos[0].author,
                status: data.status ?? oldSubTodo.subTodos[0].status,
                updated_at: new Date(),
                deadline: data.deadline ?? oldSubTodo.subTodos[0].deadline,
                sort: data.sort ?? oldSubTodo.subTodos[0].sort,
            };
            if (subTodo.status === "IN_PROGRESS" || subTodo.status === "COMPLETED") {
                if (subTodo.status === "COMPLETED") {
                    subTodo.completed_at = new Date();
                }
                await Todo.updateOne(
                    { _id: todoId },
                    { $set: { status: "IN_PROGRESS" } }, // For the subtodo, being in progress or completed means that the todo is in progress >> completed subtodo doesn't mean that the todo is completed >> it may have other subtodos that are not completed yet
                );
            }
            const updatedSubTodo = await Todo.updateOne(
                { _id: todoId, "subTodos._id": subTodoId },
                { $set: { "subTodos.$": subTodo } },
            );
            return updatedSubTodo
        } catch (err) {
            return console.log("Couldn't Update SubTodo By Ids: ", err);
        }
    }

    static async deleteTodoById(todoId) {
        try {
            const deletedTodo = await Todo.findByIdAndDelete({ _id: todoId }); // findByIdAndDelete() method deletes a single document based on its _id field.
            return deletedTodo;
        } catch (err) {
            console.log("Couldn't Delete Todo By Id: ", err);
        }
    }

    static async deleteSubTodoByIDs(todoId, subTodoId) {
        try {
            const deletedSubTodo = await Todo.updateOne(
                { _id: todoId },
                { $pull: { subTodos: { _id: subTodoId } } },
            );
            return deletedSubTodo;
        } catch (err) {
            console.log("Couldn't Delete SubTodo By Ids: ", err);
        }
    }
}

module.exports = todoService;
const Todo = require('../models/Todo');
const User = require('../models/User');
const { ObjectId } = require('bson');
const todoService = class TodoService {

    static async getAllTodos(user, sortQueriesMap, perPage, page) {
        // if sortQueriesMap is empty then we will get all todos by the default sort (by created_at asc)
        if (sortQueriesMap.size === 0) { // or if (Object.keys(sortQueriesMap).length === 0)
            sortQueriesMap.created_at = "asc";
        }
        const allTodos = await Todo.find({ author: user.user_id }).sort(sortQueriesMap).limit(perPage).skip(perPage * (page - 1)); // find() method returns an array of documents that match the filter criteria.
        const totalTodos = await Todo.countDocuments({ author: user.user_id });
        const pages = await this.getTodosPageCount(user, perPage);
        return {
            currentPage: page,
            perPage: perPage,
            totalTodos: totalTodos,
            todos: allTodos,
            pages: pages,
            isLastPage: totalTodos == 0 ? true : page == pages,
        };

    }


    // private function called getTodosPageCount
    static async getTodosPageCount(user, perPage) {
        const todosCount = await Todo.countDocuments({ author: user.user_id }); // countDocuments() method returns the count of all documents that match the filter criteria.
        const pageCount = Math.ceil(todosCount / perPage);
        return pageCount;
    }

    static async getTodoById(todoId) {
        if (!ObjectId.isValid(todoId)) {
            const error = { error: true, message: "Invalid Todo ID" };
            return error;
        }
        const _id = new ObjectId(todoId);
        const specificTodo = await Todo.findById({ _id: _id }); // findById() method returns a single document by its _id field.
        return specificTodo;

    }

    static async getSubTodoByIDs(todoId, subTodoId) {
        // We don't need to pass the user here because if we have the subTodoId then we have the user :) (middleware)
        if (!ObjectId.isValid(todoId)) {
            const error = { error: true, message: "Invalid Todo ID" };
            return error;
        }
        if (!ObjectId.isValid(subTodoId)) {
            const error = { error: true, message: "Invalid SubTodo ID" };
            return error;
        }
        const _id = new ObjectId(todoId);
        const _subId = new ObjectId(subTodoId);
        const specificSubTodo = await Todo.findOne(
            { _id: _id },
            { subTodos: { $elemMatch: { _id: _subId } } },
        ); // findOne() method returns a single document that satisfies the specified query criteria.
        return specificSubTodo.subTodos[0];
    }

    static async createNewTodo(user, data) {
        const newTodo = new Todo(
            {
                todo: data.todo,
                author: user.user_id,
                created_at: new Date(),
                updated_at: new Date(),
                deadline: data.deadline,
                sequence: data.sequence,
                status: data.status ?? "NOT_STARTED", // when we create a todo it will be "NOT_STARTED" by default >> ?? is a Nullish coalescing operator
                subTodos: data.subTodos ?? [],
            },
        );
        if (newTodo.status === "COMPLETED") { // if the todo is added as completed then we will add the completed_at date >> this is only if there's a possibility to choose the status when adding a todo
            newTodo.completed_at = new Date();
        }
        const createdTodo = await newTodo.save();
        return createdTodo;
    }

    static async createNewSubTodoByTodoId(todoId, data) {
        if (!ObjectId.isValid(todoId)) {
            const error = { error: true, message: "Invalid Todo ID" };
            return error;
        }
        const _id = new ObjectId(todoId);
        // We don't need to pass the user here because if we have the todoId then we have the user :) (middleware)
        const newSubTodo = {
            todo: data.todo,
            created_at: new Date(),
            updated_at: new Date(),
            deadline: data.deadline,
            sequence: data.sequence,
            status: data.status ?? "NOT_STARTED", // when we create a subTodo it will be "NOT_STARTED" by default
        };
        if (newSubTodo.status === "COMPLETED") { // if the subTodo is added as completed then we will add the completed_at date >> this is only if there's a possibility to choose the status when adding a subTodo
            newSubTodo.completed_at = new Date();
        }
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: _id },
            { $push: { subTodos: newSubTodo } }, // $push operator appends a specified value to an array.
            { new: true },
        ); // updateOne() method updates a single document within the collection based on the filter.
        return updatedTodo;

    }

    static async updateTodoById(todoId, data) {
        // We don't need to pass the user here because if we have the todoId then we have the user :) (middleware)
        if (!ObjectId.isValid(todoId)) {
            const error = { error: true, message: "Invalid Todo ID" };
            return error;
        }
        const _id = new ObjectId(todoId);
        const oldTodo = await Todo.findById({ _id: _id });
        if (!oldTodo) {
            const error = { error: true, message: "Todo not found" };
            return error;
        }
        const todo = {
            todo: data.todo ?? oldTodo.todo,
            author: oldTodo.author,
            updated_at: new Date(),
            deadline: data.deadline ?? oldTodo.deadline,
            sequence: data.sequence ?? oldTodo.sequence,
            status: data.status ?? oldTodo.status,
            subTodos: data.subTodos ?? oldTodo.subTodos,
        };
        if (todo.status === "COMPLETED") {
            todo.completed_at = new Date();
        }
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId },
            { $set: todo },
            { new: true },
        );
        return updatedTodo;

    }

    static async updateSubTodoByIDs(todoId, subTodoId, data) {
        // We don't need to pass the user here because if we have the IDs then we have the user :) (middleware)
        if (!ObjectId.isValid(todoId)) {
            const error = { error: true, message: "Invalid Todo ID" };
            return error;
        }
        if (!ObjectId.isValid(subTodoId)) {
            const error = { error: true, message: "Invalid SubTodo ID" };
            return error;
        }
        const _id = new ObjectId(todoId);
        const _subId = new ObjectId(subTodoId);
        const parentTodo = await Todo.findById({ _id: _id });

        if (!parentTodo) {
            const error = { error: true, message: "Parent Todo not found" };
            return error;
        }
        //? Can we update a subTodo for a canceled todo? >> No, we can't update
        if (parentTodo.status === "CANCELED") {
            const error = { error: true, message: "You can't update a subTodo for a canceled todo." };
            return error;
        }
        const oldSubTodo = await Todo.findOne(
            { _id: _id, "subTodos._id": _subId },
        );
        if (!oldSubTodo) {
            const error = { error: true, message: "SubTodo not found" };
            return error;
        }
        const subTodo = {
            todo: data.todo ?? oldSubTodo.subTodos[0].todo,
            author: oldSubTodo.subTodos[0].author,
            status: data.status ?? oldSubTodo.subTodos[0].status,
            created_at: oldSubTodo.subTodos[0].created_at,
            updated_at: new Date(),
            deadline: data.deadline ?? oldSubTodo.subTodos[0].deadline,
            sequence: data.sequence ?? oldSubTodo.subTodos[0].sequence,
        };
        var updatedTodoId;
        if (subTodo.status === "IN_PROGRESS" || subTodo.status === "COMPLETED") {
            if (subTodo.status === "COMPLETED") {
                subTodo.completed_at = new Date();
            }
            await Todo.findOneAndUpdate(
                { _id: _id },
                { $set: { status: "IN_PROGRESS" } }, // For the subtodo, being in progress or completed means that the todo is in progress >> completed subtodo doesn't mean that the todo is completed >> it may have other subtodos that are not completed yet
                { new: true },
            ).then((updatedTodo) => {
                updatedTodoId = updatedTodo._id;
            });
        }
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: updatedTodoId ? updatedTodoId : _id, "subTodos._id": _subId },
            { $set: { "subTodos.$": subTodo } },
            { new: true },
        );
        //! Find the updated subTodo based on its properties because the _id will be different
        const updatedSubTodo = updatedTodo.subTodos.find(
            (sub_todo) => {
                return sub_todo.todo === subTodo.todo && sub_todo.created_at.getTime() === subTodo.created_at.getTime() && sub_todo.updated_at.getTime() === subTodo.updated_at.getTime();
            },
        );
        return updatedSubTodo;
    }

    static async deleteTodoById(todoId) {
        if (!ObjectId.isValid(todoId)) {
            const error = { error: true, message: "Invalid Todo ID" };
            return error;
        }
        const _id = new ObjectId(todoId);
        const deletedTodo = await Todo.findByIdAndDelete({ _id: _id }); // findByIdAndDelete() method deletes a single document based on its _id field.
        return deletedTodo;
    }

    static async deleteUserTodos(user) {
        const result = await Todo.deleteMany({ author: user.user_id });
        return result;
    }

    static async deleteSubTodoByIDs(todoId, subTodoId) {
        if (!ObjectId.isValid(todoId)) {
            const error = { error: true, message: "Invalid Todo ID" };
            return error;
        }
        if (!ObjectId.isValid(subTodoId)) {
            const error = { error: true, message: "Invalid SubTodo ID" };
            return error;
        }
        const _id = new ObjectId(todoId);
        const todo = await Todo.findById({ _id: _id });
        if (!todo) {
            const error = { error: true, message: "Todo not found" };
            return error;
        }
        const _subId = new ObjectId(subTodoId);
        var result = await Todo.findOne(
            { _id: _id, "subTodos._id": _subId },
        );
        if (!result) {
            const error = { error: true, message: "SubTodo not found" };
            return error;
        } else {
            result = result.subTodos.find((subTodo) => subTodo._id == subTodoId);
        }
        await Todo.updateOne(
            { _id: _id },
            { $pull: { subTodos: { _id: _subId } } },
        );
        return result;

    }

    static async apiGetStatistics(request) {
        const user = await User.findById({ _id: request.user.user_id });
        if (!user) {
            const error = { error: true, message: "User not found" };
            return error;
        }
        //* We want to get the percentage of the completed todos for the current user to the total number of todos for the current user
        const totalTodos = await Todo.countDocuments({ author: user._id });
        const completedTodos = await Todo.countDocuments({ author: user._id, status: "COMPLETED" });
        const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
        /*
            * The system will return a statistics response that shows the average completion rate per day.
            * For example, if the user has completed 30 todos and has been using the system for 10 days, 
            * the average completion rate per day would be: 30 / 10 = 3
            * This means that on average, the user completes 3 todos per day.
        */
        const daysSinceSignUp = Math.round((new Date() - user.created_at) / (1000 * 60 * 60 * 24)); // Math.ceil() method rounds a number up to the next largest integer.
        const averageCompletionRate = daysSinceSignUp > 0 ? Math.round(completedTodos / daysSinceSignUp * 10) / 10 : 0;
        // console.log("User: ", user);
        // console.log("Total Todos: ", totalTodos);
        // console.log("Completed Todos: ", completedTodos);
        // console.log("Completion Rate: ", completionRate);
        // console.log("Signup Date: ", user.created_at);
        // console.log("Days Since Sign Up: ", daysSinceSignUp);
        // console.log("Average Completion Rate: ", averageCompletionRate);
        const statistics = {
            totalTodos: totalTodos,
            completedTodos: completedTodos,
            completionRate: completionRate.toFixed(2), // toFixed() method formats a number using fixed-point notation.
            signupDate: user.created_at,
            daysSinceSignUp: daysSinceSignUp,
            averageCompletionRate: averageCompletionRate,
            lastCompletedTodo: await Todo.findOne({ author: user._id, status: "COMPLETED" }).sort({ completed_at: "descending" }),
        };
        return statistics;
    }
}

module.exports = todoService;
const Todo = require('../models/Todo');
const User = require('../models/User');
const todoService = class TodoService {

    static async getAllTodos(user, sortQueriesMap) {
        try {
            // if sortQueriesMap is empty then we will get all todos by the default sort (by created_at asc)
            if (sortQueriesMap.size === 0) { // or if (Object.keys(sortQueriesMap).length === 0)
                sortQueriesMap.created_at = "asc";
            }
            const allTodos = await Todo.find({ author: user.user_id }).sort(sortQueriesMap);
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
        // We don't need to pass the user here because if we have the subTodoId then we have the user :) (middleware)
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
        try {
            const createdTodo = await newTodo.save();
            return createdTodo;
        } catch (err) {
            console.log("Couldn't Create New Todo: ", err);
        }
    }

    static async createNewSubTodoByTodoId(todoId, data) {
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
        // We don't need to pass the user here because if we have the todoId then we have the user :) (middleware)
        try {
            const oldTodo = await Todo.findById({ _id: todoId });
            if (!oldTodo) {
                const error = { message: "Todo not found" };
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
        // We don't need to pass the user here because if we have the IDs then we have the user :) (middleware)
        try {
            const parentTodo = await Todo.findById({ _id: todoId });
            console.log(parentTodo);
            if (!parentTodo) {
                const error = { message: "Todo not found" };
                return error;
            }
            //? Can we update a subTodo for a canceled todo? >> No, we can't update
            if (parentTodo.status === "CANCELED") {
                const error = { message: "You can't update a subTodo for a canceled todo." };
                return error;
            }
            const oldSubTodo = await Todo.findOne(
                { _id: todoId, "subTodos._id": subTodoId },
            );
            if (!oldSubTodo) {
                const error = { message: "SubTodo not found" };
                return error;
            }
            const subTodo = {
                todo: data.todo ?? oldSubTodo.subTodos[0].todo,
                author: oldSubTodo.subTodos[0].author,
                status: data.status ?? oldSubTodo.subTodos[0].status,
                updated_at: new Date(),
                deadline: data.deadline ?? oldSubTodo.subTodos[0].deadline,
                sequence: data.sequence ?? oldSubTodo.subTodos[0].sequence,
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

    static async apiGetStatistics(request) {
        try {
            const user = await User.findById({ _id: request.user.user_id });
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
        } catch (err) {
            console.log("Couldn't Get Statistics: ", err);
        }
    }
}

module.exports = todoService;
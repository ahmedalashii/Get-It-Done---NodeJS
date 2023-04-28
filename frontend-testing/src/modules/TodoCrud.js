import { ref } from "vue";
const links = require("../data/links");
const getTodos = () => {
    const state = ref({
        newAuthor: "",
        newTodo: "",
        todos: {},
    });

    const GetAllTodos = async () => {
        try {
            const res = await fetch(links.getAllTodos);
            const data = await res.json();
            state.value.todos = data;
        } catch (error) {
            console.log(error);
        }
    };

    const newTodo = () => {
        try {
            const requestOptions = {
                method: "POST",
            };
            fetch(links.newTodo, requestOptions).then(() => {
                GetAllTodos();
            });
        } catch (error) {
            console.log(error);
        }
    };


    const deleteTodo = (todoId) => {
        try {
            const requestOptions = {
                method: "DELETE",
            };
            fetch(links.deleteTodo + todoId, requestOptions).then(() => {
                GetAllTodos();
                // state.value.todos = state.value.todos.filter((todo) => todo._id !== todoId);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const editTodo = (todoId) => {
        try {
            const requestOptions = {
                method: "PUT",
            };
            fetch(links.updateTodo + todoId, requestOptions)
                .then(() => {
                    GetAllTodos();
                });
        } catch (error) {
            console.log(error);
        }
    };

    return { state, GetAllTodos, newTodo, deleteTodo, editTodo };
};

export default getTodos;
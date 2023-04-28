<template>
    <div>
        <h1>All Todos</h1>
        <button @click="newTodo()">New Todo - Static</button>
        <br>
        <input type="text" placeholder="Author" v-model="state.newAuthor">
        <input type="text" placeholder="Todo" v-model="state.newTodo">
        <br>
        <div v-for="todo in state.todos" :key="todo.author">
            <h4>{{ todo.author }}</h4>
            <p>{{ todo.todo }}</p>
            <p>{{ todo.creationDate }}</p>
            <p>{{ todo.sort }}</p>
            <p>{{ todo.status }}</p>
            <p>{{ todo.subTodos }}</p>
            <button @click="deleteTodo(todo._id)">Delete Todo</button>
            <button @click="editTodo(todo._id)">Edit Todo</button>
        </div>
    </div>
</template>

<script>
import todocrud from "../modules/TodoCrud";
import { onMounted } from "vue";
export default {
    setup() {
        /*
            Here's the Schema:
            {
                todo: String,
                author: String,
                creationDate: Date,
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
                    creationDate: Date,
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
        const { state, GetAllTodos, newTodo, deleteTodo, editTodo } = todocrud();
        onMounted(() => { // onMounted is a lifecycle hook that runs after the component is mounted >> mounted = the component is added to the DOM
            GetAllTodos();
        });
        return { state, GetAllTodos, newTodo, deleteTodo, editTodo };
    }
}
</script>

<style lang="scss" scoped></style>
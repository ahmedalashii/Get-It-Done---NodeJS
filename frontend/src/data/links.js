const baseLink = "http://localhost:3000/";
const getAllTodos = baseLink + "todos";
const getTodo = baseLink + "todos/"; // + todoId
const getSubTodo = baseLink + "todos/get-sub-todo/"; // + todoId + subTodoId
const newTodo = baseLink + "todos/new";
const newSubTodo = baseLink + "new-sub-todo/"; // + todoId
const deleteTodo = baseLink + "todos/delete/"; // + todoId
const updateTodo = baseLink + "todos/update/"; // + todoId 
const updateSubTodo = baseLink + "todos/update-sub-todo/"; // + todoId + subTodoId
const deleteSubTodo = baseLink + "todos/delete-sub-todo/"; // + todoId + subTodoId

module.exports = {
    getAllTodos,
    getTodo,
    getSubTodo,
    newTodo,
    newSubTodo,
    deleteTodo,
    updateTodo,
    updateSubTodo,
    deleteSubTodo,
};
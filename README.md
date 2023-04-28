# Node.js and Express Todo List

This is a simple todo list application built using Node.js and Express framework. It allows users to add, edit, and delete tasks.

## Prerequisites

Before running this application, make sure you have the following installed on your machine:

- Node.js
- NPM (Node Package Manager)

## Installation

1. Clone this repository
2. Navigate to the project directory in your terminal
3. Run `npm install` to install the dependencies
4. Run `npm start` to start the server
5. Open your web browser and navigate to `http://localhost:3000`

## Usage

This application can be tested using an API development tool like Postman. You can use the following endpoints to interact with the API:

1- GET /todos
 To get a list of all todos.
2- GET /todos/:todoId
 To get a single todo, where :todoId is the ID of the todo you want to retrieve.
3- GET /todos/get-sub-todo/:todoId/:subTodoId
 To get a single sub-todo, where :todoId is the ID of the parent todo and :subTodoId is the ID of the sub-todo you want to retrieve.
4- POST /todos/new
 To create a new todo, with the todo details in the request body.
5- POST /todos/new-sub-todo/:todoId
 To create a new sub-todo for a specific todo, with the sub-todo details in the request body and :todoId as the ID of the parent todo.
6- PUT /todos/update/:todoId
 To update a todo, with the updated todo details in the request body and :todoId as the ID of the todo.
7- PUT /todos/update-sub-todo/:todoId/:subTodoId
 To update a sub-todo, with the updated sub-todo details in the request body, :todoId as the ID of the parent todo, and :subTodoId as the ID of the sub-todo.
8- DELETE /todos/delete/:todoId
 To delete a todo, where :todoId is the ID of the todo you want to delete.
9- DELETE /todos/delete-sub-todo/:todoId/:subTodoId
 To delete a sub-todo, where :todoId is the ID of the parent todo and :subTodoId is the ID of the sub-todo you want to delete.



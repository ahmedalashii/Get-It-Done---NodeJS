# Node.js and Express Todo List GetItDone App

This is a simple todo list application built using Node.js and Express framework. It allows users to add, edit, and delete todos and subtodos.

## Prerequisites

Before running this application, make sure you have the following installed on your machine:

- Node.js
- NPM (Node Package Manager)
- MongoDB >> https://docs.mongodb.com/manual/installation/
- Postman >> https://www.postman.com/downloads/
- Express.js >> https://expressjs.com/en/starter/installing.html

## Installation

1. Clone this repository
2. Navigate to the project directory in your terminal
3. Create a `.env` file in the root directory with the following variables:
    ```
     MONGODB_URI=<your-mongodb-uri>
     API_PORT=<port-number>
     # Token key for JWT authentication >> It's just a random string for now
     JWT_TOKEN_KEY= A random String!
    ```
4. Run `npm install` to install the dependencies
5. Run `npm start` to start the server
6. Open your postman and navigate to `http://localhost:3000/todos/$whatever` to test the endpoints >> see the usage section below for the endpoints

## Architecture
 - The application is built using Node.js and Express framework.
 - The application uses MongoDB as the database.
 - The application uses Mongoose as the ODM (Object Data Modeling) library.
 - The application uses the MVC (Model-View-Controller) architecture, Where the model is the data, the view is the user interface (or API), and the controller is the brains of the application, which handles the logic and incoming requests.
 - The application uses Restful API architecture, where the API is designed to have logical endpoints that are easy to understand and remember.


As discussed above, we'll be using Express.js for our API. I don't want to come up with a complex architecture so I'd like to stick to the 3 Layer Architecture:

![alt text](https://www.freecodecamp.org/news/content/images/2022/04/Bildschirmfoto-2022-04-25-um-14.33.24-1.png)


## What is the MVC architecture?
Model View Controller is a software architectural pattern that involves the separation of the application logic into three interconnected elements the Model, View, and Controller.

![alt text](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api/_static/architecture.png?view=aspnetcore-7.0)

## Project Structure/Archictecture

├───── `index.js` <br />
├───── `controllers` <br />
    ├── user.controller.js <br />
    ├── todo.controller.js <br />
├───── `models` <br />
    ├── User.js <br />
    ├── Todo.js <br />
├───── `routes` <br />
    ├── user.routes.js <br />
    ├── todo.routes.js <br />
├───── `services` <br />
    ├── UserService.js <br />
    ├── TodoService.js <br />

## Description
- `index.js` is the entry point of the application.
- `controllers` folder contains the controllers that handle the logic for each route.
- `models` folder contains the database models.
- `routes` folder contains the route definitions for the API.
- `services` folder contains the business logic and communicates with the database.

## What is RESTful API?
REST is an acronym for Representation State Transfer, API on the other hand is an acronym for Application Programming Interface. A RESTful API is an architectural style for an application program interface (API) that uses HTTP requests to access and use data.


## Versioning
Before we write any API-specific code we should be aware of versioning. Like in other applications there will be improvements, new features, and stuff like that. So it's important to version our API as well.

The big advantage is that we can work on new features or improvements on a new version while the clients are still using the current version and are not affected by breaking changes.

We also don't force the clients to use the new version straight away. They can use the current version and migrate on their own when the new version is stable.

The current and new versions are basically running in parallel and don't affect each other.

But how can we differentiate between the versions? One good practice is to add a path segment like v1 or v2 into the URL.

```
    // Version 1 
    "/api/v1/users" 

    // Version 2 
    "/api/v2/users" 

    // ...
```

That's what we expose to the outside world and what can be consumed by other developers. But we also need to structure our project in order to differentiate between each version.

There are many different approaches to handling versioning inside an Express API. In our case I'd like to create a sub folder for each version inside our src directory called v1.



## Usage

This application can be tested using an API development tool like Postman. You can use the following endpoints to interact with the API:

### Users Endpoints
Let's suppose for now that the ``$versionNumber`` is v1:
1. GET api/``$versionNumber``/users/register
    To register a new user.
2. GET api/``$versionNumber``/users/login
    To login a user.

### Todo Endpoints 
#### All todo endpoints require a valid token in the request header. You can get a token by registering a new user or logging in an existing user.
1. GET api/``$versionNumber``/todos
    To get a list of all todos.

2. GET api/``$versionNumber``/todos/:todoId
    To get a single todo, where :todoId is the ID of the todo you want to retrieve.

3. GET api/``$versionNumber``/todos/get-sub-todo/:todoId/:subTodoId
    To get a single sub-todo, where :todoId is the ID of the parent todo and :subTodoId is the ID of the sub-todo you want to retrieve.

4. POST api/``$versionNumber``/todos/new
    To create a new todo, with the todo details in the request body.

5. POST api/``$versionNumber``/todos/new-sub-todo/:todoId
    To create a new sub-todo for a specific todo, with the sub-todo details in the request body and :todoId as the ID of the parent todo.

6. PUT api/``$versionNumber``/todos/update/:todoId
    To update a todo, with the updated todo details in the request body and :todoId as the ID of the todo.

7. PUT api/``$versionNumber``/todos/update-sub-todo/:todoId/:subTodoId
    To update a sub-todo, with the updated sub-todo details in the request body, :todoId as the ID of the parent todo, and :subTodoId as the ID of the sub-todo.

8. DELETE api/``$versionNumber``/todos/delete/:todoId
    To delete a todo, where :todoId is the ID of the todo you want to delete.

9. DELETE api/``$versionNumber``/todos/delete-sub-todo/:todoId/:subTodoId
    To delete a sub-todo, where :todoId is the ID of the parent todo and :subTodoId is the ID of the sub-todo you want to delete.


## Medium Article (Recommened 😎)
https://medium.com/@ahmedalasher22/understanding-mvc-pattern-in-nodejs-f6eff0eeda84

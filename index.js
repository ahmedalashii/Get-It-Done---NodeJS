const express = require('express');
//! Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.
const cors = require('cors');
const auth = require('./middlewares/auth');
//* Create an express app
const app = express();
const returnJson = require('./modules/json_response');
const createHttpError = require('http-errors');
// Handle CORS + middleware >> CORS = Cross Origin Resource Sharing which is a security feature in browsers to control access to 
// resources (such as APIs) hosted on a different domain than the one the web page originated from. 
// It is a security feature implemented by browsers to prevent malicious scripts from making unauthorized requests and accessing sensitive data.
app.use(cors());
global.returnJson = returnJson; // To make the returnJson function available globally

/*
    * The request life cycle:
    1- Request comes in
    2- We need to validate the request
    3- If there's a problem, we need to stop the request and send back a response
    4- If everything is OK, we need to pass the request along to the route handler
    5- Route handler might do some database stuff
    6- We need to respond with some JSON

    * The request goes through a series of layers:
    1- Request comes in
    2- It first goes to the first middleware
    3- If its api endpoint found, Then it goes to the router handler
    4- If its api endpoint not found, Then it goes to the not found error handler middleware which in turn will be passed and handled by the global error handler middleware
*/

//* DB STUFF
require("dotenv").config();
//! Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology (Twelve-Factors = Twelve Best Practices , one of them is that an application's configuration should be stored in the environment and not in the codebase).
require("./config/database").connect();


process.on('unhandledRejection', (reason) => { // To catch unhandled promise rejections
    console.log('Unhandled Rejection at:', reason.stack || reason);
    process.exit(1); // To exit with a 'failure' code
});

app.use(express.json()); // In earlier versions of Express.js, the body-parser package was commonly used to handle request bodies, including JSON payloads. However, starting from Express version 4.16.0, the express package itself provides a built-in middleware called express.json() to parse JSON request bodies.

/*
    ? express.json(): 
    * Returns middleware that only parses urlencoded "bodies" and only looks at requests
    * where the Content-Type header matches the type option
*/
app.get("/", (res, req) => { //^ GET method route >> for testing only :D
    res.send("Hoooray! It works! This is Home page"); // a great info right! :D
});


const UsersRoute = require('./v1/api/routes/users.routes'); // import the users route
app.use('/api/v1/users', UsersRoute); // use the users route
const TodosRoute = require('./v1/api/routes/todo.routes'); // import the todos route
app.use('/api/v1/todos', auth, TodosRoute); // use the todos route

/*
* Not Found Error Handler 
*/

app.use((request, response, next) => {
    const error = createHttpError(404, 'This Api Endpoint Not Found');
    return next(error); // Which in turn will be handled by the global error handler middleware
});


/*
* Global Error Handler
*/
//^ This is a global error handler middleware
app.use((error, request, response, next) => {

    // return returnJson(response, error.statusCode || 500, false, error.message || 'Internal Server Error', null);

    return response.status(error.statusCode || 500).json({
        status: false,
        message: error.message,
    });
});


const PORT = process.env.API_PORT || 3000;
// The OR operator || uses the right value if left is falsy, while the nullish coalescing operator ?? uses the right value if left is null or undefined.
// Both app.listen and http.createServer are methods used in Node.js to create an HTTP server and start listening for incoming HTTP requests.
//! if you are using Express.js, it is recommended to use app.listen as it provides a simplified and convenient way to create an HTTP server. 
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});


//? What are routes?
/*
    Basic routing:
    Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
    Each route can have one or more handler functions, which are executed when the route is matched.
    Route definition takes the following structure:
    ! app.METHOD(PATH, HANDLER)
    Where:
        ~ app is an instance of express.
        ~ METHOD is an HTTP request method, in lowercase.
        ~ PATH is a path on the server.
        ~ HANDLER is the function executed when the route is matched.

    The following examples illustrate defining simple routes.
    Respond with Hello World! on the homepage:
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    Respond to a POST request on the root route (/), the application’s home page:
    app.post('/', (req, res) => {
        res.send('Got a POST request')
    })

    Respond to a PUT request to the /user route:
    app.put('/user', (req, res) => {
        res.send('Got a PUT request at /user')
    })

    Respond to a DELETE request to the /user route:
    app.delete('/user', (req, res) => {
        res.send('Got a DELETE request at /user')
    })


    ? Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.
    Middleware functions can perform the following tasks:
        ~ Execute any code.
        ~ Make changes to the request and the response objects.
        ~ End the request-response cycle.
        ~ Call the next middleware function in the stack.

    If the current middleware function does not end the request-response cycle, 
    it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

    An Express application can use the following types of middleware:
        * Application-level middleware
        * Router-level middleware
        * Error-handling middleware
        * Built-in middleware
        * Third-party middleware
    You can load application-level and router-level middleware with an optional mount path. You can also load a series of middleware functions together, which creates a sub-stack of the middleware system at a mount point.

    ! Application-level middleware
    Bind application-level middleware to an instance of the app object by using the app.use() and app.METHOD() functions, where METHOD is the HTTP method of the request that the middleware function handles (such as GET, PUT, or POST) in lowercase.
    This example shows a middleware function with no mount path. The function is executed every time the app receives a request.
    app.use(function (req, res, next) {
        console.log('Time:', Date.now())
        next()
    })

    This example shows a middleware function mounted on the /user/:id path. The function is executed for any type of HTTP request on the /user/:id path.
    app.use('/user/:id', function (req, res, next) {
        console.log('Request Type:', req.method)
        next()
    })
    This example shows a route and its handler function (middleware system). The function handles GET requests to the /user/:id path.
    app.get('/user/:id', function (req, res, next) {
        res.send('USER')
    })
*/
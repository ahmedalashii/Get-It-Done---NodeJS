const express = require('express');
//! Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.
const bodyParser = require('body-parser');
//! Node.js body parsing middleware. It's used to parse the incoming request bodies in a middleware before you handle it.
const cors = require('cors');
const auth = require('./middlewares/auth');
//* Create an express app
const app = express();
// Handle CORS + middleware >> CORS = Cross Origin Resource Sharing which is a security feature in browsers
app.use(cors());
app.use(function (req, res, next) { // req = request, res = response, next = next function
    res.header("Access-Control-Allow-Origin", "*"); //^ = allow all
    res.header("Access-Control-Allow-METHODS", "GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS"); // allow these methods
    res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept"); // allow these headers
    next();
});

//* DB STUFF
require("dotenv").config();
//! Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.
require("./config/database").connect();

app.use(express.json());
/*
    * Returns middleware that only parses urlencoded bodies and only looks at requests
    * where the Content-Type header matches the type option
*/
app.use(bodyParser.urlencoded({ extended: true }));
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.get("/", (res, req) => { // GET method
    res.send("Hoooray! It works! This is Home page"); // a great info right! :D
});


const UsersRoute = require('./v1/api/routes/users.routes'); // import the users route
app.use('/api/v1/users', UsersRoute); // use the users route
const TodosRoute = require('./v1/api/routes/todo.routes'); // import the todos route
app.use('/api/v1/todos', auth, TodosRoute); // use the todos route
const PORT = process.env.API_PORT || 3000;
// The OR operator || uses the right value if left is falsy, while the nullish coalescing operator ?? uses the right value if left is null or undefined.
app.listen(PORT, () => {
    console.log("Server is running on port 3000");
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
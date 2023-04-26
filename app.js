// mongodb+srv://ahmedalasher22:<password>@cluster0.bh9v9el.mongodb.net/?retryWrites=true&w=majority
const express = require('express');
//! Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // to parse the body of the request
require('dotenv').config();
// Create out express app
const app = express();

// Handle CORS + middleware >> CORS = Cross Origin Resource Sharing which is a security feature in browsers
app.use(function (req, res, next) { // req = request, res = response, next = next function
    res.header("Access-Control-Allow-Origin", "*"); // * = allow all
    res.header("Access-Control-Allow-METHODS", "GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS"); // allow these methods
    res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept"); // allow these headers
    next();
});

// DB STUFF
const uri = process.env.ATLAS_DB_STRING;
mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to DB');
    }).catch((err) => {
        console.log(err);
    });

app.use(bodyParser.json()); // to parse the body of the request

// Routes
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

app.get("/", (res, req) => { // GET method
    res.send("Hoooray! It works! Home page");
});

const TodosRoute = require('./routes/Todos');
app.use('/todos', TodosRoute); // use the todos route

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
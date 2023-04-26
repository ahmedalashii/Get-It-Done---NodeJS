const mongoose = require('mongoose');
const statuses = ["NOT_STARTED", "IN_PROGRESS", "DONE", "CANCELLED"];
const TodosSchema = new mongoose.Schema({
    todo: String,
    author: String,
    creationDate: Date,
    sort: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
    status: {
        type: String,
        enum: statuses,
        default: statuses[0],
    },
    subTodos: [{
        todo: String,
        author: String,
        creationDate: Date,
        sort: Number, // 1, 2, 3, 4, 5 >> 1 is the most important and 5 is the least important
        status: {
            type: String,
            enum: statuses,
            default: statuses[0]
        },
    }]
});
module.exports = mongoose.model('Todos', TodosSchema);
const mongoose = require('mongoose');
const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];
const TodosSchema = new mongoose.Schema({
    todo: String,
    author: String,
    created_at: Date,
    updated_at: Date,
    deadline: Date,
    completed_at: Date,
    sort: Number, // 1, 2, 3, 4, 5 .. >> length of the array 
    status: {
        type: String,
        enum: statuses,
        default: statuses[0],
    },
    subTodos: [{
        todo: String,
        author: String,
        created_at: Date,
        updated_at: Date,
        deadline: Date,
        completed_at: Date,
        sort: Number, // 1, 2, 3, 4, 5 .. >> length of the array
        status: {
            type: String,
            enum: statuses,
            default: statuses[0]
        },
    }]
});
module.exports = mongoose.model('Todos', TodosSchema);
const mongoose = require('mongoose');
const statuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELED"];

const SubTodoSchema = new mongoose.Schema({
    todo: String,
    created_at: Date,
    updated_at: Date,
    deadline: Date,
    completed_at: Date,
    sequence: Number, // 1, 2, 3, 4, 5 .. >> length of the array + 1
    status: {
        type: String,
        enum: statuses,
        default: statuses[0]
    },
});

const TodoSchema = new mongoose.Schema({
    todo: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    deadline: Date, // or due_date
    completed_at: Date,
    sequence: Number, // 1, 2, 3, 4, 5 .. >> length of the array + 1
    status: {
        type: String,
        enum: statuses,
        default: statuses[0],
    },
    subTodos: [SubTodoSchema]
});
module.exports = mongoose.model('Todo', TodoSchema);

/*
    You don't have to use a schema validation package like Joi.

    But it would be good to use both of them. They compliment each other.

    Joi is used for APIs to make sure that the data the client sends is valid. And mongoose schema is used to ensure that our data is in right shape.

    A scenario where API validation with Joi makes sense:

    We generally hash the user password, so in our user schema the maxlength option of the password can much bigger than the actual password length. So with Joi we can validate the password field so that it can't be greater than for example 10 characters in a login route.

    A scenario where mongoose schema validation makes sense:

    Let's say the client sent a valid data, it is possible that we forgot to set a property when we create a document. If we hadn't a required: true option in the mongoose schema for that field, the document would be created without that field.

    Also validating the client data as soon as possible is good for security and performance before hitting the database.

    The only downside of using both is some validation duplication. But it seems they created a package called joigoose to create a mongoose schema from a Joi schema.

*/
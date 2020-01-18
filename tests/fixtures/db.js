const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Bilal',
    email: 'bilal@foji.com',
    password: 'abc@123',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Moosa',
    email: 'moosa@foji.com',
    password: 'abc@123',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task one',
    completed: true,
    createdBy: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task two',
    completed: false,
    createdBy: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task three',
    completed: true,
    createdBy: userTwo._id
}

const setDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setDatabase
}
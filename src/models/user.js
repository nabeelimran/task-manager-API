const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can not contains the phrase "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age can\'t be negative')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'createdBy'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.getAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens.push({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Unable to login!')
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        throw new Error('Unable to login!')
    }

    return user
}

// Hashing password before saving to Database
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Removing user's tasks before removing user
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ createdBy: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
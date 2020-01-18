const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setDatabase} = require('./fixtures/db')

beforeEach(setDatabase)

test('Should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'nabeel',
        email: 'abc@xyz.com',
        password: 'mypass123!'
    }).expect(201)

    //assertion about database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    
    //assertion about response
    expect(response.body).toMatchObject({
        user: {
            name: 'nabeel',
            email: 'abc@xyz.com'    
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('mypass123!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login notexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'abc@xyz.com',
        password: '123abcd'
    }).expect(400)
})

test('Should able to get profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile when unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar for the user', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Rafaqat'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Rafaqat')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'malir'
        })
        .expect(400)
})



//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
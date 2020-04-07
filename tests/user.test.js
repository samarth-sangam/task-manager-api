const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db')

beforeEach(setUpDatabase)
// Signup test 1
test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({ 
        name: 'Samarth', 
        email: 'samarth@example.com',
        password: 'MyPass123!'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Samarth',
            email: 'samarth@example.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass123!')

})

//Signup test 2
test('Should not signup user with invalid email/password', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'samarth',
            email: 'samarth@email',
            password: 'pass'
        })
        .expect(400)

        expect(response.body.errors.email.message).toBe('Email is invalid')
        expect(response.body.errors.password.message).toBe('Path `password` (`pass`) is shorter than the minimum allowed length (7).')
})

// Login test 1
test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({ 
        email: userOne.email, 
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

// Login test 2
test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'userOne@example.com', 
        password: userOne.password
    }).expect(400)
})

// Profile test 1
test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// Profile test 2
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

// Delete test 1
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// Delete test 2
test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

// Upload avatar test 1
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

// Update test 1
test('Should update valid user fields' , async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            name: 'Jess'
         })
         .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

//Update test 2
test('Should not update invalid user fields' , async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            location: 'Bangalore'
         })
         .expect(400)
})

// Update test 3
test('Should not update user if unauthenticated', async() => {
    await request(app)
        .patch('/users/me')
        .send({ 
            name: 'Samarth'
        })
        .expect(401)
})

// Update test 4
test('Should not update user with invalid email/password', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'samarth@email',
            password: 'pass'
        })
        .expect(400)

        expect(response.body.errors.email.message).toBe('Email is invalid')
        expect(response.body.errors.password.message).toBe('Path `password` (`pass`) is shorter than the minimum allowed length (7).')
})
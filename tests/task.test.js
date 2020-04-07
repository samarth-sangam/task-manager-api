const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOneId, 
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree, 
    setUpDatabase
 } = require('./fixtures/db')

beforeEach(setUpDatabase)

// Create test 1
test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            description: 'From my test'
        })
        .expect(201)
        const task = Task.findById(response.body._id)
        expect(task).not.toBeNull()
})

//Create test 2
test('Should not create task with invalid completed', async() => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            completed: 'samarth'
        })
        .expect(400)
})

// Fetch test 1
test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        
        expect(response.body.length).toEqual(2)
})

// Fetch test 2
test('Should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.find({ _id: taskOne._id, owner: userOneId })
    expect(task).not.toBeNull()
})

// Fetch test 3
test('Should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

// Fetch test 4
test('Should not fetch other user task by id', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

// Fetch test 5
test('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({ 
            completed: true
        })
        .send()
        .expect(200)

    expect(response.body.length).toBe(1)
})

// Fetch test 6
test('Should fetch only incompleted tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({ completed: false })
        .send()
        .expect(200)

        expect(response.body.length).toBe(1)
})

// Fetch test 7
test('Should sort task by description', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .query({
        sortBy: 'description:desc'
    })
    .send()
    .expect(200)
    expect(response.body[0].description).toBe('Second Task')
})

// Fetch test 8
test('Should fetch page of tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .query({
            limit: 1,
            skip: 1
        })
        .send()
        .expect(200)
    expect(response.body[0].description).toBe('Second Task')
})

// Delete test 1
test('Should not delete other users tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()
})

// Delete test 2
test('Should delete user task', async () => {
    await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        const task = await Task.findById(taskTwo._id)
        expect(task).toBeNull()
})

// Delete test 3
test('Should not delete if unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

// Update test 1
test('Should not update task with invalid completed', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            completed: 'samarth'
        })
        .expect(400)
})

// Update test 2
test('Should not update other user tasks', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({ 
            completed: true
        })
        .expect(404)
})

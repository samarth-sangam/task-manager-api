# task-manager-api

RestAPI for task manager

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

```
nodejs
API Key of sendgrid
```

* **Link to create [SendGrid](https://sendgrid.com/) account**

### Installing

A step by step series of examples that tell you how to get a development env running.

Clone the repository to ```task-manager-api``` directory

```
cd task-manager-api
npm install
```

### Post Installation

1. Create config directory under task-manager-api.
2. Add dev.env, test.env files to config directory.

Add below lines to dev.env, and test.env
```
PORT=3000
SENDGRID_API_KEY=<SENDGRID_API_KEY>
MONGODB_URL=<For Example:mongodb://127.0.0.1:27017/task-manager-api>
JWT_SECRET=<Preferred JWT Key>
```

```npm run dev``` to run development mode.

## API Documentation
Find out API documentation at [task-manager-api](https://documenter.getpostman.com/view/10086105/Szt5eWR6)
## Running the tests

Step by step guide to run automated tests for this system.

### Test Setup

Test cases can be found under ```test``` folder
1. ```__mocks__``` consists of library mocks.
2. ```fixtures``` consists of prerequistes for the test cases and required data.
3. ```config/test.env``` consists of environment variables to run test cases.
4. Setup a test database to run test cases.



### Example test case
```
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
```
Above test case is to check if task is created for a particular user.

## Deployment
Deployment steps to deploy on heroku.

* Create [Heroku account](https://id.heroku.com/login)
* Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

To Verify
```
heroku --version
```

Add ssh key
```
ssh-keygen -t rsa -b 4096 -C "<your email id>"
ssh-add ~/.ssh/id_rsa
```

Create heroku application
```
heruko create <app-name>
heruko config:JWT_SECRET:<JWT Key> MONGODB_URL:<Production mongodb url> SENDGRID_API_KEY:<SendGrid api key>
```

Add files to git

Add files to heroku
```
git push heroku master
```

## Author
* **Samarth Sangam** - *Initial Work*

## Acknowlegdement

* Andrew Mead


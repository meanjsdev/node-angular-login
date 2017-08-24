# Login Signup MEAN Stack Application


## Guidelines

This document provides installation steps for Login Signup application developed in Angular 4, using RESTful API interface in NodeJS.

## RESTful URLs

### General guidelines for RESTful URLs

* List of users:
    * GET http://localhost:4000/users
* Fetch user by id:
    * GET http://localhost:4000/users/id
* User Login:
    * POST http://localhost:4000/users/login
* Create/Register a user:
    * POST http://localhost:4000/users/register
* Forgot password:
    * GET http://localhost:4000/users/forgot-password
* Reset Password:
    * GET http://localhost:4000/users/reset-password

## Prerequisites
What things you need to install the software and how to install them

```
NodeJS
MongoDb
NPM
```

## Installing

Backend

```
npm install
npm run start // Application will start on localhost:4000
```

Frontend

```
npm install
npm run start // Application will start on localhost:3000
```

### Authors

* **Nikhil Khurana** - *Initial work* - [meanjsdev](https://github.com/meanjsdev)

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

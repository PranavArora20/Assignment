# Simple To-Do CRUD API

A simple REST API built with Node.js and Express to manage To-Do items.

## Features
- Create, Read, Update, and Delete todos
- Stores data in a local JSON file
- Input validation
- `completed` field for tracking status

## Endpoints
| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| GET    | `/todos`       | Get all todos       |
| POST   | `/todos`       | Create a new todo   |
| PUT    | `/todos/:id`   | Update a todo       |
| DELETE | `/todos/:id`   | Delete a todo       |

## Deployed Link : [Link](https://assignment-v8jm.onrender.com)

## Run Locally
```bash
npm install
node index.js

const express = require("express");
const fs = require("fs");
const { v4: generateId } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "./todos.json";

app.use(express.json());

function readTodos() {
  try {
    const fileData = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(fileData || "[]");
  } catch (error) {
    console.error("Error reading todos:", error);
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

app.get("/", (req, res) => {
  res.send("Welcome to the To-Do API! Use /todos to access endpoints.");
});

app.get("/todos", (req, res) => {
  const todos = readTodos();
  return res.status(200).json(todos);
});

app.post("/todos", (req, res) => {
  const { title, completed = false } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ message: "Todo title is required." });
  }
  const todos = readTodos();
  const todoItem = {
    id: generateId(),
    title: title.trim(),
    completed: Boolean(completed),
  };
  todos.push(todoItem);
  writeTodos(todos);
  return res.status(201).json(todoItem);
});

app.put("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const { title, completed } = req.body;
  const todos = readTodos();
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index === -1) {
    return res.status(404).json({ message: "Todo not found." });
  }
  if (title !== undefined) todos[index].title = title;
  if (completed !== undefined) todos[index].completed = completed;
  writeTodos(todos);
  return res.status(200).json(todos[index]);
});

app.delete("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const todos = readTodos();
  const updatedTodos = todos.filter((todo) => todo.id !== todoId);
  if (todos.length === updatedTodos.length) {
    return res.status(404).json({ message: "Todo not found." });
  }
  writeTodos(updatedTodos);
  return res.status(200).json({ message: "Todo deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

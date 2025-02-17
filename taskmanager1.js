const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const TASKS_FILE = 'tasks.json';

function loadTasks() {
    if (fs.existsSync(TASKS_FILE)) {
        return JSON.parse(fs.readFileSync(TASKS_FILE));
    }
    return [];
}

function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

taskValidator = (req, res, next) => {
    const { title, status } = req.body;
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    if (status && !['pending', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Status must be either pending or completed' });
    }
    next();
};

app.get('/tasks', (req, res) => {
    const tasks = loadTasks();
    res.json(tasks);
});

app.post('/tasks', taskValidator, (req, res) => {
    const tasks = loadTasks();
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', taskValidator, (req, res) => {
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id == req.params.id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    saveTasks(tasks);
    res.json(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
    let tasks = loadTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks(tasks);
    res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
import express from 'express';
export const app = express();

const tasks = [];

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    msg: 'working perfectly',
  });
});

app.post('/tasks', (req, res) => {
  //you can test this api with postman but how many time (CI - answer jst automate it)
  const { title } = req.body;

  const task = {
    id: tasks.length + 1,
    title,
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    task,
  });
});

import express from 'express';
export const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    msg: 'working perfectly',
  });
});

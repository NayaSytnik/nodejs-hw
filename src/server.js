import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';

dotenv.config();

const app = express();
const logger = pinoHttp();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(logger);
const notes = [
  { id: '1', text: 'First note' },
  { id: '2', text: 'Second note' },
];
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  const note = notes.find((item) => item.id === noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.status(200).json(note);
});
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

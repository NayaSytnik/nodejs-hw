import createHttpError from 'http-errors';
import { Note } from '../models/note.js';
export async function getAllNotes(req, res) {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const filter = { userId: req.user._id };

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        content: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  const skip = (page - 1) * perPage;

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter).skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
}
export async function getNoteById(req, res) {
  const { noteId } = req.params;

const note = await Note.findOne({
  _id: noteId,
  userId: req.user._id,
});

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
}
export async function createNote(req, res) {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
}
export async function updateNote(req, res) {
  const { noteId } = req.params;

const updatedNote = await Note.findOneAndUpdate(
  { _id: noteId, userId: req.user._id },
  req.body,
  { returnDocument: 'after' },
);

  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updatedNote);
}

export async function deleteNote(req, res) {
  const { noteId } = req.params;

  const deletedNote = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deletedNote);
}

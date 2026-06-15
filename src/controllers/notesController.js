import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);

  res.status(201).json(newNote);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  const deleted = await Note.findByIdAndDelete(noteId);

  if (!deleted) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(deleted);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const updated = await Note.findByIdAndUpdate(noteId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return next(createHttpError(404, 'Note not found'));
  }

  res.status(200).json(updated);
};

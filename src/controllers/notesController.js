import createHttpError from 'http-errors';
import { Note } from '../models/note.js';


export async function getAllNotes(req, res) {
  const notes = await Note.find();
  res.status(200).json(notes);
}


export async function getNoteById(req, res) {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
}


export async function createNote(req, res) {
  const note = await Note.create(req.body);
  res.status(201).json(note);
}


export async function updateNote(req, res) {
  const { noteId } = req.params;

  const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });

  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updatedNote);
}


export async function deleteNote(req, res) {
  const { noteId } = req.params;

  const deletedNote = await Note.findByIdAndDelete(noteId);

  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deletedNote);
}

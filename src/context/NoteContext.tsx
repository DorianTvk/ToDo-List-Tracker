import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note } from '../types';
import { useAuth } from './AuthContext';

interface NoteContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'userId'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Load notes from localStorage
    if (user) {
      const storedNotes = localStorage.getItem(`notes-${user.id}`);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    }
  }, [user]);

  useEffect(() => {
    // Save notes to localStorage whenever they change
    if (user) {
      localStorage.setItem(`notes-${user.id}`, JSON.stringify(notes));
    }
  }, [notes, user]);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...noteData } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
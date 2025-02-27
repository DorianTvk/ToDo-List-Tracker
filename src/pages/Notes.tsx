import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNotes } from '../context/NoteContext';
import NoteItem from '../components/NoteItem';
import NoteForm from '../components/NoteForm';

const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNote = (noteData: any) => {
    addNote(noteData);
    setShowForm(false);
  };

  const handleUpdateNote = (noteData: any) => {
    if (editingNote) {
      updateNote(editingNote, noteData);
      setEditingNote(null);
    }
  };

  const handleEditNote = (noteId: string) => {
    setEditingNote(noteId);
    setShowForm(true);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const noteToEdit = editingNote ? notes.find(note => note.id === editingNote) : undefined;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notes</h1>
        <button
          onClick={() => {
            setEditingNote(null);
            setShowForm(!showForm);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Note
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingNote ? 'Edit Note' : 'Add New Note'}
          </h2>
          <NoteForm
            onSubmit={editingNote ? handleUpdateNote : handleAddNote}
            initialData={noteToEdit}
            buttonText={editingNote ? 'Update Note' : 'Create Note'}
          />
        </div>
      )}

      <div className="space-y-4">
        {sortedNotes.length > 0 ? (
          sortedNotes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              onEdit={() => handleEditNote(note.id)}
              onDelete={() => deleteNote(note.id)}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg mb-3 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{note.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{note.content}</p>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              Created: {format(new Date(note.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit note"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete note"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
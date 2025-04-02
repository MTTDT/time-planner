"use client"
import { useState } from 'react';
import Sidebar from '../components/plugins/Sidebar';
import NotesEditor from '../components/NotesEditor';

const getPreviewText = (content) => {
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    let lines = [];
    let hasContent = false;
    
    const traverse = (node) => {
      if (node.type === 'text') {
        // Split text by newlines
        const textLines = node.text.split('\n');
        lines.push(...textLines.filter(line => line.trim().length > 0));
        hasContent = true;
      } else if (node.type === 'image') {
        lines.push('[Image]');
        hasContent = true;
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(parsed.root);

    // Take only first 3 non-empty lines
    const previewLines = lines.slice(0, 3);
    
    return hasContent ? previewLines.join('\n') : 'Empty note...';
  } catch (e) {
    console.error('Error parsing note content:', e);
    return 'Unable to load content';
  }
};

const hasImageContent = (content) => {
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    let hasImage = false;
    
    const traverse = (node) => {
      if (node.type === 'image') {
        hasImage = true;
      }
      if (node.children && !hasImage) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(parsed.root);
    return hasImage;
  } catch (e) {
    return false;
  }
};

const NotebookPage = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCreateNote = ({ title, content }) => {
    const newNote = {
      id: Date.now(),
      title: title || 'Untitled',
      content: content,
      createdDate: new Date().toLocaleDateString()
    };
    setNotes([...notes, newNote]);
    setIsModalOpen(false);
  };

  const handleUpdateNote = ({ title, content }) => {
    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? { ...note, title, content }
        : note
    ));
    setIsModalOpen(false);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onToggle={setIsSidebarOpen} />
      <div 
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-48' : 'ml-16'
        }`}
      >
        <div className="p-8">
          <div className="grid grid-cols-4 gap-4">
            {/* Add Note Button */}
            <div 
              onClick={() => {
                setEditingNote(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center h-48 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl text-gray-400">+</div>
            </div>

            {/* Note Cards */}
            {notes.map((note) => (
              <div 
                key={note.id}
                className="relative h-48 bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setEditingNote(note);
                  setIsModalOpen(true);
                }}
              >
                <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{note.createdDate}</p>
                <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-line">
                  {getPreviewText(note.content)}
                </p>
                {hasImageContent(note.content) && (
                  <span className="text-xs text-blue-500">Contains images</span>
                )}
              </div>
            ))}
          </div>

          {/* Note Editor Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-3/4 h-3/4 overflow-hidden">
                <NotesEditor
                  notes={editingNote?.content || ''}
                  title={editingNote?.title || ''}
                  onSave={editingNote ? handleUpdateNote : handleCreateNote}
                  onCancel={() => setIsModalOpen(false)}
                  onDelete={() => handleDeleteNote(editingNote?.id)}
                  showTitle={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
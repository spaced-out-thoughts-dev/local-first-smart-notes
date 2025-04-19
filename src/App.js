import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { nanoid } from 'nanoid';

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [activeNote, setActiveNote] = useState(notes[0]?.id || null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const onAddNote = () => {
    const newNote = {
      id: nanoid(),
      title: 'Untitled Note',
      body: '',
      lastModified: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const onDeleteNote = (noteId) => {
    const filteredNotes = notes.filter(note => note.id !== noteId);
    setNotes(filteredNotes);
    
    if (filteredNotes.length > 0) {
      setActiveNote(filteredNotes[0].id);
    } else {
      setActiveNote(null);
    }
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotes = notes.map(note => {
      if (note.id === activeNote) {
        return {
          ...note,
          ...updatedNote,
          lastModified: Date.now()
        };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const getActiveNote = () => {
    return notes.find(note => note.id === activeNote) || null;
  };

  return (
    <div className="App">
      <Sidebar 
        notes={notes} 
        onAddNote={onAddNote} 
        onDeleteNote={onDeleteNote} 
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Editor 
        activeNote={getActiveNote()} 
        onUpdateNote={onUpdateNote} 
      />
    </div>
  );
}

export default App;
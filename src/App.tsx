import '@picocss/pico/css/pico.min.css'
import './App.css'
import { useDocument } from '@automerge/automerge-repo-react-hooks'
import { updateText } from '@automerge/automerge/next'
import type { AutomergeUrl } from '@automerge/automerge-repo'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

export interface Note {
  id: string;
  title: string;
  body: string;
  lastModified: number;
}

export interface NotesList {
  notes: Note[];
  activeNoteId: string | null;
}

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const [doc, changeDoc] = useDocument<NotesList>(docUrl)

  const onAddNote = () => {
    changeDoc(d => {
      const newNote = {
        id: crypto.randomUUID(),
        title: 'Untitled Note',
        body: '',
        lastModified: Date.now()
      };
      d.notes.unshift(newNote);
      d.activeNoteId = newNote.id;
    });
  };

  const onDeleteNote = (noteId: string) => {
    changeDoc(d => {
      const index = d.notes.findIndex(note => note.id === noteId);
      if (index !== -1) {
        d.notes.splice(index, 1);
        if (d.notes.length > 0) {
          d.activeNoteId = d.notes[0].id;
        } else {
          d.activeNoteId = null;
        }
      }
    });
  };

  const onUpdateNote = (updatedNote: Partial<Note>) => {
    changeDoc(d => {
      const index = d.notes.findIndex(note => note.id === d.activeNoteId);
      if (index !== -1) {
        if (updatedNote.title !== undefined) {
          updateText(d.notes[index], ['title'], updatedNote.title);
        }
        if (updatedNote.body !== undefined) {
          updateText(d.notes[index], ['body'], updatedNote.body);
        }
        d.notes[index].lastModified = Date.now();
      }
    });
  };

  const setActiveNote = (noteId: string) => {
    changeDoc(d => {
      d.activeNoteId = noteId;
    });
  };

  const getActiveNote = () => {
    if (!doc || !doc.notes) return null;
    return doc.notes.find(note => note.id === doc.activeNoteId) || null;
  };

  if (!doc) return (
    <div className="no-active-note">
      LOADING
    </div>
  );

  return (
    <div className="App">
      <Sidebar 
        notes={doc.notes} 
        onAddNote={onAddNote} 
        onDeleteNote={onDeleteNote} 
        activeNote={doc.activeNoteId}
        setActiveNote={setActiveNote}
      />
      <Editor 
        activeNote={getActiveNote()} 
        onUpdateNote={onUpdateNote} 
      />
    </div>
  );
}

export default App
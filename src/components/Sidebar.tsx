import './Sidebar.css';
import { Note } from '../App';

interface SidebarProps {
  notes: Note[];
  onAddNote: () => void;
  onDeleteNote: (noteId: string) => void;
  activeNote: string | null;
  setActiveNote: (noteId: string) => void;
}

function Sidebar({ notes, onAddNote, onDeleteNote, activeNote, setActiveNote }: SidebarProps) {
  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="sidebar">
      <div className="sidebar-actions">
        <button onClick={onAddNote}>Add Note</button>
      </div>
      <div className="sidebar-notes">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className={`sidebar-note ${note.id === activeNote ? 'active' : ''}`}
            onClick={() => setActiveNote(note.id)}
          >
            <div className="sidebar-note-title">
              <strong>{note.title}</strong>
              <button onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
                  onDeleteNote(note.id);
                }
              }}>Delete</button>
            </div>
            <p>{note.body && note.body.substr(0, 100) + '...'}</p>
            <small className="note-meta">
              Last modified: {new Date(note.lastModified).toLocaleDateString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
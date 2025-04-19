import React from 'react';
import './Editor.css';

function Editor({ activeNote, onUpdateNote }) {
  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value
    });
  };

  if (!activeNote) return <div className="no-active-note">No note selected</div>;

  return (
    <div className="editor">
      <div className="editor-title">
        <input
          type="text"
          id="title"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
      </div>
      <div className="editor-body">
        <textarea
          id="body"
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
          placeholder="Write your note here..."
        />
      </div>
    </div>
  );
}

export default Editor;
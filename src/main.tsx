import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { type NotesList } from './App.tsx'

import './index.css'
import { isValidAutomergeUrl, Repo } from '@automerge/automerge-repo'
import { BrowserWebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"
import { RepoContext } from '@automerge/automerge-repo-react-hooks'

const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter("ws://192.168.4.157:3030")],
  storage: new IndexedDBStorageAdapter(),
})

const rootDocUrl = `${document.location.hash.substring(1)}`
let handle
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl)
} else {
  handle = repo.create<NotesList>({
    notes: [],
    activeNoteId: null
  })
}
const docUrl = document.location.hash = handle.url

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <App docUrl={docUrl} />
    </RepoContext.Provider>
  </React.StrictMode>,
)
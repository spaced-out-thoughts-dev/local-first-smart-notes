# Local-First Smart Notes with Embedded LLM

A local-first note-taking application with collaborative features and embedded AI capabilities.

## Features

- Local-first architecture using Automerge
- Cross-device synchronization
- Embedded AI assistant with local LLM support
- Desktop and mobile apps

## Technology Stack

- React with TypeScript
- Vite for building
- Automerge for local-first collaboration
- Electron for desktop app
- Capacitor for mobile apps
- Embedded LLM for offline AI assistance

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# or with yarn
yarn
```

### Development

```bash
# Run in development mode
npm run dev

# Run Electron version
npm run dev:electron
```

### Building

```bash
# Build for web
npm run build

# Build for Electron (desktop)
npm run build:electron

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

## LLM Integration

This application includes an embedded LLM that runs locally on your device without requiring internet access. The LLM provides intelligent assistance for your notes.

### Supported Models

- TinyLlama (1.1B parameters)
- Phi-2 (2.7B parameters)

### Model Downloading

The first time you use the AI assistant, it will download the necessary model files. These will be stored locally for future use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
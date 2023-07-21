import * as monaco from "monaco-editor/esm/vs/editor/editor.api"; // Import the necessary modules

export const antimonyTheme: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    colors: {},
    rules: [
      { token: 'other', foreground: '#FFFFFF' },
      { token: 'model', foreground: '#8185C9' },
      { token: 'species', foreground: '#FD7F20' },
      { token: 'compartment', foreground: '#BC96CA' },
      { token: 'react', foreground: '#21B6A8' },
      { token: 'comment', foreground: '#76B947' },
    ],
};

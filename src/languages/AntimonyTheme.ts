import * as monaco from "monaco-editor/esm/vs/editor/editor.api"; // Import the necessary modules

export const antimonyTheme: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    colors: {},
    rules: [
      { token: 'other', foreground: '#FFFFFF' },
      { token: 'model', foreground: '#6166BC' },
      { token: 'species', foreground: '#b86e30' },
      { token: 'compartment', foreground: '#846893' },
      { token: 'comment', foreground: '#538649' },
    ],
};

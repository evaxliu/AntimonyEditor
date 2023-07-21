import * as monaco from "monaco-editor";

export const antimonyLanguage: monaco.languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      [/\/\/.*/, 'comment'],
      [/React(.*?):/, 'react'], // Add this rule for strings starting with "React" or "react" and ending with a colon
      [/@?[a-zA-Z][\w$]*/, {
        cases: {
          model: 'model',
          species: 'species',
          compartment: 'compartment',
          '@default': 'other',
        },
      }],
    ],
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  },
};
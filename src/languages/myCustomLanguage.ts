import * as monaco from "monaco-editor";

export const myCustomLanguage: monaco.languages.IMonarchLanguage = {
    tokenizer: {
        root: [
          [/@?[a-zA-Z][\w$]*/, {
            cases: {
              model: 'model',
              species: 'species',
              compartment: 'compartment',
              '@default': 'other',
            },
          }],
        ],
        comment: [
          [/\/\/.*/, 'comment'],
          { include: '@whitespace' },
        ],
        whitespace: [
          [/[ \t\r\n]+/, 'white'],
        ],
      },
};
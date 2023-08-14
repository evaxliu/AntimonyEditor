import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { antimonyLanguage } from '../languages/AntimonyLanguage';
import { antimonyTheme } from '../languages/AntimonyTheme';
import { Uri } from 'monaco-editor';
import EventEmitter from "eventemitter3";
// import parseAntimonyModel from '../languages/AntimonyParser'
import { parseAntimonyModel } from '../languages/AntimonyParser'
import { hover } from '@testing-library/user-event/dist/hover';
import { searchModels } from '../features/BrowseBiomodels';
import CustomButton from '../components/CustomButton';

type Monaco = typeof monaco

let newAnt2 = '// Create your antimony model here...'

const AntimonyEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const savedModel = localStorage.getItem('savedModel') || newAnt2;

  let editor: any;

  const monacoRef = useRef<Monaco>();

  useEffect(() => {
    if (editorRef.current) {
      // Load the custom language
      monaco.languages.register({ id: 'antimony' });
      monaco.languages.setMonarchTokensProvider('antimony', antimonyLanguage);

      // Load the custom theme
      monaco.editor.defineTheme('antimonyTheme', antimonyTheme);
      monaco.editor.setTheme('antimonyTheme');

      // Create the Monaco Editor instance
      editor = monaco.editor.create(editorRef.current, {
        bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
        value: savedModel,
        language: 'antimony', // Use your custom language
      });

      // Set language configuration for bracket pair colorization
      monaco.languages.setLanguageConfiguration('antimony', {
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          // Add any other bracket pairs used in your language, including nested ones
        ],
      });

      let parsedModel = parseAntimonyModel(editor.getValue());

      editor.onDidChangeModelContent(() => {
      });

      // let searchedModel = searchModels('glycolysis')

      // Register the hover provider
      monaco.languages.registerHoverProvider('antimony', {
        provideHover: (model, position) => {
          const word = model.getWordAtPosition(position);
          let hoverContents: monaco.IMarkdownString[] = [];
      
          if (word) {
            if (parsedModel.displays.has(word.word)){
              const displayName = parsedModel.displays.get(word.word);
              hoverContents.push(
                { supportHtml: true,
                  value: `<span style="color:#f2ab7c;">"${displayName?.name}"</span>`})
            }
            if (parsedModel.species.has(word.word)) {
              const speciesInfo = parsedModel.species.get(word.word);
              hoverContents.push(
                { supportHtml: true,
                  value: `(<span style="color:#FD7F20;">**species**</span>) ${speciesInfo?.name}`},
                { supportHtml: true,
                  value: `In <span style="color:#BC96CA;">**compartment**</span>: ${speciesInfo?.compartment}` }
              );
            }
            if (parsedModel.units.has(word.word)) {
              const unitInfo = parsedModel.units.get(word.word);
              hoverContents.push(
                { supportHtml: true,
                  value: `(<span style="color:#4954F5;">**unit**</span>) ${unitInfo?.name}` },
                { value: `${unitInfo?.unit}` });
            }
            if (parsedModel.functions.has(word.word)) {
              const functionInfo = parsedModel.functions.get(word.word);
              hoverContents.push(
                { supportHtml: true,
                  value: `(<span style="color:#8185C9;">**function**</span>) ${functionInfo?.name}` },
                { value: `${functionInfo?.function}` });
            }
            if (parsedModel.reactions.has(word.word)) {
              const reactInfo = parsedModel.reactions.get(word.word);
              hoverContents.push(
                { supportHtml: true,
                  value: `(<span style="color:#4DC5B9;">**reaction**</span>) ${reactInfo?.name}` });
            }
            if (parsedModel.initializations.has(word.word)) {
              const initializationInfo = parsedModel.initializations.get(word.word);
              hoverContents.push(
                { supportHtml: true,
                  value: `Initialized Value: <span style="color:#DEF9CB;">${initializationInfo?.value}</span>` });
            }
            if (parsedModel.annotations.has(word.word)) {
              const annotationInfo = parsedModel.annotations.get(word.word);
              const annots = annotationInfo?.annotation.split(',');
              if (annots) {
                for (let i = 0; i < annots.length; i++) {
                  hoverContents.push({ value: `${annots[i]}` });
                }
              }
            }
            return {
              range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
              contents: hoverContents,
            };
          }
      
          return null;
        },
      });

      // Cleanup
      return () => editor.dispose();
    }
  }, []);

  function save() {
    localStorage.setItem('savedModel', editor.getValue());
  }

  // console.log(parseAntimonyModel(newAnt));

  return (
    <div>
      {/* {(getCurrentModel) && */}
      <>
        <div>
          {/* <Tabs/> */}
        </div>
        <div className='menu'>
          <CustomButton name={'Save Changes'} />
          <CustomButton name={'Create Annotations'} />
          <CustomButton name={'Navigate to Edit Annotations'} />
          <CustomButton name={'Insert Rate Law'} />
          <CustomButton name={'Browse Biomodels'} />
          <CustomButton name={'Convert to SBML'} />
          <CustomButton name={'Annotated Variable Highlight Off'}/>
        </div>
      </>
      {/* } */}
      <div id="ant-edit" ref={editorRef} style={{ height: '80vh' }}/>
    </div>
  );
};

export default AntimonyEditor;
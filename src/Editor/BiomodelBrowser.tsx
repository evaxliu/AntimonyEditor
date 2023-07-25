import * as monaco from 'monaco-editor';
import React, { useRef, useEffect } from 'react';

interface SBMLProps {
    sbmlContent: string;
}

const BiomodelBrowser: React.FC<SBMLProps> = ({sbmlContent}) => {
    const sbmlEditorRef = useRef<HTMLDivElement | null>(null);
    const biomodelBrowserRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    let sbmlEditor: any;
    useEffect(() => {
        if (sbmlContent && sbmlEditorRef.current) {
            if (!biomodelBrowserRef.current) {
                // Create the Monaco Editor instance for SBMLViewer
                const sbmlEditor = monaco.editor.create(sbmlEditorRef.current, {
                  value: sbmlContent,
                  language: 'xml',
                });
        
                biomodelBrowserRef.current = sbmlEditor;
              } else {
                // If there's an existing editor instance, update its content
                biomodelBrowserRef.current.setValue(sbmlContent);
              }
        }
    }, [sbmlContent]);

    useEffect(() => {
        return () => {
            biomodelBrowserRef.current?.dispose();
        };
    }, []);
    return (
    <div>
        <div id="biomodel-browser" ref={sbmlEditorRef} style={{ width: '800px', height: '600px' }} />
        <h2 style={{textAlign: "center"}}>Biomodel Browser</h2>
    </div>);
}

export default BiomodelBrowser;
import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import { antimonyLanguage } from "./languages/AntimonyLanguage";
import { antimonyTheme } from "./languages/AntimonyTheme";

const AntimonyEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Load the custom language
      monaco.languages.register({ id: "antimony" });
      monaco.languages.setMonarchTokensProvider("antimony", antimonyLanguage);

      // Load the custom theme
      monaco.editor.defineTheme("antimonyTheme", antimonyTheme);
      monaco.editor.setTheme("antimonyTheme");

      // Create the Monaco Editor instance
      const editor = monaco.editor.create(editorRef.current, {
        value: [
            "// Created by libAntimony v2.12.0.3",
            "model *BIOMD0000000001()",
            "",
            " // Compartments and Species:",
            "  compartment comp1;",
            "  species BLL in comp1, IL in comp1, AL in comp1, A in comp1, BL in comp1;",
            "  species B in comp1, DLL in comp1, D in comp1, ILL in comp1, DL in comp1;",
            "  species I in comp1, ALL in comp1, BwLL;",
            "",
            " // Reactions:",
            " React0: B -> BL; comp1*(kf_0*B - kr_0*BL);",
          ].join("\n"),
        language: "antimony", // Use your custom language
      });

      // Cleanup
      return () => editor.dispose();
    }
  }, []);

  return <div ref={editorRef} style={{ width: "800px", height: "600px" }} />;
};

export default AntimonyEditor;

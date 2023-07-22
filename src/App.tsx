import React from "react";
import AntimonyEditor from "./Editor/AntimonyEditor";
import FileList from "./FileExplorer/FileList";

const App = () => {
  return (
    <div id="app">
      <h1 style={{ textAlign: 'center' }}>The Official Antimony Web Code Editor</h1>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{ 
            width: 180,
            borderRight: '1px solid rgba(0, 0, 0, .08)'
          }}
        >
          
        </div>
        <div id="editor">
          <FileList />
          <AntimonyEditor />
        </div>
      </div>
    </div>
  );
}

export default App;

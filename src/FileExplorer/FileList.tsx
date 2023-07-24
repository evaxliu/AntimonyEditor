import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import * as tree from 'directory-tree';

const FileList = () => {
    const fileTree = tree.default('')

    console.log(fileTree)

    return (
        <div id="file-list">
            
        </div>
    );
}

export default FileList;
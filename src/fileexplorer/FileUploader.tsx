import React, { useRef, useState, useEffect } from 'react';
import { openDB } from 'idb';

const FileUploader = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        async function fetchFiles() {
            try {
                const db = await openDB('filesDatabase', 1, {
                    upgrade(db) {
                        if (!db.objectStoreNames.contains('files')) {
                            const fileStore = db.createObjectStore('files', { autoIncrement: true });
                            // Add any other initialization or migration steps here
                        }
                    },
                });

                const transaction = db.transaction('files', 'readonly');
                const fileStore = transaction.objectStore('files');

                const storedFiles = await fileStore.getAll();

                setFiles(storedFiles);
            } catch (error) {
                console.error('Error fetching files from IndexedDB: ', error);
            }
        }

        fetchFiles();
    }, []); // Run only once, when the component mounts

    // Utility function to read file content asynchronously
    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileText = reader.result?.toString() || '';
                console.log(fileText)
                resolve(fileText);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsText(file);
        });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];

        if (selectedFile) {
            try {
                const fileContent = await readFileContent(selectedFile);

                const db = await openDB('filesDatabase', 1, {
                    upgrade(db) {
                        if (!db.objectStoreNames.contains('files')) {
                            db.createObjectStore('files', { autoIncrement: true });
                        }
                    },
                });

                const transaction = db.transaction('files', 'readwrite');
                const fileStore = transaction.objectStore('files');

                
                // Store the file's text content in IndexedDB
                await fileStore.add({ name: selectedFile.name, content: fileContent });
                console.log('File content added to IndexedDB');

                const storedFiles = await fileStore.getAll();

                // Sort the files in alphanumeric order by file name
                storedFiles.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));

                setFiles(storedFiles);
            } catch (error) {
                console.error('Error adding file to IndexedDB: ', error);
            }
        }
    };

    return (
        <div>
            <style>{`
                .button {
                    background-color: #1c1c1c;
                    border-radius: 2px;
                    border-style: dotted;
                    border-width: 1px;
                    border-color: #1c1c1c;
                    color: #B7B7B7;
                    cursor: pointer;
                    display: inline-block;
                    font-size: 1em;
                    font-weight: normal !important;
                    line-height: 1.2;
                    margin: 0 3px 0 0;
                    padding: 2px 7px;
                    position: relative;
                    text-align: center;
                    text-decoration: none !important;
                    text-overflow: ellipsis;
                    text-shadow: none;
                    white-space: nowrap;
                }
                .button:hover {
                    color: white;
                }
                .menu {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    flex-wrap: wrap;
                }
            `}</style>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} />
            <div>
                <h5 style={{textAlign:'center'}}>Don't Forget to Save Files Before Closing Website</h5>
                <ul>
                    {files.map((file: any) => (
                        <>
                            <button 
                                style={{display:'flex', alignItems:'center', justifyContent:'center'}}
                                className='button' 
                                key={file.name} 
                                onClick={() => console.log('File clicked:', file)}
                            >
                                {file.name}
                            </button> <br />
                        </>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FileUploader;

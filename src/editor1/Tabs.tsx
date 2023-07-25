import { useRef, useState } from "react";
import * as monaco from "monaco-editor";
import React from "react";

type Monaco = typeof monaco

export const Tabs = () => {
    const monacoRef = useRef<Monaco>();

    const [getCurrentModel, setCurrentModel] = useState<monaco.Uri>();
    const [getOpenFiles, setOpenFiles] = React.useState<string[]>([])

    let rv = []

    const closeTab = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, itemUriPath: string) => {
        // if we don't stop propagation then the click event goes to the file and sets it as the currentModel
        e.stopPropagation()
        if (monacoRef.current === undefined) return
        if (getCurrentModel !== undefined) {
            if (itemUriPath === getCurrentModel.path) {
                setCurrentModel(undefined)
            }
        }
    }

    const mouseDownHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, itemUriPath: string) => {
        // handle middle mouse button click on tab to close it.
        if (e.button === 1) {
            closeTab(e, itemUriPath)
        }
    }

    if (monacoRef.current === undefined) return null
    if (getCurrentModel === undefined) return null
    for (const item of monacoRef.current.editor.getModels()) {
        if (item.uri !== undefined) {

            // these three lines determine if the same file name with a different path is open
            // if so, then we display the3 full path.  if not, then we display only the filename on the tab.
            let filenameToDisplay: string = item.uri.path.split("/").pop() ?? ""
            const found = getOpenFiles.filter((filename) => filenameToDisplay === filename.split("/").pop())
            if (found.length > 1) {
                filenameToDisplay = item.uri.path
            }

            rv.push(
                <li key={item.uri.toString()}
                    className="nav-item"
                    style={{
                        "borderRadius": 0,
                        "borderTop": `4px solid ${(item.uri.path === getCurrentModel.path) ? " #5bc0de" : " lightgray"}`,
                        "marginRight": "10px",
                        "marginTop": "10px",
                    }}>
                    <a className={`nav-link ${(item.uri.path === getCurrentModel.path) && "active"}`}
                       style={{"borderRadius": 0}}
                       data-bs-toggle="tab"
                       onMouseDown={(e) => mouseDownHandler(e, item.uri.path)}
                       onClick={() => setCurrentModel(monaco.Uri.file(item.uri.path))}
                    >
                        {filenameToDisplay}
                        <span
                            className="close"
                            style={{
                                "marginLeft": "24px",
                                "marginRight": "8px",
                                "fontWeight": "bolder",
                                "color": "gray",
                            }}
                            onClick={(e) => closeTab(e, item.uri.path)}
                            onMouseOver={(e) => e.currentTarget.style.color = "white"}
                            onMouseOut={(e) => e.currentTarget.style.color = "gray"}
                        >X</span>
                    </a>
                </li>
            )
        }
    }
    return (
        <ul className="nav nav-tabs p2" style={{"paddingLeft": "10px"}}>
            {rv}
        </ul>
    )
}

export default Tabs;
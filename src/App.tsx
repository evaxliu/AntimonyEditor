import {Split} from '@geoffcox/react-splitter';
import {SolidSplitter} from './CustomSplitters';
import AntimonyEditor from "./editor/AntimonyEditor";
import FileList from "./fileexplorer/FileList";
import { searchModels } from './features/BrowseBiomodels';
import './App.css'
import { BsUpload } from 'react-icons/bs';
import FileUploader from './fileexplorer/FileUploader'

const App = () => {
  return (
    <div className='app' style={{height: '100%'}}>
      <div className="wrapper">
        <div className="top" style={{"fontSize": "2em", textAlign: 'center'}}>
          The Official Antimony Web Code Editor
          <div className="float-end" style={{"fontSize": ".5em"}}>
            <a href={"https://reproduciblebiomodels.org/"}>
              https://reproduciblebiomodels.org/
            </a>
          </div>
        </div>
        <div className="middle App" style={{"backgroundColor": "#1c1c1c", color:'white'}}>
          <Split
            renderSplitter={() => <SolidSplitter/>}
            initialPrimarySize='14%'
            splitterSize='3px'
          >
            <div style={{"height": "100%", "overflowY": "scroll"}}>
              <FileUploader/>
              {/* <BsUpload style={{padding: '4px 0 0 7px'}}/> */}
              {/* <input type='file' className='choosefile' /> <br/> */}
            </div>        
            {/* <Split
              renderSplitter={() => <SolidSplitter />}
              splitterSize='3px'
              horizontal
              initialPrimarySize='80%'
            > */}
              <div style={{"height": "100%"}}>
                <AntimonyEditor/>
              </div>
              Logs Here
              <div style={{"padding": "100px", "width": "100%", "height": "100%"}}>
                <div style={{"width": "100%", "height": "100%"}}>
                  <iframe style={{"width": "100%", "height": "100%"}}/>
                </div>
              </div>
            {/* </Split> */}
          </Split>
        </div>
        <div className="bottom" style={{backgroundColor: '#1c1c1c', color:'white'}}>Copyright © 2023 Center for Reproducible Biomedical Modeling</div>
      </div>
    </div>
  );
}

export default App;
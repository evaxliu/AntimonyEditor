import {Split} from '@geoffcox/react-splitter';
import {SolidSplitter} from './CustomSplitters';
import AntimonyEditor from "./editor/AntimonyEditor";
import FileList from "./fileexplorer/FileList";
import EventEmitter from "eventemitter3";
import { searchModels } from './features/BrowseBiomodels';
import './App.css'

type Props = {
  emitter: EventEmitter<string | symbol, any>;
}

const App = ({emitter}: Props) => {
  return (
    <div className='app' style={{height: '100%'}}>
      <div className="wrapper">
        <div className="top" style={{"fontSize": "2em", textAlign: 'center'}}>
          The Official Antimony Web Code Editor
          <div className="float-end" style={{"fontSize": ".5em"}}>
            <a href={"https://reproduciblebiomodels.org/"}>
              {/* <img style={{"width": "48px", "marginRight": "10px"}} src={"GitHub-Mark-Light-64px.png"}/> */}
              https://reproduciblebiomodels.org/
            </a>
          </div>
        </div>
        <div className="middle App" style={{"backgroundColor": "#1c1c1c", color:'white'}}>
          <Split
            renderSplitter={() => <SolidSplitter/>}
            initialPrimarySize='12%'
            splitterSize='3px'
          >
            <div style={{"height": "100%", "overflowY": "scroll"}}>
              {/* <ShadowDom>
                  <div style={{"padding": "10px"}}>
                      <FiletreeRoot emitter={emitter}/>
                  </div>
              </ShadowDom> */}
              <FileList />
              <button style={{cursor:'pointer'}}>Upload Files</button> <br/> <br/>
              <a> File Tree Goes Here </a>
            </div>        
            {/* <Split
              renderSplitter={() => <SolidSplitter />}
              splitterSize='3px'
              horizontal
              initialPrimarySize='80%'
            > */}
              <div style={{"height": "100%"}}>
                {/* <MultiFileEditor emitter={emitter}/> */}
                <AntimonyEditor emitter={emitter}/>
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
        <div className="right">
          <button className='menu-button' style={{cursor:'pointer'}}>Create Annotations</button>
          <button className='menu-button' style={{cursor:'pointer'}}>Navigate to Edit Annotations</button>
          <button className='menu-button' style={{cursor:'pointer'}}>Insert Rate Law</button>
          <button className='menu-button' style={{cursor:'pointer'}}>Browse Biomodels</button>
          <button className='menu-button' style={{cursor:'pointer'}}>Convert to SBML</button>
          <button className='menu-button' style={{cursor:'pointer'}}>Turn Annotated Variable Highlight Off</button>
        </div>
        <div className="bottom" style={{backgroundColor: '#1c1c1c', color:'white'}}>Copyright © 2023 Center for Reproducible Biomedical Modeling</div>
      </div>
    </div>
  );
}

export default App;
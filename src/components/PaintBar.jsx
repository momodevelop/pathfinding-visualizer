import React, { useReducer, useContext, createContext, useState } from 'react';
import { VisualizerContext } from './Visualizer'
import './PaintBar.css'
import { CellTypes } from 'constants/cell'
 
function PaintBarState () {
    this.frc = [];
}
const PaintbarContext = createContext();

const PaintBar = () => {
    let [state] = useState(()=>new PaintBarState())
    return (
        <PaintbarContext.Provider value={state}>
            <div id="navbar" className="paint-navbar">
                <span className="title">Paint Mode</span>
                <PaintBarButton type={CellTypes.NONE}/>
                <PaintBarButton type={CellTypes.OBSTACLE}/>
                <PaintBarButton type={CellTypes.DIFFICULT}/>
                <PaintBarButton type={CellTypes.START}/>
                <PaintBarButton type={CellTypes.END}/>
                
            </div>
        </PaintbarContext.Provider>
    )
    
}

// Component for handling button logic
const PaintBarButton = ({type}) => {
    let context = useContext(VisualizerContext);
    let paintBarContext = useContext(PaintbarContext);
    let [, forceRender] = useReducer((x) => x + 1, 0)
    if (!paintBarContext.frc[type]) {
        paintBarContext.frc[type] = forceRender;
    }

    let name = getNameByType(type)
    let circleClass = getExtraClassByType(type);
    let isSelected = context.mode === type ? "selected" : "";
    return (
        
        <span className={`clickable ${isSelected}`} onClick={()=>{
            paintBarContext.frc[context.mode]();
            context.mode = type;
            paintBarContext.frc[context.mode]();
        }}>
            <div className={circleClass}></div>{name}
        </span>
    )
}



function getNameByType(type) {
    return (
        type === CellTypes.NONE ? "None" : 
        type === CellTypes.OBSTACLE ? "Obstacle" : 
        type === CellTypes.DIFFICULT ? "Difficult" : 
        type === CellTypes.START ? "Start" : 
        type === CellTypes.END ? "End" : ""
    );

}

function getExtraClassByType(type) {
    return (
        type === CellTypes.NONE ? "button-circle-none" :
        type === CellTypes.OBSTACLE ? "button-circle-obstacle" :
        type === CellTypes.DIFFICULT ? "button-circle-difficult" :
        type === CellTypes.START ? "button-circle-start" :
        type === CellTypes.END ? "button-circle-end" : ""
        
    )
}


export default PaintBar;

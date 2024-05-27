import MessageIcon from '../images/message-icon.png';
import LeftArrow from '../images/leftarrow.svg'
import { useCallback, useEffect, useState } from 'react';
function SidePanel({shownodes,setshownodes,selectednode,setNodes}){
    const [text,settext]=useState("");

    //Handler for drag start event
    const dragstart=(event)=>{
        event.dataTransfer.setData('application/reactflow', "This is test message");
        event.dataTransfer.effectAllowed = 'move';
    }

    //When we have selected a node we set its value as the text state value and textarea will also have this value
    useEffect(()=>{
        if(selectednode){
            settext(selectednode.data.value);
        }
    },[selectednode])

    //When user changes the text in the textarea we set the selectednode's value to this value and update the nodes to reflect the changes
    const changeText=useCallback((inputtext)=>{
        if(selectednode){
        setNodes((prevnodes)=>prevnodes.map((node)=>node.id===selectednode.id?{...node,data:{value:inputtext}}:node))
    }
    settext(inputtext);
    },[selectednode])
    return(
        <div>
            {
                (shownodes)?<div className='w-100 flex flex-wrap gap-2 p-2'>
                    <div className='w-1/2 border-2 border-blue-600 p-3 text-blue-600 text-center rounded-xl hover:cursor-pointer' onDragStart={(event)=>dragstart(event)} draggable>
                        <div className='w-100'><img src={MessageIcon} className='m-auto block' alt="message-icon"/></div>
                        <div className='font-semibold'>Message</div>
                    </div>   
                </div>:<div>
                    <div className='w-100'>
                        <div className='flex w-100 items-center border-b-2 border-slate-300'>
                            <div className='w-[14%] p-2 hover:cursor-pointer' onClick={()=>setshownodes(true)}><img src={LeftArrow} className='w-full h-full' alt="left-arrow-icon"/></div>
                            <div className='w-full text-center p-2 font-bold text-gray-700'>Message</div>
                        </div>
                        <div className='w-100 p-3 border-b-2 border-slate-300'>
                            <div className='font-semibold'>Text</div>
                            <div className='w-100'>
                                <textarea className='w-[100%] outline-0 border-2 border-slate-300 rounded-lg p-2' rows={3} value={text}  onChange={(e)=>changeText(e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default SidePanel;
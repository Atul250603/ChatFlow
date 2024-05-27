import { useCallback, useState } from 'react';
import './App.css';
import Chatflow from './components/ChatFlow';
import { ReactFlowProvider } from 'reactflow';
function App() {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [error,seterror]=useState(false);
  const [success,setsuccess]=useState(false);

  //Function for showing error alert
  const showError=useCallback(()=>{
    seterror(true);
    const timeout=setTimeout(()=>{
      seterror(false);
    },2000)
    return ()=>clearTimeout(timeout);
  },[])

  //Function for showing success alert
  const showSuccess=useCallback(()=>{
    setsuccess(true);
    const timeout=setTimeout(()=>{
      setsuccess(false);
    },2000)
    return ()=>clearTimeout(timeout);
  },[])

  //Function to save the flow when save changes button is clicked
  const save=useCallback(()=>{
    if(reactFlowInstance){
      const rfinstanceobj=reactFlowInstance.toObject(); //converting the reactflowinstance to object
      const nodes=rfinstanceobj.nodes;
      const edges=rfinstanceobj.edges;
      if(nodes.length>1){ //checking if we have more than 1 empty targethandler nodes
        const targetNodeIds=new Set(edges.map((edge)=>edge.target));
        const nodeswithemptytargethandler=nodes.filter((node)=>!targetNodeIds.has(node.id));
        if(nodeswithemptytargethandler.length>1){
          showError();
          return;
        }
      }
      else if(nodes.length<1){ //checking if we have 0 nodes
        showError();
        return;
      }
      localStorage.setItem('chatflow',JSON.stringify(rfinstanceobj)); //storing the chatflow in the localStorage
      showSuccess();
      return;
    }
  },[reactFlowInstance])
  return (
    <div className='h-screen w-100'>
      <div className='min-h-[7%] w-100 max-h-auto bg-gray-200 flex items-center justify-end'>
        <div className='w-[90%] flex justify-center'>
          {(error)?<div className='p-1 bg-red-300 font-semibold w-max rounded-lg'>Cannot Save The Flow</div>:<></>}
          {(success)?<div className='p-1 bg-green-300 font-semibold w-max rounded-lg'>Successfully Saved The Flow</div>:<></>}
          
        </div>
        <button className='bg-white border-2 border-blue-600 text-blue-600 p-1 mx-4 rounded-xl font-semibold w-[10%]' onClick={()=>save()}>Save Changes</button>
      </div>
      <div className='flex w-100 h-[93%]'>
        
        <ReactFlowProvider>
          <Chatflow reactFlowInstance={reactFlowInstance} setReactFlowInstance={setReactFlowInstance}/>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow
  } from 'reactflow';
  import 'reactflow/dist/style.css';
  import CustomNode from './CustomNode';
import SidePanel from './SidePanel';
let id=0;
function Chatflow({reactFlowInstance,setReactFlowInstance}){
    const nodeTypes=useMemo(()=>({customnode:CustomNode}),[]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [shownodes, setshownodes] = useState(true);
    const [selectednode,setselectednode]=useState(null);

    const { getNodes, getEdges } = useReactFlow();

    useEffect(()=>{
        async function init(){
            try{
                const rfinstanceobj=await JSON.parse(localStorage.getItem('chatflow'));
                if(rfinstanceobj){
                    const localnodes=rfinstanceobj.nodes;
                    id=localnodes[localnodes.length-1].id;
                    setNodes(localnodes);
                    setEdges(rfinstanceobj.edges.map((edge)=>({...edge,markerEnd: { type: 'arrow' }})));
                }
            }
            catch(error){
                console.log(error);
            }
        }
        init();

    },[])
    //Handler for node connections
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({...params,markerEnd: { type: 'arrow' }}, eds)),
        [],
    );

    //Handler for the node being dragged over the viewport
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        
    }, []);

    //Handler for the node being dropped in the viewport
    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
          const type = event.dataTransfer.getData('application/reactflow');
          if (typeof type === 'undefined' || !type) {
            return;
          }
          const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
          id=id+1;
          const newNode = {
            id: String(id),
            type:"customnode",
            position,
            data: { value: `${type}` },
          };
          setNodes((nds) =>[...nds,newNode]);
        },
        [reactFlowInstance],
    );  

    //Handler for node click event
    const onNodeClick=useCallback((e,node)=>{
        setshownodes(false);
        setselectednode(node);
    },[])


    //Validating The Node Connection
    const isValidConnection=useCallback((connection)=>{
        const nodes=getNodes();
        const edges=getEdges();
        //Checking for self loop
        if (connection.target === connection.source) return false;
        for(const edge of edges){
            if(edge.source===connection.source)return false; //Only one edge per source
        }
        return true;

    },[getEdges,getNodes])
    return(
        <div className='w-100 h-full'>
                <div className='flex w-screen h-full'>
                <div className="reactflow-wrapper w-[80%] h-full">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                    isValidConnection={isValidConnection}
                  >
                  </ReactFlow>
                </div>
                <div className='w-[20%] h-full border-l-2 border-t-2 border-slate-300'>
                    <SidePanel shownodes={shownodes} setshownodes={setshownodes} selectednode={selectednode} setNodes={setNodes}/>
                </div>
                </div>
        </div>
    )
}
export default Chatflow;
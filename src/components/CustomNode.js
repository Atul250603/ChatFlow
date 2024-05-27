import { Handle, Position } from 'reactflow';
import MessageIconDark from '../images/message-icon-dark.png';
import WhatsappIcon from '../images/whatsapp.png';
function CustomNode({data}){
    return(
        <div>
            <Handle type="target" position={Position.Left} />
            <div className='shadow-2xl shadow-slate-800 rounded-b-lg w-[300px] react-flow__node.selected'>
                <div className='flex gap-2 items-center justify-between bg-cyan-300 p-3 rounded-t-lg'>
                    <div className='flex gap-2 items-center'>
                        <div className='h-[20px] w-[20px] flex items-center justify-center'><img src={MessageIconDark} className='h-full' alt="message-icon"/></div>
                        <div className='text-large font-bold'>Send Message</div>
                    </div>
                    <div className='h-[20px] w-[20px] flex items-center justify-center'><img src={WhatsappIcon} className='h-full' alt="whatsapp-icon"/></div>
                </div>
                <div className='p-3 font-semibold break-all'>
                    {data.value}
                </div>
            </div>
            <Handle type="source" position={Position.Right}/>
        </div>
    )
}
export default CustomNode;
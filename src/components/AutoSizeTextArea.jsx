import "../scss/AutoSizeTextArea.scss";
import { useEffect, useState, useRef } from "react";
export default function AutoSizeTextArea({placeholder="",value="", onInput = (e)=>{}})
{
    const textarea = useRef(null);
    

    useEffect(()=>
    {

        textarea.current.style.height = "auto";

        if(textarea.current.scrollHeight  > 0)
        {
            textarea.current.style.height = `${textarea.current.scrollHeight}px`;
        }
        
    },[value]);
    function valueChanged(e)
    {
        
        textarea.current.style.height = "auto";

        if(textarea.current.scrollHeight  > 0)
        {
            textarea.current.style.height = `${textarea.current.scrollHeight}px`;

        }
        
        onInput(e);
    }
    const [messageInputSize, setMessageInputSize] = useState(1);
    return <>
    <textarea placeholder={placeholder} value={value} rows={1}  ref={textarea}  onInput={(e)=>valueChanged(e)} className={`auto-size-text-area size-${messageInputSize}`}></textarea>
    </>
    
}
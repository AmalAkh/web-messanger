import "../scss/AutoSizeTextArea.scss";
import { useEffect, useState, useRef } from "react";
export default function AutoSizeTextArea({placeholder="",value="", onInput = (e)=>{}})
{
    const textarea = useRef(null);
    useEffect(()=>
    {

        setMessageInputSize(value.split("\n").length <=4 ? value.split("\n").length:4);
        
    },[value]);
    function valueChanged(e)
    {
        
        setMessageInputSize(e.target.value.split("\n").length <=4 ? e.target.value.split("\n").length:4);
        onInput(e);
    }
    const [messageInputSize, setMessageInputSize] = useState(1);
    return <>
    <textarea placeholder={placeholder} value={value}  ref={textarea}  onInput={(e)=>valueChanged(e)} className={`auto-size-text-area size-${messageInputSize}`}></textarea>
    </>
    
}
import "../scss/AutoSizeTextArea.scss";
import { useState } from "react";
export default function AutoSizeTextArea({placeholder="", onInput = (e)=>{}})
{
    function valueChanged(e)
    {
        setMessageInputSize(e.target.value.split("\n").length <=4 ? e.target.value.split("\n").length:4);
        onInput(e);
    }
    const [messageInputSize, setMessageInputSize] = useState(1);
    return <>
    <textarea placeholder={placeholder}  onInput={(e)=>valueChanged(e)} className={`auto-size-text-area size-${messageInputSize}`}></textarea>
    </>
    
}
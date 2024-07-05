import { useEffect, useRef, useState } from "react";
import "../scss/MessagesView.scss";
import groupByDate from "../utils/group-by-date";
import Message from "./ChatMessage";

/** @description Component for displaying messages in ChatView component 
 * 
 * 
 * 
*/


export default function MessageView({messages=[]})
{
    
    const [currentDate, setCurrentDate] = useState("");//current date for sticky label

    let groupedMessages = groupByDate(messages);
    const messageView = useRef(null);

    useEffect(()=>
    {
        
        setTimeout(()=>
        {
            messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"instant"});
        },10);
        
    }, [messages])


    function onMessagesScroll()
    {
       
        for(let el of document.querySelectorAll(".grouped-messages-container p.date"))
            {

                if(el.offsetTop-el.offsetHeight-10 <= messageView.current.scrollTop)
                    {
                        setCurrentDate(el.innerText);
                    }
            }
    }
    return <>
    <div className="messages-view" onScroll={onMessagesScroll} ref={messageView}>
        
        
    <div className="date-label"><p>{currentDate}</p></div>

    {Object.keys(groupedMessages).map((date, index)=>
    {
        return <div className="grouped-messages-container" key={date+index.toString()}>
            <p className="date">{date}</p>
            { groupedMessages[date].map((message)=>
            {
                return <Message key={message.id} text={message.text} date={message.date}></Message>
            })}
        </div>
    })}
       

        
        
    </div>
    </>
}
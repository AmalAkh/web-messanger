import { useEffect, useRef, useState } from "react";
import "../scss/MessagesView.scss";
import groupByDate from "../utils/group-by-date";
import Message from "./ChatMessage";
import WebSocketMessage from "../abstractions/websocket-message";

/** @description Component for displaying messages in ChatView component 
 * 
 * 
 * 
*/


export default function MessageView({messages=[],userId, ws=null, onMessageChange=(type, message)=>{}})
{
    
    const [currentDate, setCurrentDate] = useState("");//current date for sticky label

    let groupedMessages = groupByDate(messages);
  
    
    const messageView = useRef(null);

    const eventListenerSet  = useRef(false);
    useEffect(()=>
    {
        if(messageView.current.scrollHeight <= messageView.current.clientHeight)
        {
            
            for(let msg of messages)
            {
                if(!msg.seen && !msg.isLocal)
                {
                    ws.send(JSON.stringify(new WebSocketMessage("see_msg", {id:msg.id})));
                    console.log(msg.id);
                }
            }
        }
        setTimeout(()=>
        {
            messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"instant"});
        },10);
        
    }, [messages])
    useEffect(()=>
    {
        if(ws && !eventListenerSet.current)
        {
            
            console.log("chnagedd seen");
              
            ws.addEventListener("message", (webSocketMessage)=>
            {
                
              webSocketMessage = JSON.parse(webSocketMessage.data);
              console.log(webSocketMessage);
              if(webSocketMessage.type == "see_msg")
              {
                
                onMessageChange("see", webSocketMessage.data.id);
                console.log("chnagedd seen");
              }
            })
            eventListenerSet.current = true;
        }
    }, [ws]);

    function onMessagesScroll(e)
    {
       
        for(let el of document.querySelectorAll(".grouped-messages-container p.date"))
        {

            if(el.offsetTop-el.offsetHeight-10 <= messageView.current.scrollTop)
            {
                setCurrentDate(el.innerText);
            }  
        }
        if(messageView.current.scrollTop != messageView.current.scrollHeight)
        {
            for(let msg of messages)
                {
                    
                    if(!msg.seen && !msg.isLocal )
                    {
                        
                        //&& document.getElementById(msg.id).offsetTop <= messageView.current.scrollTop+messageView.current.clientHeight
                        ws.send(JSON.stringify(new WebSocketMessage("see_msg", {id:msg.id, senderId:userId})));
                        console.log(msg.id);
                    }
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
                return <div id={message.id}><Message key={message.id} text={message.text} date={message.date} isLocal={message.isLocal} seen={message.seen}></Message></div>
            })}
        </div>
    })}
       

        
        
    </div>
    </>
}
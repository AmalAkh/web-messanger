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


export default function MessageView({messages=[],scrollToEnd=false,userId, ws=null, onMessageChange=(type, message)=>{}})
{
    
    const [currentDate, setCurrentDate] = useState("");//current date for sticky label

    let groupedMessages = groupByDate(messages);
  
    
    const messageView = useRef(null);

    const eventListenerSet  = useRef(false);

    const previousScrollTop = useRef(-1);
    useEffect(()=>
    {
        if(messageView.current.scrollHeight <= messageView.current.clientHeight)
        {
            
            for(let msg of messages)
            {
                if(!msg.seen && !msg.isLocal)
                {
                    console.log("without scrolling");
                    ws.send(JSON.stringify(new WebSocketMessage("see_msg", {id:msg.id})));
                    
                }
            }
        }
        setTimeout(()=>
        {
            if(previousScrollTop.current == -1)
            {
                messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"instant"});
                
            }
            
        },10);
        if(scrollToEnd)
        {
            messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"instant"});
            
        }
        
    }, [messages])
    useEffect(()=>
    {
        if(ws && !eventListenerSet.current)
        {
            
           
              
            ws.addEventListener("message", (webSocketMessage)=>
            {
                
              webSocketMessage = JSON.parse(webSocketMessage.data);
             
              if(webSocketMessage.type == "see_msg")
              {
                
                onMessageChange("see", webSocketMessage.data.id);
                
              }
            })
            eventListenerSet.current = true;
        }
    }, [ws]);

    function onMessagesScroll(e)
    {
        previousScrollTop.current = messageView.current.scrollTop;
        for(let el of document.querySelectorAll(".grouped-messages-container p.date"))
        {

            if(el.offsetTop-el.offsetHeight-10 <= messageView.current.scrollTop)
            {
                setCurrentDate(el.innerText);
            }  
        }
        if(messageView.current.scrollTop+messageView.current.clientHeight != messageView.current.scrollHeight)
        {
            for(let msg of messages)
                {
                          
                    if(!msg.seen && !msg.isLocal && document.getElementById(msg.id).offsetTop <= messageView.current.scrollTop+messageView.current.clientHeight )
                    {
                        
                        
                        ws.send(JSON.stringify(new WebSocketMessage("see_msg", {id:msg.id, senderId:userId})));
                        onMessageChange("see", msg.id);

                        console.log("seen");
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
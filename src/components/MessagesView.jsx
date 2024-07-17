import { useEffect, useRef, useState } from "react";
import "../scss/MessagesView.scss";
import groupByDate from "../utils/group-by-date";
import Message from "./ChatMessage";
import WebSocketMessage from "../abstractions/websocket-message";
import eventBus from "../utils/event-bus";

/**  Component for displaying messages in ChatView component 
 * @param {Array} messages - array of messages
 *  @param {String} userId - the id of conversation partner 
 * 
 * 
*/


export default function MessageView({messages=[],userId})
{
    
    const [currentDate, setCurrentDate] = useState("");//current date for sticky label

    let groupedMessages = groupByDate(messages);
  
    
    const messageView = useRef(null);

    
    /**
     * previous scroll top to prevent from automatic scrlling to the end after update
     */
    const previousScrollTop = useRef(-1);
    useEffect(()=>
    {
        /** in case we dont have scrolling we have to set seen=true for all messages because we see all them at once */
        if(messageView.current.scrollHeight <= messageView.current.clientHeight)
        {
            
            for(let msg of messages)
            {
                if(!msg.seen && !msg.isLocal)
                {
                    
                    eventBus.emit("see-nonlocal-message", {id:msg.id});
                    
                    
                }
            }
        }
        setTimeout(()=>
        {
            if(previousScrollTop.current == -1)
            {
                messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"instant"});
                
            }else
            {
                messageView.current.scroll({left:0, top:previousScrollTop.current, behavior:"instant"});

            }
            
        },10);

        /** scroll to the end in case we send new message  */
        if(scrollToEnd.current)
        {

            setTimeout(()=>
            {
                messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"smooth"});
                scrollToEnd.current = false;
            },10);
        }
        
    }, [messages])
    

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
                    
                        eventBus.emit("see-nonlocal-message", {id:msg.id, senderId:userId});
                    
                    }
                }
        }
        
        
    }
    const scrollToEnd = useRef(false);
    useEffect(()=>
    {
    
        eventBus.addEventListener("new-message",(message)=>
        {
            scrollToEnd.current = true;
        })
    },[])
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
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


export default function MessageView({messages=[],userId, allMessagesLoaded=false})
{
    
    const [currentDate, setCurrentDate] = useState("");//current date for sticky label

    let groupedMessages = groupByDate(messages);
    
    
    const prevMessagesCount = useRef(0)
    
    const messageView = useRef(null);

    
    /**
     * previous scroll top to prevent from automatic scrlling to the end after update
     */
    const previousScrollTop = useRef(-1);
    useEffect(()=>
    {
        
        if(isLoadingIndicatorVisible)
        {
            setIsLoadingIndicatorVisible(false);
            console.log('scrolled');
            
            let elementIndex = messages.length - prevMessagesCount.current-1;
            if(elementIndex < 0)
            {
                elementIndex = 0;
            }
            
            messageView.current.scroll({left:0, top:document.getElementById(messages[elementIndex].id).offsetTop+10, behavior:"instant"});
            prevMessagesCount.current = messages.length;
            
            return;
            
        }
        /** in case we dont have scrolling we have to set seen=true for all messages because we see all them at once */
        if(messageView.current.scrollHeight <= messageView.current.clientHeight)
        {
            
            for(let msg of messages)
            {
                if(!msg.seen && !msg.isLocal)
                {
                    
                    eventBus.emit("see-nonlocal-message", {id:msg.id,senderId:userId});
                    
                    
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
            console.log("scorlled");
            setTimeout(()=>
            {
                messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"smooth"});
                scrollToEnd.current = false;
            },10);
        }
        if(prevMessagesCount.current == 0)
        {
            console.log("scrolllll");
            messageView.current.scroll({left:0, top:messageView.current.scrollHeight, behavior:"instant"});

        }
        prevMessagesCount.current = messages.length;
        
        
        
    }, [messages])
    /**hide loading indicator in case we had loaded all messages*/
    useEffect(()=>
    {
        setIsLoadingIndicatorVisible(false);
    },[allMessagesLoaded])
    
    const [isLoadingIndicatorVisible, setIsLoadingIndicatorVisible] = useState(false);
    function onMessagesScroll(e)
    {
        /**request new portion of messages*/

        if( messageView.current.scrollTop == 0 && !allMessagesLoaded)
        {
        
            
            setIsLoadingIndicatorVisible(true);
            
            eventBus.emit("load-more-messages");
            
        }
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
        if(messageView.current.scrollHeight == messageView.current.scrollTop+messageView.current.clientHeight)
        {
                
            for(let msg of messages)
            {
                if(!msg.seen && !msg.isLocal)
                {
                        
                    eventBus.emit("see-nonlocal-message", {id:msg.id,senderId:userId});
                        
                        
                }
            }
        }
        
        
        
    }
    const scrollToEnd = useRef(false);
    useEffect(()=>
    {
        eventBus.addEventListener("new-message",(message)=>
        {
            if(message.isLocal || (!message.isLocal && messageView.current.scrollTop+messageView.current.clientHeight >= messageView.current.scrollHeight -50 ))
            {
               // console.log(messageView.current.scrollHeight);
                scrollToEnd.current = true;
                
                
            }
            
        })
    },[])
    return <>
    <div className="messages-view" onScroll={onMessagesScroll} ref={messageView}>

        {isLoadingIndicatorVisible &&  <p className="loading-indicator">Loading</p>}
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
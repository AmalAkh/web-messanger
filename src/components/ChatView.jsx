import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";

import axios from 'axios';

import Chat from './../abstractions/chat';
import AutoSizeTextArea from './AutoSizeTextArea';
import MessageView from './MessagesView';
import { useEffect, useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
import Message from '../abstractions/message';
import WebSocketMessage from '../abstractions/websocket-message';
import eventBus from '../utils/event-bus';
import createDateWithOffset from '../utils/create-date-with-offset';
import "./../scss/ChatView.scss";




export default function ChatView({userName,userAvatar,userId,chatId="",onSeeMessage=()=>{}})
{

  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;
  const [messages, _setMessages] = useState([]);
  const messagesRef = useRef([]);

  const eventListenerSet  = useRef(false);

  let setMessages = (data)=>
  {
    _setMessages(data);
    messagesRef.current = data;
  };
  const [messageText, setMessageText] = useState("");

  const navigate = useNavigate();

  

  useEffect(()=>
  {
    
    eventBus.addEventListener("new-message", (message)=>
    {
      
      addNewMessage(message);
    })
    eventBus.addEventListener("see-local-message", (message)=>
    {
      seeMessage(message.id);
    })
    eventBus.addEventListener("see-nonlocal-message", (message)=>
    {
      seeMessage(message.id);
    })
      
      
    
  },[]);
  
  function addNewMessage(newMessage)
  {
    
    if(chatIdRef.current == newMessage.chatId)
    {
      console.log("new message was added");
      setMessages([...messagesRef.current, {...newMessage,date:createDateWithOffset(newMessage.date) }])
    }
    
  
  }
  function seeMessage(id)
  {
    setMessages([...messagesRef.current.map((msg)=>
      {
        if(id == msg.id)
        {
          return {...msg, seen:true}
        }else
        {
          return msg
        }
      })])
  }
  

  useEffect(()=>
  {
    
    if(chatId != "")
    {
      
      axios.get(`http://localhost:8000/chats/${chatId}/messages/0`,{headers:{'Authorization':localStorage.getItem("jwt")}}).then((res)=>
        {
          setMessages(res.data.map((message)=>
          {
            
            return {...message, date:createDateWithOffset(message.date)};
          }));
          
        }).catch((err)=>
        {
          navigate("/login");
        })
    }

  },[chatId]);
  const [scrollToEnd, setScrollToEnd] = useState(false);
  
  function sendMessage()
  {
    if (messageText.trim() != "")
    {
     
      
      eventBus.emit("send-message",new Message(messageText.trim(), Date.now(), chatId, userId) );
      setMessageText("");
      
      
    }
  }

    return <>
    <div className='chat'>
          <div className='top-bar'>
            <img src="" className='avatar-img'/>
            <div>
              <p>{userName}</p>
              <p className='user-status'>online</p>
              
              
              
            </div>
          </div>
          <MessageView userId={userId} messages={messages} scrollToEnd={scrollToEnd} ></MessageView>
          <div className="bottom-bar">
            {/*<button className='clear attach-btn'><FontAwesomeIcon icon={faPlus} /> </button>*/}
            <AutoSizeTextArea placeholder='Message' value={messageText} onInput={(e)=>setMessageText(e.target.value)}></AutoSizeTextArea>
            <button className='clear send-btn' onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /> </button>
          
          </div>

        </div>
    </>
}
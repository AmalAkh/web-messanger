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




export default function ChatView({userName,userAvatar,userId,chatId="", ws=null})
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
    if(ws && !eventListenerSet.current)
    {
      console.log("test");
      
        
      ws.addEventListener("message", (webSocketMessage)=>
      {
        webSocketMessage = JSON.parse(webSocketMessage.data);
        if(webSocketMessage.type == "new_msg")
        {
         
          addNewMessage(webSocketMessage.data);
        }
      })
      eventListenerSet.current = true;
    }
  }, [ws]);
  
  function addNewMessage(newMessage)
  {
    
    if(chatIdRef.current == newMessage.chatId)
    {
   
      setMessages([...messagesRef.current, {...newMessage,date:new Date(newMessage.date) }])
    }
    
  
  }
  function onMessageChange(type, id)
  {
    //debugger;
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
    /*let newMessages = [];
    newMessages.push(new Message("Message tester", "2024-06-01 14:01", "123"));
    newMessages.push(new Message("Message tester", "2024-06-04 14:21","1234"));
    newMessages.push(new Message("Message tester", "2024-06-08 12:01","12345"));
    newMessages.push(new Message("Message tester", "2024-06-01 14:01", "123f"));
    newMessages.push(new Message("Message tester", "2024-06-04 14:21","1234g"));
    for(let i = 0; i < 28;i++)
    {
      newMessages.push(new Message("Message tester", "2024-06-08 12:01",Math.random().toString()));
    }
    newMessages.push(new Message("Message tester last", "2024-06-21 14:21","1234gggg1"));

    newMessages.push(new Message("Message tester last", "2024-06-22 14:21","1234gggg2"));

    newMessages.push(new Message("Message tester last", "2024-06-23 14:21","1234gggg3"));

    setMessages([...newMessages]);*/
    if(chatId != "")
    {
      
      axios.get(`http://localhost:8000/chats/${chatId}/messages/0`,{headers:{'Authorization':localStorage.getItem("jwt")}}).then((res)=>
        {
          setMessages(res.data.map((message)=>
          {
            return {...message, date:new Date(message.date)}
          }));
          console.log(res.data);
        }).catch((err)=>
        {
          navigate("/login");
        })
    }

  },[chatId]);
  
  function sendMessage()
  {
    if (messageText.trim() != "")
    {
     
      let websocketMessage = new WebSocketMessage("new_msg", new Message(messageText.trim(), Date.now(), chatId, userId));
      ws.send(JSON.stringify(websocketMessage));
      setMessageText("");
    }
  }

    return <>
    <div className='chat'>
          <div className='top-bar'>
            <img src="" className='avatar-img'/>
            <div>
              <p>{userName}</p>
            </div>
          </div>
          <MessageView userId={userId} messages={messages} ws={ws} onMessageChange={onMessageChange}></MessageView>
          <div className="bottom-bar">
            {/*<button className='clear attach-btn'><FontAwesomeIcon icon={faPlus} /> </button>*/}
            <AutoSizeTextArea placeholder='Message' value={messageText} onInput={(e)=>setMessageText(e.target.value)}></AutoSizeTextArea>
            <button className='clear send-btn' onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /> </button>
          
          </div>

        </div>
    </>
}
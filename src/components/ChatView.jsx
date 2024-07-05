import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";

import axios from 'axios';

import Chat from './../abstractions/chat';
import AutoSizeTextArea from './AutoSizeTextArea';
import MessageView from './MessagesView';
import { useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import Message from '../abstractions/message';




export default function ChatView({userName,userAvatar,chatId=""})
{


    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

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
        }).catch((err)=>
        {
          navigate("/login");
        })
    }

  },[chatId]);
  
  function sendMessage()
  {
    if (message.trim() != "")
    {
      setMessages([...messages, new Message(message.trim(), Date.now())]);
      setMessage("");
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
          <MessageView messages={messages}></MessageView>
          <div className="bottom-bar">
            {/*<button className='clear attach-btn'><FontAwesomeIcon icon={faPlus} /> </button>*/}
            <AutoSizeTextArea placeholder='Message' value={message} onInput={(e)=>setMessage(e.target.value)}></AutoSizeTextArea>
            <button className='clear send-btn' onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /> </button>
          
          </div>

        </div>
    </>
}
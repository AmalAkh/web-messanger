import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import ModalWindow from './ModalWindow';

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
import getImage from '../api/http/get-avatar';
import getUserInfo from '../api/http/get-user-info';
import getAvatar from '../api/http/get-avatar';




export default function ChatView({userName,userAvatar,userId,chatId="",onSeeMessage=()=>{}})
{

  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const [messages, _setMessages] = useState([]);
  const messagesRef = useRef([]);

  const eventListenerSet  = useRef(false);

  let setMessages = (data)=>
  {
    _setMessages(data);
    messagesRef.current = data;
  };
  const [messageText, setMessageText] = useState("");

  const [currentUserStatus, setCurrentUserStatus] = useState("offline");

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
    
    eventBus.addEventListener("status-change", (changedUserId, status)=>
    {
      if(userIdRef.current == changedUserId)
      {
        setUserStatus(status);
      }
      
    })
      
      
    
  },[]);
  function setUserStatus(status)
  {
    if(status != "online")
      {
        let statusDate = createDateWithOffset(status);
        let date = new Date();
        if(statusDate.getDate() == date.getDate() && statusDate.getMonth() == date.getMonth() && statusDate.getFullYear() == date.getFullYear())
        {
          setCurrentUserStatus(`Last seen at ${statusDate.getHours()}:${statusDate.getMinutes() >=10 ? statusDate.getMinutes() : "0"+ statusDate.getMinutes() }`)
        }else
        {
          setCurrentUserStatus(`Last seen on ${status}`);
        }
        
        return;
      }
      setCurrentUserStatus(status);
  }
  function addNewMessage(newMessage)
  {
    
    if(chatIdRef.current == newMessage.chatId)
    {
     
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
      axios.get(`http://localhost:8000/users/${userId}/status`,{headers:{'Authorization':localStorage.getItem("jwt")}}).then((res)=>
      {
        setUserStatus(res.data);
      });
      
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
  const [isUserInfoModalVisible, setIsUserInfoModalVisible] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  function hideUserInfoModal()
  {
    setIsUserInfoModalVisible(false);
  }
  async function showUserInfoModal()
  {
    let info = await getUserInfo(userId);

    setUserInfo({...info.data})
    
    setIsUserInfoModalVisible(true);
  }
  

    return <>
    <div className='chat'>
          <div className='top-bar' onClick={showUserInfoModal} >
            <img src={getImage(userAvatar)} className='avatar-img'/>
            <div>
              <p>{userName}</p>
              <p className={`user-status ${currentUserStatus == "online" && 'online'}`}>{currentUserStatus}</p>
              
              
              
            </div>
          </div>
          <MessageView userId={userId} messages={messages} scrollToEnd={scrollToEnd} ></MessageView>
          <div className="bottom-bar">
            {/*<button className='clear attach-btn'><FontAwesomeIcon icon={faPlus} /> </button>*/}
            <AutoSizeTextArea placeholder='Message' value={messageText} onInput={(e)=>setMessageText(e.target.value)}></AutoSizeTextArea>
            <button className='clear send-btn' onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /> </button>
          
          </div>
          <ModalWindow title={userInfo.name} isVisible={isUserInfoModalVisible} onClose={hideUserInfoModal}  id="user-info-modal">
             
            <img className='avatar-img' src={getAvatar(userInfo.avatar)}/>  
            <div className='info-block'>
              <small>Name</small>
              <p>@{userInfo.name}</p>
            </div>
            <div className='info-block'>
              <small>Nickname</small>
              <p>@{userInfo.nickname}</p>
            </div>

            <button className='remove-button'>Remove chat with this user</button>
            

          </ModalWindow>
        </div>
    </>
}
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

import "./scss/App.scss";
import ModalWindow from './components/ModalWindow';
import Chat from './abstractions/chat';
import AutoSizeTextArea from './components/AutoSizeTextArea';
import ChatView from './components/ChatView';

import {getSetupConnectionFunction} from './api/sockets/websocket-utils';
import getChats from './api/http/get-chats';
import getWebSocketTicket from './api/http/get-websocket-ticket';


function App() {
  
  const [currentChat, setCurrentChat] = useState({});
  const [chats, _setChats] = useState([]);
  const [text, setText] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [webSocket, setWebSocket] = useState(null);

  const chatsRef = useRef([]);
  function setChats(newChats)
  {
    _setChats(newChats);
    chatsRef.current = newChats;
  }



  const navigate = useNavigate();


  useEffect(()=>
  {
    
    if(webSocket == null)
    {

    
      getChats().then((chatsRes)=>
      {
          
        setChats(chatsRes.data);
        
        setupWebSocketConnection();

          
      }).catch((err)=>
      {
        console.log(err);
        navigate("/login");
      })
    }
    
      
    
    
      
    
  }, [currentChat,webSocket]);

  function setupWebSocketConnection()
  {
    getWebSocketTicket().then(async(ticketRes)=>
    {
        
      const setupConnection = getSetupConnectionFunction();
      let websocket = await setupConnection(ticketRes.data);
          
      websocket.onclose = async ()=>
      {
        if(e.code != 1000 && e.code != 1001)
        {
          setupWebSocketConnection();      
                    
        }
      };
          
      setWebSocket(websocket);
      websocket.addEventListener("message",(websocketMessage)=>
      {
        const message = JSON.parse(websocketMessage.data);
        
        if(message.type == "new_msg" )
        {
          
          console.log(chatsRef.current);
          setChats([...chatsRef.current.map((chat)=>
          {
            if(chat.id == message.data.chatId)
            {
              if(!message.data.isLocal)
              {
                return {...chat, unseenMessagesCount:chat.unseenMessagesCount+1}
              }
              return {...chat, lastMessageText:message.data.text}
            }
            return chat;
          })])
        }
      })
          
    
      }).catch((err)=>
      {
        console.log(err);
        navigate("/login");
      })
  }
  function seeMessage()
  {
    
    
      
      setChats([...chatsRef.current.map((chat)=>
      {
        if(chat.id == currentChat.id)
        {
          
          return {...chat, unseenMessagesCount:chat.unseenMessagesCount-1}
        }
        return chat;
      })])
    
        
        
      
  }
  function selectChat(chat)
  {
    
    setCurrentChat(chat);
    
  }
  
  
  

  return (
    <>
      <main>
        <div className='chats-list'>
            <div className="my-profile">
              <img className='avatar-img'/>
              <div className='add-info'>
                <h3>John Johnson</h3>
                <button className='link' onClick={()=>{setIsVisible(true)}}>Change</button>

              </div>
            </div>
            {chats.map((chat)=>
              {
                return (<div className={`chat-item ${currentChat.id == chat.id ? 'selected':''}`} onClick={()=>{selectChat(chat)}} key={chat.id}>
                <img src={`${chat.avatar}`} className='avatar-img'/>
                <div className='text-block'>
                  <p>{chat.userName}</p>
                  <p className='last-message'>{chat.lastMessageText}</p>
                  
                </div>
                {chat.unseenMessagesCount > 0 && <div className='unseen-messages-counter'>
                 <p>{chat.unseenMessagesCount}</p>
                </div>}
                
                </div>)
            
              })}
            
            
        </div>
        <ChatView userName={currentChat.userName} chatId={currentChat.id} userId={currentChat.userId} ws={webSocket} onSeeMessage={seeMessage}></ChatView>
        <ModalWindow title="Test" isVisible={isVisible} onClose={()=>setIsVisible(false)} >

          <div><button onClick={()=>setText(text+"a")}>test</button></div>
        </ModalWindow>
      </main>
    </>
  )
}

export default App

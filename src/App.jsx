import { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlus} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

import "./scss/App.scss";
import ModalWindow from './components/ModalWindow';
import Chat from './abstractions/chat';
import AutoSizeTextArea from './components/AutoSizeTextArea';
import ChatView from './components/ChatView';

import {getSetupConnectionFunction} from './api/sockets/websocket-utils';
import getChats from './api/http/get-chats';
import getWebSocketTicket from './api/http/get-websocket-ticket';

import eventBus from './utils/event-bus';
import WebSocketMessage from './abstractions/websocket-message';

function App() {
  
  const [currentChat, _setCurrentChat] = useState({});
  const currentChatRef = useRef({});
  function setCurrentChat(chat)
  {
    _setCurrentChat(chat);
    currentChatRef.current = chat;
  }

  const [chats, _setChats] = useState([]);
  function setChats(newChats)
  {
    _setChats(newChats);
    chatsRef.current = newChats;
  }
  const [text, setText] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  

  const chatsRef = useRef([]);
  
  
  const webSocketRef = useRef(null);


  const navigate = useNavigate();


  useEffect(()=>
  {
    
    

    
      getChats().then(async (chatsRes)=>
      {
        let chat = new Chat("test", "", "userdidi", []);
        setChats([...chatsRes.data]);
        
        await setupWebSocketConnection();
        console.log("connection setup");
        eventBus.addEventListener("see-nonlocal-message",(message)=>
        {
          //* In case we have seen message of another user*/ 
                
          webSocketRef.current.send(JSON.stringify(new WebSocketMessage("see_msg", message)))
          
          setChats([...chatsRef.current.map((chat)=>
          {
                  
                  
              if(chat.id == currentChatRef.current.id)
              {
                      
                return {...chat, unseenMessagesCount:chat.unseenMessagesCount-1}
              }
                return chat;
          })])
        })
        eventBus.addEventListener("send-message", (message)=>
        {

          webSocketRef.current.send(JSON.stringify(new WebSocketMessage("new_msg", message)));
        })

        webSocketRef.current.addEventListener("message",(websocketMessage)=>
        {
            
            const message = JSON.parse(websocketMessage.data);
            
            if(message.type == "new_msg" )
            {
              
              eventBus.emit("new-message", message.data);
              
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
            }else if(message.type == "see_msg")
            {
              /**In case somebody has seen our message */
              eventBus.emit("see-local-message", message.data);
            }
          })
          
      }).catch((err)=>
      {
        console.log(err);
        navigate("/login");
      })

      
    
    
      
    
    
      
    
  }, []);


  
  function setupWebSocketConnection()
  {
    return new Promise((resolve, reject)=>
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
          webSocketRef.current = websocket;
          resolve(websocket);
          
          
          
          
          
              
        
          }).catch((err)=>
          {
            console.log(err);
            navigate("/login");
          })
    })
    
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
            <button className='new-chat-button'>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            
            
        </div>
        <ChatView userName={currentChat.userName} chatId={currentChat.id} userId={currentChat.userId}></ChatView>
        <ModalWindow title="Test" isVisible={isVisible} onClose={()=>setIsVisible(false)} >

          <div><button onClick={()=>setText(text+"a")}>test</button></div>
        </ModalWindow>
      </main>
    </>
  )
}

export default App

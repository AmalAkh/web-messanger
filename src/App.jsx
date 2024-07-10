import { useEffect, useState } from 'react'
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
  
  const [currentChat, setCurrentChat] = useState("");
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [webSocket, setWebSocket] = useState(null);



  const navigate = useNavigate();


  useEffect(()=>
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
    
      
    
    
      
    
  }, []);

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
          
    
      }).catch((err)=>
      {
        console.log(err);
        navigate("/login");
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
                <p>{chat.userName}</p>
                </div>)
            
              })}
            
            
        </div>
        <ChatView userName={currentChat.userName} chatId={currentChat.id} userId={currentChat.userId} ws={webSocket}></ChatView>
        <ModalWindow title="Test" isVisible={isVisible} onClose={()=>setIsVisible(false)} >

          <div><button onClick={()=>setText(text+"a")}>test</button></div>
        </ModalWindow>
      </main>
    </>
  )
}

export default App

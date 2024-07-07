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


function App() {
  
  const [currentChat, setCurrentChat] = useState("");
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [webSocket, setWebSocket] = useState(null);



  const navigate = useNavigate();


  useEffect(()=>
  {
    axios.get("http://localhost:8000/chats/",{headers:{'Authorization':localStorage.getItem("jwt")}}).then((res)=>
    {
      console.log(chats);
      setChats(res.data);
      axios.get("http://localhost:8000/websocket/ticket",{headers:{'Authorization':localStorage.getItem("jwt")}}).then((ticketRes)=>
        {
         
          let websocket = new WebSocket(`ws://localhost:8000?ticket=${ticketRes.data}`);

          websocket.onopen = ()=>
          {
            setWebSocket(websocket);
          
          };
    
        }).catch((err)=>
        {
          navigate("/login");
        })
    }).catch((err)=>
    {
      navigate("/login");
    })
    
      
    
    
      
    
  }, []);
  
  function selectChat(chat)
  {
    console.log(chat);
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
                return (<div className={`chat-item ${currentChat == chat.id ? 'selected':''}`} onClick={()=>{selectChat(chat)}} key={chat.id}>
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

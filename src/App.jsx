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

  const navigate = useNavigate();


  useEffect(()=>
  {
    axios.get("http://localhost:8000/chats/",{headers:{'Authorization':localStorage.getItem("jwt")}}).then((res)=>
      {
        setChats(res.data);
      }).catch((err)=>
        {
          navigate("/login");
        })
      
  }, []);
  
  function selectedChat(chatId)
  {
      setCurrentChat(chatId);
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
                return (<div className={`chat-item ${currentChat == chat.id ? 'selected':''}`} onClick={()=>{selectedChat(chat.id)}} key={chat.id}>
                <img src={`${chat.avatar}`} className='avatar-img'/>
                <p>{chat.userName}</p>
            </div>)
            
              })}
            
            
        </div>
        <ChatView></ChatView>
        <ModalWindow title="Test" isVisible={isVisible} onClose={()=>setIsVisible(false)} >

          <div><button onClick={()=>setText(text+"a")}>test</button></div>
        </ModalWindow>
      </main>
    </>
  )
}

export default App

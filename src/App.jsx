import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'

import "./scss/App.scss";
import ModalWindow from './components/ModalWindow';
import Chat from './abstractions/Chat';


function App() {
  
  const [currentChat, setCurrentChat] = useState(0);
  const [chats, setChats] = useState({});

  const [isVisible, setIsVisible] = useState(false);

  useEffect(()=>
  {
    if(Object.keys(chats).length == 0)
    {
      setChats({"1":new Chat("Test user", "", 1,1,[]), 2:new Chat("Test user 2", "", 2,2,[])})
    }
  });
  let chatsList = new Array(chats.length);
  Object.keys(chats).forEach((chatId,i)=>
  {
  
    let chat = chats[chatId];
    chatsList[i] = <div className={`chat-item ${currentChat.id == chat.id ? 'selected':''}`} onClick={()=>{selectedChat(chatId)}} key={chatId}>
          <img src={`${chat.avatar}`} className='avatar-img'/>
          <p>{chat.userName}</p>
    </div>
  })
  function selectedChat(chatId)
  {
      setCurrentChat(chats[chatId]);
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
            {chatsList}
            
            
            
        </div>
        <div className='chat'>
          <div className='top-bar'>
            <img src="" className='avatar-img'/>
            <div>
              <p>{currentChat.userName}</p>
            </div>
          </div>
          <div className="messages-container">

          </div>
          <div class="bottom-bar">
            <button className='clear attach-btn'><FontAwesomeIcon icon={faPlus} /> </button>
            <input type="text" placeholder='Message...' className='chat-text-input'/>
            <button className='clear send-btn'><FontAwesomeIcon icon={faPaperPlane} /> </button>
          
          </div>

        </div>
        <ModalWindow title="Test" isVisible={isVisible} onClose={()=>setIsVisible(false)} ></ModalWindow>
      </main>
    </>
  )
}

export default App

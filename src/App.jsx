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
import getAvatar from './api/http/get-avatar';
import getUserInfo from './api/http/get-user-info';

import loading from './assets/loading.gif'

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

  
  const [isUserEditInfoModalVisible, setIsUserEditInfoModalVisible] = useState(false);

  

  const chatsRef = useRef([]);
  
  const webSocketRef = useRef(null);
  const [userInfo, setUserInfo] = useState({}); 
  const userInfoCacheRef = useRef({});
  

  const navigate = useNavigate();


  useEffect(()=>
  {
    
    
      getUserInfo().then((res)=>
      {
        
        setUserInfo({...res.data, avatar:res.data.avatar});
        
      });
    
      getChats().then(async (chatsRes)=>
      {
       
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
            }else if(message.type == "status-change")
            {
              
              eventBus.emit("status-change", message.data.userId, message.data.status);
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
  function showUserEditInfoModal()
  {
    setIsUserEditInfoModalVisible(true);
    userInfoCacheRef.current = {...userInfo};
  }
  function hideUserEditInfoModal()
  {
    setIsUserEditInfoModalVisible(false);
    setUserInfo({...userInfoCacheRef.current});
  }
  function removeAvatar()
  {
    setUserInfo({...userInfo, avatar:null});
    avatarFileRef.current = null;

  }
  function saveUserInfo()
  {

    let formData = new FormData();
    
    formData.append("name", userInfo.name);
    formData.append("nickname", userInfo.nickname);
    

    if(!avatarFileRef.current && !userInfo.avatar)
    {
      formData.append("removeAvatar", true);
      formData.append("avatar", null);
    }else if(avatarFileRef.current)
    {
      formData.append("avatar", avatarFileRef.current);
    }
    else
    {
      formData.append("avatar", null);
    }
    
    
    axios.put("http://localhost:8000/users/info/update", formData, {headers:{'Authorization':localStorage.getItem("jwt")}}).then((res)=>
    {
      if(res.data)
      {
        setUserInfo({...userInfo, avatar:res.data})
      }
      
      setIsUserEditInfoModalVisible(false);
      avatarFileRef.current = null;
    })
  }
  const avatarFileRef = useRef(null);
  async function changeAvatar(e)
  {
    if(e.target.files[0])
    {
      let reader = new FileReader();
      avatarFileRef.current = e.target.files[0];
      reader.onload = ()=>
      {
        setUserInfo({...userInfo, avatar:reader.result});
      }
      reader.readAsDataURL(e.target.files[0]);
      
    }
  }

  
  
  
  

  return (
    <>
      <main>
        <div className='chats-list'>
            <div className="my-profile">
              <img className='avatar-img' src={getAvatar(userInfo.avatar)}/>
              <div className='add-info'>
                <h3>{userInfo.name}</h3>
                <p className='nickname'>@{userInfo.nickname}</p>
                
              </div>
              <button className='link' onClick={showUserEditInfoModal}>Change</button>

            </div>
            {chats.map((chat)=>
              {
                return (<div className={`chat-item ${currentChat.id == chat.id ? 'selected':''}`} onClick={()=>{selectChat(chat)}} key={chat.id}>
                <img src={getAvatar(chat.avatar)} className='avatar-img'/>
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
        <ChatView userName={currentChat.userName} userAvatar={currentChat.avatar} chatId={currentChat.id} userId={currentChat.userId}></ChatView>
        <ModalWindow title="Edit your data" isVisible={isUserEditInfoModalVisible} onClose={hideUserEditInfoModal}  id="edit-user-info-modal">

            
              
              
             
            <img className='avatar-img' src={getAvatar(userInfo.avatar)}/>
            
              
              
            
            <label className='file-upload-button' for="avatar-file-upload" >
              Change
            </label>
            <input type='file' id="avatar-file-upload" onChange={changeAvatar} />
            {userInfo.avatar && <button className='remove-button' onClick={removeAvatar}>Remove image</button>}
            <h5>Name</h5>
            <input type='text' defaultValue={userInfo.name} onInput={(e)=>{setUserInfo({...userInfo, name:e.target.value})}}/>
            <h5>Nickname</h5>
            <input type='text' defaultValue={userInfo.nickname} onInput={(e)=>{setUserInfo({...userInfo, nickname:e.target.value})}}/>

            <button onClick={saveUserInfo}>Save changes</button>
          
        </ModalWindow>
        
      </main>
    </>
  )
}

export default App

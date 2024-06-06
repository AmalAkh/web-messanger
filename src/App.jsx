import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'

import "./scss/App.scss";


function App() {
  

  return (
    <>
      <main>
        <div className='chats-list'>
            <div className="my-profile">
              <img src="" className='avatar-img'/>
              <div className='add-info'>
                <h5>John Johnson</h5>

              </div>
            </div>
            <div className='chat-item'>
              <img src="" className='avatar-img'/>
              <p>Amal</p>
            </div>
        </div>
        <div className='chat'>
          <div className='top-bar'>
            <img src="" className='avatar-img'/>
            <div>
              <p>Tester</p>
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
      </main>
    </>
  )
}

export default App

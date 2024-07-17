import toTimeString from "../utils/to-time-string";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'


export default function ChatMessage({text, date,files=[], isLocal=true, seen=false})
{
    
    return <div  className="message-container">

        <div className={`message ${isLocal && "local-message"} ${seen && "seen"}`}>
            <p className="text">{text}</p>
            <div className="bottom-block">
                <p className="time">{toTimeString(date)}</p>
                {(seen && isLocal) && <FontAwesomeIcon className="seen-check"  icon={faCheck} />}
                <FontAwesomeIcon className="send-check" icon={faCheck} />

            </div>
        </div>
    </div>
}
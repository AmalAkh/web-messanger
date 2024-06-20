import toTimeString from "../utils/to-time-string";

export default function ChatMessage({text, date,files=[], isLocal=true})
{
    return <div  className="message-container">

        <div className={`message ${isLocal && "local-message"}`}>
            <p className="text">{text}</p>
            <p className="time">{toTimeString(date)}</p>
        </div>
    </div>
}
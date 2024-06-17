import { useRef, useEffect } from "react";
import "./../scss/ModalWindow.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ModalWindow({title,children, isVisible=false, onClose=()=>{} })
{
    const isFirst = useRef(true);

    useEffect(()=>
    {
        isFirst.current = false;
    },[])
    return <>
        <div className={`modal-window-background ${isVisible && !isFirst.current ? 'show' :'hidden'}`}>
            <div className="modal-window">
                <div className="modal-window-header">
                    <h4>{title}</h4>
                    <button onClick={onClose} className="close"><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <div className="modal-window-body">
                    {children}
                </div>

            </div>
        </div>
    </>
}
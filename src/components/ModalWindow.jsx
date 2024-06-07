import { useRef, useEffect } from "react";
import "./../scss/ModalWindow.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ModalWindow({title,children, isVisible=false, onClose=()=>{} })
{
    const modalBack = useRef(null);
   
    useEffect(()=>
    {
        if(isVisible)
        {
            modalBack.current.classList.remove("hide-anim");
            modalBack.current.classList.remove("hidden");
            modalBack.current.classList.add("show-anim");
        
        }else
        {
            
            modalBack.current.classList.add("hide-anim");

        }
    })
    
   
    function finishAnimation()
    {
        
        if(!isVisible)
        {
            
            modalBack.current.classList.remove("hide-anim");
            modalBack.current.classList.add("hidden");
            
        }else
        {
            modalBack.current.classList.remove("show-anim");

        }
    }
    return <>
        <div ref={modalBack} className={`modal-window-background hidden`} onAnimationEnd={finishAnimation}>
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
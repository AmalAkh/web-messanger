import { useRef, useEffect } from "react";
import "./../scss/ModalWindow.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ModalWindow({title,children, isVisible=false, onClose=()=>{} })
{
    const modalBack = useRef(null);
    const wasVisible = useRef(false);
   
    useEffect(()=>
    {
        if(isVisible && !wasVisible.value)
        {
            modalBack.current.classList.remove("hide-anim");
            modalBack.current.classList.remove("hidden");
            modalBack.current.classList.add("show-anim");
            wasVisible.value = isVisible;
        }else if(!isVisible && wasVisible.value)
        {
            
            modalBack.current.classList.add("hide-anim");
            wasVisible.value = isVisible;

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
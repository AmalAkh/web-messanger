import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/Login.scss";
import axios from "axios";
import host from "./api/http/host";
import loginIntoApp from "./api/http/login-into-app";

export default function Login()
{   

   const isFirst = useRef(true);
    useEffect(()=>
    {
        isFirst.current = false;
    }, []);

   const [login, setLogin] = useState("");
   const [password, setPassword] = useState("");

   const navigate = useNavigate();


   const [errorMessage, setErrorMessage] = useState("");




   const [loginIsVisible, setLoginIsVisible] = useState(true);
   const [registerIsVisible, setRegisterIsVisible] = useState(false);
   const [codeIsVisible, setCodeIsVisible] = useState(false);


   function auth()
   {
        
        loginIntoApp(login, password).then((response)=>
        {
            localStorage.setItem("jwt", response.data);
            console.log(response.data);
            navigate("/");
        }).catch((err)=>
        {
            console.log(err);
            setErrorMessage(err.response.data.clientMessage);
        })
       
   }


    return <main>
            <div className={`container login-container ${loginIsVisible  ? 'show':'hidden'}`}>
                <h2>Login</h2>
                <input type="text" placeholder="Email or nickname" onInput={(e)=>setLogin(e.target.value)}/>
                <input type="password" placeholder="Password" onInput={(e)=>setPassword(e.target.value)}/>
                { errorMessage != "" && <div className="error-msg" >
                    <p>{errorMessage}</p>
                </div> }
                <button >Register</button>
                <button id="login-button" onClick={auth}>Login</button>


            </div>
            <div className={`container register-container ${registerIsVisible  ? 'show':'hidden'}`} >
                <h2>Register</h2>
                <input type="text" placeholder="Email or nickname"/>
                <input type="password" placeholder="Password"/>
                <input type="password" placeholder="Repeat password"/>
                <button >Login</button>
                <button id="login-button">Register</button>


            </div>
            <div className="container code-container">
                <h2>Enter code from email</h2>
                <input type="text" placeholder="code"/>
               
               
                <button id="login-button">Continue</button>


            </div>
        </main>
}
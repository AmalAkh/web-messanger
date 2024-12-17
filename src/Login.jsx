import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/Login.scss";
import axios from "axios";
import host from "./api/http/host";
import loginIntoApp from "./api/http/login-into-app";
import registerUser from "./api/http/register-user";


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
   const [successfulRegisterIsVisible, setSuccessfulRegisterIsVisible] = useState(false);

   


   const [password2, setPassword2] = useState("");
   const [nickname, setNickname] = useState("");
   const [name, setName] = useState("");

   const [email, setEmail] = useState("");


   

   function auth()
   {
        if(login == "" || password == "")
        {
            setErrorMessage("Fill all fields");
            return;
        }
        loginIntoApp(login, password).then((response)=>
        {
            localStorage.setItem("jwt", response.data);
          
            navigate("/");
        }).catch((err)=>
        {
            
            setErrorMessage(err.response.data.clientMessage);
        })
   }
   function register()
   {
        if(login == "" || password == "" || email == "" || name == "")
        {
            setErrorMessage("Fill all fields");
            return;
        }
        if(password != password2)
        {
            setErrorMessage("Passwords are not the same");
            return;
        }
        registerUser(name,nickname, email, password).then(res=>
        {
            setName("");
            setNickname("");
            setEmail("");
            setPassword("");
            setPassword2("");
            setRegisterIsVisible(false);
            setSuccessfulRegisterIsVisible(true);


        }).catch(err=>
        {
            setErrorMessage(err.response.data.clientMessage);
        });
   }


    return <main>
            <div className={`container login-container ${loginIsVisible  ? 'show':'hidden'}`}>
                <h2>Login</h2>
                <input type="text" placeholder="Email or nickname" onInput={(e)=>setLogin(e.target.value)}/>
                <input type="password" placeholder="Password" onInput={(e)=>setPassword(e.target.value)}/>
                { errorMessage != "" && <div className="error-msg" >
                    <p>{errorMessage}</p>
                </div> }
                <div className="buttons-block">
                    <button onClick={()=>{setLoginIsVisible(false); setRegisterIsVisible(true);setErrorMessage("");}}>Register</button>
                    <button className="blue-button" onClick={auth}>Login</button>
                </div>
            

            </div>
            <div className={`container register-container ${registerIsVisible  ? 'show':'hidden'}`} >
                <h2>Register</h2>
                <input type="text" placeholder="Name"  onInput={(e)=>setName(e.target.value)}/>
                <input type="text" placeholder="Nickname"  onInput={(e)=>setNickname(e.target.value)}/>
                <input type="email" placeholder="Email"  onInput={(e)=>setEmail(e.target.value)}/>

                <input type="password" placeholder="Password"  onInput={(e)=>setPassword(e.target.value)}/>
                <input type="password" placeholder="Repeat password"  onInput={(e)=>setPassword2(e.target.value)}/>
                { errorMessage != "" && <div className="error-msg" >
                    <p>{errorMessage}</p>
                </div> }
                <div className="buttons-block">
                    <button onClick={()=>{setLoginIsVisible(true); setRegisterIsVisible(false); setErrorMessage("");}}>Login</button>
                    <button id="login-button" className="blue-button" onClick={register}>Register</button>
                </div>

            </div>
            <div className={`container successful-register-container ${successfulRegisterIsVisible  ? 'show':'hidden'}`}>
                <h2>You've registered successfully</h2>
             
               
               
                <button className="blue-button" onClick={()=>{setLoginIsVisible(true); setSuccessfulRegisterIsVisible(false)}}>Login</button>


            </div>
        </main>
}
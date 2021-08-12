import React,{useState,useRef} from 'react'
import axios from 'axios';
import './Login.css'
import {Cancel, Room} from '@material-ui/icons';

const Login = ({setShowLogin , myStorage , setCurrentUsername}) => {
    const [error,setError] = useState(false)
    const nameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const user= {
            username:nameRef.current.value,
            password:passwordRef.current.value
        }
        try{
            const res = await axios.post(import.meta.env.VITE_USERS_LOGIN_KEY,user);
            myStorage.setItem('user',res.data.username)
            setCurrentUsername(res.data.username)
            setError(false);
            setShowLogin(false);
        }catch(err){
            setError(true);
        }
    }
    return (
        <div className='login-box'>
            <div className="logo">
                <Room/>Traveler
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Username' ref={nameRef}/>
                <input type="password" placeholder='Password' ref={passwordRef}/>
                <button className='btn-login'>Login</button>
                {error && (
                <span className='failure'>Something went wrong</span>    
                )}
            </form>
            <Cancel className='log-cancel' onClick={()=>{setShowLogin(false)}} />
        </div>
    )
}

export default Login


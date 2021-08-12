import React,{useState,useRef} from 'react'
import axios from 'axios';
import './Register.css'
import {Cancel, Room} from '@material-ui/icons';

const Register = ({setShowRegister}) => {
    const [success,setSuccess] = useState(false)
    const [error,setError] = useState(false)
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value
        }
        try{
            await axios.post(import.meta.env.VITE_USERS_REGISTER_KEY,newUser);
            setError(false);
            setSuccess(true);
        }catch(err){
            setError(true);
        }
    }
    return (
        <div className='register-box'>
            <div className="logo">
                <Room/>Traveler
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Username' ref={nameRef}/>
                <input type="email" placeholder='Email'  ref={emailRef}/>
                <input type="password" placeholder='Password' ref={passwordRef}/>
                <button className='btn-register'>Register</button>
                {success && (
                  <span className='success'>Done, you can login now.</span>  
                )}
                {error && (
                <span className='failure'>Something went wrong</span>    
                )}
            </form>
            <Cancel className='reg-cancel' onClick={()=>{setShowRegister(false)}} />
        </div>
    )
}

export default Register


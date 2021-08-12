import React from 'react'
import './Info.css'
const Info = ({setShowInfo}) => {
    return (
        <>
    <div className='cover'>
        <button className='btn-cover' onClick={()=>{setShowInfo(false)}}>X</button>
        <div className='cover-message'>
          <h1 className='msg-cvr'>Double click to save a pin in the map.</h1>
        </div>
    </div>
    </>
    )
}

export default Info

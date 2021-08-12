import React,{ useState,useEffect  } from 'react';
import ReactMapGL,{Marker,Popup} from 'react-map-gl';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Room,Star} from '@material-ui/icons';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
import Info from './components/Info';

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem('user'));
  const [pins,setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: -31.42414,
    longitude: -64.49778,
    zoom: 4
  });

  useEffect(() => {
   const getData = async () => {
     try{
      const r = await axios.get(import.meta.env.VITE_PIN_KEY)
     
      setPins(r.data);
     }catch(err){
       console.log(err)
     }
   }
   getData();
  }, [])

  const handleMarkerClick=(id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long})
  }
  const handleAddClick = (e)=>{
   if(currentUsername){ 
   const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
   }else{
    setShowRegister(true);
   }
  }
  const handleSubmit= async (e)=>{
    e.preventDefault();
    const newPin={
      username:currentUsername,
      title,
      desc,
      rating:star,
      lat:newPlace.lat,
      long:newPlace.long
    }

    try{
      const res = await axios.post(import.meta.env.VITE_PIN_KEY,newPin);
      setPins([...pins,res.data])
      setNewPlace(null);
    }catch(err){
      console.log(err)
    }
  }

  const handleLogout =()=>{
    myStorage.removeItem('user');
    setCurrentUsername(null);
  }
  return (
    <>
    {!showInfo && <button className='btn-info' onClick={()=>{setShowInfo(true)}}>?</button>}
    {showInfo && <Info setShowInfo={setShowInfo} />}
    
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={import.meta.env.VITE_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle='mapbox://styles/danildany/cks5buul716dc17nya0xg101w'
      onDblClick ={handleAddClick}
      transitionDuration='300'
    >
  
        {pins.map((data,index)=>{
      return(
        <div classname='content' key={index}>
       <Marker 
        latitude={data.lat} 
        longitude={data.long} 
        offsetLeft={-viewport.zoom * 7/2} 
        offsetTop={-viewport.zoom * 7}>
        <Room
         style={{fontSize: viewport.zoom * 7,color:data.username === currentUsername ? 'springgreen': 'gray',cursor:'pointer'}}
         onClick={() => handleMarkerClick(data._id,data.lat,data.long)
        }
         />
      </Marker>
      {data._id === currentPlaceId && (
      <Popup
          latitude={data.lat} 
          longitude={data.long} 
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}
          anchor="left" >
          <div className='card'>
            <label>Place</label>
            <h4 className='place'>{data.title}</h4>
            <label>Review</label>
            <p className='desc'>{data.desc}</p>
            <label>Rating</label>
            <div className='stars'>
              {Array(Number(data.rating)).fill(<Star className='star'/>)}
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{data.username}</b></span>
            <span className="date">{format(data.createdAt)}</span>
          </div>
        </Popup> 
        )}
        </div>
     )})}
     {newPlace && (
     <Popup
          latitude={newPlace.lat} 
          longitude={newPlace.long} 
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left">
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder='Enter a Title' onChange={(e)=>{setTitle(e.target.value)}} />
                <label>Review</label>
                <textarea placeholder='What do you think about this place' onChange={(e)=>{setDesc(e.target.value)}}/>
                <label>Rating</label>
                <select onChange={(e)=>{setStar(e.target.value)}}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submit-button' type='submit'>Add pin</button>
              </form>
            </div>
    </Popup>
    )}
    {currentUsername?
    <button className='button logout' onClick={handleLogout}>Log Out</button>
    : <div className='btn-group'>
    <button className='button login' onClick={()=>{setShowLogin(true)}}>Login</button>
    <button className='button register' onClick={()=>{setShowRegister(true)}}>Register</button>  
    </div>}
    
   {showRegister && <Register setShowRegister={setShowRegister} />}
   {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUsername={setCurrentUsername}/>}
   
    </ReactMapGL>
    </>
  );
}

export default App

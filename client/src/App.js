import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import Home from './components/Home';
import MainPage from './components/MainPage';

const App = () => {
  const [IsLogin, setIsLogin] = useState(false);
  const IsLoginHandler = (loginCookie) =>{ 
    console.log("AAA",loginCookie)
    if(loginCookie != null){
      setIsLogin(true);
      return;
    }
    setIsLogin(false);
  }

  useEffect(() => {
    IsLoginHandler(Cookies.get('login_token'));
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home IsLogin={IsLogin} IsLoginHandler={IsLoginHandler}/>}/>
        <Route path="/*" element={<MainPage IsLogin={IsLogin} IsLoginHandler={IsLoginHandler} />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import List from './List';
import Detail from './Detail';
import Login from './Login';

const MainPage = ({ IsLogin, IsLoginHandler }) => {
  let Url = new URL(window.location.href)
  // let href = Url.pathname;
  const [SearchText, setSearchText] = useState("");  
  // console.log(href);
  
  return (
    <>
      <Header setSearchText={setSearchText} IsLogin={IsLogin} IsLoginHandler={IsLoginHandler}/>
        <Routes>
          <Route index path="search" element={<List SearchText={SearchText}/>}/>
          <Route path="detail" element={<Detail/>}/>
          <Route path="login" element={<Login IsLogin={IsLogin} IsLoginHandler={IsLoginHandler}/>}/>
        </Routes>
    </>
  )
}

export default MainPage
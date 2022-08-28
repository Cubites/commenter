import React, { useEffect, useState } from 'react';
import Header from './Header';
import List from './List';
import Detail from './Detail';
import Login from './Login';

const MainPage = () => {
  let Url = new URL(window.location.href)
  let href = Url.pathname;
  const [SearchText, setSearchText] = useState("");  
  console.log(href);
  if(href === "/detail"){
    return (
      <>
        <Header setSearchText={setSearchText}/>
        
        <Detail/>
      </>
    )
  }else if(href === "/login"){
    return (
      <>
        <Header setSearchText={setSearchText}/>
        
        <Login/>
      </>
    )
  }else{
    return (
      <>
        <Header setSearchText={setSearchText}/>
        
        <List SearchText={SearchText}/>
      </>
    )
  }
}

export default MainPage
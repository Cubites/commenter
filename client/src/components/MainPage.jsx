import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import List from './List';
import Detail from './Detail';

const MainPage = () => {
  let href = window.location.href.split("/")[3];
  const [SearchText, setSearchText] = useState("");  
  if(href = "detail"){
    return (
      <>
        <Header setSearchText={setSearchText}/>
        
        <Detail/>
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
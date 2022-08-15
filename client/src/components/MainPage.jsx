import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import List from './List';

const MainPage = () => {
  const [SearchText, setSearchText] = useState("");
  return (
    <>
      <Header setSearchText={setSearchText}/>
      <List SearchText={SearchText}/>
    </>
  )
}

export default MainPage
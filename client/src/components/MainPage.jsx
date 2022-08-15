import React, { useState } from 'react';
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
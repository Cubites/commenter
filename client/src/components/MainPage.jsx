import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import List from './List';

const MainPage = () => {
  const [SearchText, setSearchText] = useState("");
  const [Books, setBooks] = useState({});
  useEffect(() => {
    if(SearchText != ""){
      axios.get(`/search/book?name=${SearchText}`)
        .then(res => {
          let booksCopy = Books;
          let booksData = res.data.data;
          setBooks({...booksCopy, booksData});
          console.log(res.data.data);
        })
        .catch(err => console.log("err : " + err));
    }
  }, [SearchText]);
  return (
    <>
      <Header setSearchText={setSearchText}/>
      <List SearchText={Books}/>
    </>
  )
}

export default MainPage
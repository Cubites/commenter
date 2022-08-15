import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding-left: 15%;
  padding-right: 15%;
  height: 500px;
`
const Bookblock = styled.img`
  width: 15%;
  margin: 2%;
`

const List = ({SearchText}) => {
  const [Books, setBooks] = useState([]);
  useEffect(() => {
    if(SearchText !== ""){
      axios.get(`/search/book?name=${SearchText}`)
        .then(res => {
          let booksCopy = [];
          let booksData = res.data.data;
          setBooks(...booksCopy, booksData);
          console.log(res.data.data);
        })
        .catch(err => console.log("err : " + err));
    }
  }, [SearchText]);
  if(Books !== {}){
    console.log();  
  }
  return (
    <Container>
      {
        Books === {} ? "" : Books.map((data, i) => <Bookblock key={"book_" + i} src={data.image}/>)
      }
    </Container>
  )
}

export default List
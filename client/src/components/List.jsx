import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
const Container = styled.div`
  text-align: center;
  height: 500px;
`
const Bookblock = styled.img`
  width: 5vw;
  min-width: 180px;
  margin: 2%;
`

const List = ({SearchText}) => {
  const [Books, setBooks] = useState([]);
  useEffect(() => {    
    if(SearchText != ""){
      axios.post(`/book/search`, {search: SearchText, sort: 0})
        .then(res => {
          setBooks(res.data.data);
        })
        .catch(err => console.log("err : " + err));
    }
  }, [SearchText]);  
  return (
    <Container>
      {
        Books === {} ? "" : Books.map((data, i) => <Bookblock key={"book_" + i} src={data.image} href = "/book/1"/>)
      }
    </Container>
  )
}

export default List
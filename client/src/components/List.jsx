import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
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
    if(SearchText != ""){
      axios.get(`/book/search?name=${SearchText}`)
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
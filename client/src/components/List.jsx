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
    axios.post('/book/seach', {
      search: "",
      sort: 0,
      item_size: 10,
      page_num: 1
    })
      .then(res => {
        console.log(res);
        let booksCopy = [];
        let booksData = res.data.data;
        setBooks(...booksCopy, booksData);
        console.log(res.data.data);
      })
      .catch(err => console.log("err : " + err));
    }, [SearchText]);
  if(Books.length !== 0){
    console.log(Books);  
  }
  return (
    <Container>
      {
        Books === {} ? "" : Books.map((data, i) => <Bookblock key={"book_" + i} src={data.image_url}/>)
      }
    </Container>
  )
}

export default List
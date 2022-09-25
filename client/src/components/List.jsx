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
  console.log("조회 시작");
  useEffect(() => {    
    if(SearchText != ""){
      console.log(SearchText);
      axios.post(`/book/search`,
      {
        search: SearchText,
        sort: 0,
        item_size:30,
        page_num:1,
        user_id:""
      })
        .then(res => {
          console.log(res.data);
          setBooks(res.data);
        })
        .catch(err => console.log("err : " + err));
    }
  }, [SearchText]);  
  return (
    <Container>
      {
        Books === {} ? "" : Books.map((data, i) => <a href ={"/detail?oid=" +  data.isbn}><Bookblock key={"book_" + i} src={data.image_url}/></a>)
      }
    </Container>
  )
}

export default List
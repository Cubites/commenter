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

const Detail = ({SearchText}) => {
  let data;
  const [Books, setBooks] = useState([]);
  useEffect(() => {    
    if(SearchText != ""){
      axios.get(`/book/info?id=1`)
        .then(res => {
          data = res.data;
          console.log(data);
        })
        .catch(err => console.log("err : " + err));
    }
  }, [SearchText]);  
  return (
    <Container>

    </Container>
  )
}

export default Detail
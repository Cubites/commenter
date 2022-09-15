import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
const Container = styled.div`
  padding-left: 15%;
  padding-right: 15%;
  height: 500px;
`

const BookInfo = styled.div`
  width: 25vw;
  height: 100vh;  
  border:1px solid pink;
  flex:1;
`
const BookImage = styled.img`
  width: 20vw;
  height: 60vh;  
  border:1px solid blue;
`

const BookTitle = styled.div`
  width: 40vw;
  height: 10vh;
  border:1px solid red;
`
const CommentDiv = styled.div`
  width: 40vw;
  height: 90vh;
  border:1px solid black;
`

const Detail = () => {
  const [detail, setDetail] = useState();
  const [comment, setComment] = useState();
  useEffect(() => {
    let oid = new URLSearchParams(window.location.search).get("oid");
    console.log(oid);
    console.log("조회 시작");
    axios.post(`/book/info`,
      {
        isbn: oid
      })
      .then(res => {
        console.log(res.data);
        setDetail(res.data);
      })
      .catch(err => console.log("err : " + err));

    axios.post(`/comment/info`,
      {
        isbn: oid,
        sort: "0",
        item_size:10,
        page_num:1
      })
      .then(res => {
        console.log(res.data);
        setComment(res.data);
      })
      .catch(err => console.log("err : " + err));


  }, []);
  return (
    <Container>
      <div style={{display: "flex"}}>
        <BookInfo>
          <BookImage>

          </BookImage>
        </BookInfo>
        <div style={{flex: "2"}}>
          <BookTitle>

          </BookTitle>
          <CommentDiv>

          </CommentDiv>
        </div>
      </div>
    </Container>
  )
}

export default Detail
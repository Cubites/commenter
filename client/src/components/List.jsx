import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding-left: 15%;
  padding-right: 15%;
  height: 500px;
`
const Bookblock = styled.img`
  width: 15%;
  margin: 2%;
`

const List = ({SearchText, Books}) => {
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
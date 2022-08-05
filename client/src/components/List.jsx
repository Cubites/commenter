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

const List = ({Books}) => {
  console.log(typeof(Books));
  console.log(Books);
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
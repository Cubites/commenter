import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding-left: 15%;
  padding-right: 15%;
  height: 500px;
  text-align: center;
`
const Bookblock = styled.img`
  width: 200px;
  margin: 2%;
`

const List = ({Books}) => {
  return (
    <Container>
      {
        Books === {} ? "" : Books.map((data, i) => <Bookblock key={"book_" + i} src={data.image_url}/>)
      }
    </Container>
  )
}

export default List
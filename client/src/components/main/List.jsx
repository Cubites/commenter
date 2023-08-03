import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const List = ({Books, SortColor, setSortColor, setBookData}) => {
  const navigate = useNavigate();

  const MoveBookPage = (e, data) => {
    e.preventDefault();
    setBookData(data);
    navigate('/book');
  }

  return (
    <Container>
      <Sortblock>
        <SortElement style={{color: SortColor ? 'black' : '#46B50A'}}>최신순</SortElement>
        <SortElement style={{color: SortColor ? '#46B50A' : 'black'}}>추천순</SortElement>
      </Sortblock>
      <BookList>
        {
          Books === {} ? "" : Books.map((data, i) => 
          <Bookblock 
            key={"book_" + i} 
            style={{backgroundImage: `url("${data.image_url}")`}}
          >
            <BookInfobox onClick={(e) => MoveBookPage(e, data)}>
              <BookName>
                {
                  data.book_title.length > 40 
                  ? data.book_title.slice(0, 40) + '...' 
                  : data.book_title
                }
              </BookName>
              <BookAuthor>
                {
                  data.author.split('^').length > 1
                  ? `${data.author.split('^')[0]} 외 ${data.author.split('^').length - 1}명`
                  : data.author
                }
              </BookAuthor>
              <BookPrice>
                {data.discount.toLocaleString()+"원"}
              </BookPrice>
            </BookInfobox>
          </Bookblock>
          )
        }
      </BookList>
    </Container>
  )
}

const Container = styled.div`
  padding-left: 15%;
  padding-right: 15%;
  height: 500px;
  min-width: 700px;
  text-align: center;
`
const Sortblock = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
  min-height: 40px;
  justify-content: end;
  align-items: center;
`
const SortElement = styled.div`
  width: 50px;
  margin: 10px;
  font-size: 1em;
  font-weight: bold;
`
const BookList = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-wrap: wrap;
`
const Bookblock = styled.div`
  width: 200px;
  height: 300px;
  margin: 2%;
  background-repeat: no-repeat;
  background-size: cover;
`
const BookInfobox = styled.div`
  width: 100%;
  height: 100%;
  padding: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #000;
  text-align: center;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  &:hover{
    opacity: 0.7;
  }
`
const BookName = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden; */
`
const BookAuthor = styled.div`
  width: 100%;
  height: 20%;
`
const BookPrice = styled.div`
  width: 100%;
  height: 20%;
`

export default List
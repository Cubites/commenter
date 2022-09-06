import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import List from './List';

const HomePage = styled.div`
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  background-image: url("/images/main.png");
  background-repeat: no-repeat;
  background-size: cover; 
  background-origin: content-box;
  background-position-y: calc(30vh - 30vw);
  height: 800px;
  width: 100%;
  position: relative;
  height: 80vh;
`;
const MainTop = styled.div`
  position: relative;
  width: 100%;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1vw;
`;
const Logo = styled.img`
  display: block;
  width: 10vw;
  min-width: 150px;
`;
const LoginButton = styled.button`
  width: 100px;
  height: 40px;
  display: block;
  background-color: #44B606;
  opacity: 0.7;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  &:hover{
    opacity: 1;
  }
`;
const SearchBox = styled.form`
  display: flex;
  position: relative;
  top: 45vh;
  width: 50vw;
  min-width: 300px;
  height: 5vh;
  margin-left: auto;
  margin-right: auto;
  border-radius: 25px;
  overflow: hidden;
`;
const SearchIcon = styled.img`
  display: block;
  margin: 1vh;
  position: absolute;
  left: 0;
`;
const SearchInput = styled.input`
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  font-size: 1rem;
  padding-left: 50px;
  outline: none;
  opacity: 0.5;
  &:hover,
  &:focus{
    opacity: 0.7;
  }
`;
const SearchButton = styled.button`
  height: 5vh;
  width: 15vw;
  min-width: 100px;
  background-color: #44B606;
  text-align: center;
  border: none;
  border-radius: 25px;
  display: inline-block;
  position: absolute;
  right: 0;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  opacity: 0.5;
`;
const DownBtn = styled.button`
  width: 3vw;
  height: 3vw;
  min-width: 40px;
  min-height: 40px;
  background-color: #6AB97D;
  border-radius: 50%;
  border: none;
  text-align: center;
  padding-top: 10px;
  position: relative;
  top: 55vh;
  left: calc(50% - 25px);
`;
const DownBtnIcon = styled.img`
  width: 1.5vw;
  min-width: 20px;
`;

const Home = () => {
  const [SearchText, setSearchText] = useState("");
  const [Books, setBooks] = useState([]);
  const navigate = useNavigate();

  const MoveMainPage = (e) => {
    e.preventDefault();
    navigate('/search');
  }

  const textHandler = (e) => {
    e.preventDefault();
    setSearchText(e.currentTarget.value);
  }

  const SubmitHandler = (e) => {
    e.preventDefault();
    axios.post('/book/search', {
      search: SearchText,
      sort: 0,
      item_size: 10,
      page_num: 1
    })
      .then(data => console.log(data.data))
      .catch(err => console.log("err : " + err));
  }

  // useEffect(() => {
  //   axios.post('/book/search', {
  //     search: SearchText,
  //     sort: 0,
  //     item_size: 10,
  //     page_num: 1
  //   })
  //     .then(data => setBooks(data.data))
  //     .catch(err => console.log("err : " + err));
  // }, []);

  return (
    <HomePage>
      <Main>  
        <MainTop>
          <Logo src="/images/logo_color.png" alt="logo"/>
          <LoginButton onClick={MoveMainPage}>메인 페이지</LoginButton>
        </MainTop>
        <SearchBox onSubmit={SubmitHandler}>
          <SearchIcon src="/images/search_icon.png" alt="search_icon" />
          <SearchInput type="text" value={SearchText} onChange={textHandler} placeholder="검색어를 입력해주세요."/>
          <SearchButton type="submit">검색</SearchButton>
        </SearchBox>
        <DownBtn><DownBtnIcon src="/images/down_btn.png"/></DownBtn>
      </Main>
      <List Books={Books}/>
    </HomePage>
  )
}

export default Home
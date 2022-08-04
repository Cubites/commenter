import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Main = styled.div`
  background-image: url("/images/main.png");
  background-repeat: no-repeat;
  background-size: cover; 
  background-origin: content-box;
  background-position-y: -350px;
  height: 800px;
`;
const Logo = styled.img`
  display: block;
  position: absolute;
  left: 20px;
  top: 20px;
  width: 200px;
`;
const SearchBox = styled.div`
  position: relative;
  top: 500px;
  width: 700px;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 25px;
  overflow: hidden;
`;
const SearchIcon = styled.img`
  display: block;
  margin: 10px;
  position: absolute;
  left: 0;
`;
const SearchInput = styled.input`
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  font-size: 20px;
  padding-left: 50px;
  outline: none;
  opacity: 0.5;
  &:hover,
  &:focus{
    opacity: 0.7;
  }
`;
const SearchButton = styled.button`
  height: 50px;
  width: 200px;
  background-color: #44B606;
  opacity: 0.8;
  text-align: center;
  border-radius: 25px;
  display: inline-block;
  position: absolute;
  right: 0;
  font-size: 20px;
  font-weight: bold;
  opacity: 0.5;
`;
const LoginButton = styled.button`
  width: 80px;
  height: 40px;
  display: block;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const Home = () => {
  const [SearchText, setSearchText] = useState("");
  axios.get('/home')
    .then(rs => console.log(rs));
  return (
    <Main>
      <Logo src="/images/logo.png" alt="logo"/>
      <LoginButton>로그인</LoginButton>
      <SearchBox style={{display: "flex"}}>
        <SearchIcon src="/images/search_icon.png" alt="search_icon" />
        <SearchInput type="text" value={SearchText} onChange={setSearchText} placeholder="검색어를 입력해주세요."/>
        <SearchButton>검색</SearchButton>
      </SearchBox>
    </Main>
  )
}

export default Home
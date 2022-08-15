import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
const SearchBox = styled.form`
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
const LoginButton = styled.button`
  width: 100px;
  height: 40px;
  display: block;
  position: absolute;
  top: 20px;
  right: 20px;
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

const Home = () => {
  console.log("Home");
  const [SearchText, setSearchText] = useState("");
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
    axios.get(`/search/book?name=${SearchText}`)
      .then(res => console.log(res))
      .catch(err => console.log("err : " + err));
  }

  return (
    <Main>
      <Logo src="/images/logo_color.png" alt="logo"/>
      <LoginButton onClick={MoveMainPage}>메인 페이지</LoginButton>
      <SearchBox style={{display: "flex"}} onSubmit={SubmitHandler}>
        <SearchIcon src="/images/search_icon.png" alt="search_icon" />
        <SearchInput type="text" value={SearchText} onChange={textHandler} placeholder="검색어를 입력해주세요."/>
        <SearchButton type="submit">검색</SearchButton>
      </SearchBox>
    </Main>
  )
}

export default Home
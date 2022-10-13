import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import List from './List';
import Header from './Header';

const Home = ({UpAnimation, setUpAnimation}) => {
  const [SearchText, setSearchText] = useState("");
  const [InputText, setInputText] = useState("")
  const [Books, setBooks] = useState([]);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_NODE_ENV === 'production' ? `http://${process.env.REACT_APP_DNS_NAME}:4000/book/search` : '/book/search';
  console.log(url);

  const MoveMainPage = (e) => {
    e.preventDefault();
    navigate('/search');
  }

  const InputTextHandler = (e) => {
    e.preventDefault();
    setInputText(e.currentTarget.value);
  }

  const SubmitHandler = () => {
    axios.post(url, {
      search: SearchText,
      sort: 0,
      item_size: 10,
      page_num: 1
    })
      .then(data => console.log(data.data))
      .catch(err => console.log("err : " + err));
  }

  useEffect(() => {
    axios.post(url, {
      search: SearchText,
      sort: 0,
      item_size: 10,
      page_num: 1
    })
      .then(data => setBooks(data.data))
      .catch(err => console.log("err : " + err));
  }, []);

  return (
    <>
      <HomePage className={UpAnimation ? 'listUp' : ''}>
        <Main>  
          <MainTop>
            <Logo src="/images/logo_color.png" alt="logo"/>
            <LoginButton onClick={MoveMainPage}>메인 페이지</LoginButton>
          </MainTop>
          <SearchBox onSubmit={SubmitHandler}>
            <SearchIcon src="/images/search_icon.png" alt="search_icon" />
            <SearchInput type="text" value={InputText} onChange={InputTextHandler} placeholder="검색어를 입력해주세요."/>
            <SearchButton type="submit">검색</SearchButton>
          </SearchBox>
          <DownBtn onClick={() => setUpAnimation(true)}><DownBtnIcon src="/images/down_btn.png"/></DownBtn>
        </Main>
        <Header UpAnimation={UpAnimation} />
        <List Books={Books} />
        {/* <Routes>
          <Route index path="search" element={<List Books={Books} />} />
          <Route path="login" element={<div></div>} />
        </Routes> */}
      </HomePage>
    </>
  )
}

const HomePage = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  position: relative;
`;

const Main = styled.div`
  background-image: url("/images/main.png");
  background-repeat: no-repeat;
  background-size: cover; 
  background-origin: content-box;
  /* background-position-y: calc(30vh - 30vw); */
  background-position-y: -250px;
  background-position-x: center;
  height: 800px;
  width: 100%;
  position: relative;
  height: 80vh;
  @media screen and (max-width: 1400px){
    background-position-y: 0;
  }
`;
const MainTop = styled.div`
  position: relative;
  width: 100%;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1vw;
  @media screen and (max-width: 800px){
    padding: 2vw;
  }
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
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 25px;
  overflow: hidden;
  background-color: white;
  @media screen and (max-width: 900px){
    height: 35px
  }
`;
const SearchIcon = styled.img`
  display: block;
  margin-left: 10px;
  background-color: transparent;
  left: 0;
  height: 60%;
  align-self: center;
`;
const SearchInput = styled.input`
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  font-size: 1rem;
  padding-left: 20px;
  outline: none;
  &:hover,
  &:focus{
    opacity: 0.7;
  }
`;
const SearchButton = styled.button`
  height: 100%;
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

export default Home
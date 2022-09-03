import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import List from './List';
import '../css/home.css'

const Main = styled.div`
  background-image: url("/images/main.png");
  background-repeat: no-repeat;
  background-size: cover; 
  background-origin: content-box;
  background-position: center;
  // background-position-y: -20%;
  height: 90vh;
  min-height: 500px;
`;
const Logo = styled.img`
  position: absolute;
  left: 32px;
  top: 32px;
  width: 15vw;
  min-width: 200px;
`;
const SearchBox = styled.form`
  position: relative;
  top: 65vh;
  max-width: 700px;
  min-width: 450px;
  width: 70vw;
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
  font-size: 110%;
  padding-left: 50px;
  color: #000000;
  outline: none;
  opacity: 0.5;
  &:hover,
  &:focus{
    opacity: 0.7;
  }
`;
const SearchButton = styled.button`
  height: 50px;
  width: 30%;
  background-color: #44B606;
  opacity: 0.8;
  text-align: center;
  border: none;
  border-radius: 25px;
  display: inline-block;
  position: absolute;
  right: 0;
  color: #fff;
  font-size: 120%;
  font-weight: bold;
  opacity: 0.5;
`;
const LoginButton = styled.button`
  width: 8vw;
  min-width: 100px;
  height: 5vh;
  min-height: 50px;
  display: block;
  position: absolute;
  top: 32px;
  right: 32px;
  background-color: #44B606;
  opacity: 0.7;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  font-size : 100%;
  &:hover{
    opacity: 1;
  }
`;
const MainContext = styled.div`
  position: relative;
  margin-top: 16px;
  min-height: 1200px;
  flex:1;
`;

const ScrollButton = styled.button`
  background-image: url("/images/main_scroller.png");  
  background-color: transparent;
  border:0px;
  background-size: cover; 
  background-position: center;
  position: relative;
  top: 70vh;
  min-height : 50px;
  min-width: 50px;
  max-height : 150px;
  max-width: 150px;
  width: 8vh;
  height: 8vh;
  margin-left:auto;
  margin-right:auto;
`;

const animteScrollTo = function(_selector, _duration, _adjust) {
  const targetEle = document.querySelector(_selector);
  if (!targetEle) return;

  // - Get current & target positions
  const scrollEle = document.documentElement || window.scrollingElement,
  currentY = scrollEle.scrollTop,
  targetY = targetEle.offsetTop - (_adjust || 0);
  animateScrollTo(currentY, targetY, _duration);

  // - Animate and scroll to target position
  function animateScrollTo(_startY, _endY, _duration) {
    _duration = _duration ? _duration : 600;
    const unitY = (targetY - currentY) / _duration;
    const startTime = new Date().getTime();
    const endTime = new Date().getTime() + _duration;

    const scrollTo = function() {
      let now = new Date().getTime();
      let passed = now - startTime;
      if (now <= endTime) {
        scrollEle.scrollTop = currentY + (unitY * passed);
        requestAnimationFrame(scrollTo);
      }
      else {
        console.log('End off.')
      }
    };
    requestAnimationFrame(scrollTo);
  };
};


const Home = ({ IsLogin }) => {
  console.log("Home");
  const [SearchText, setSearchText] = useState("");
  const [AddClassName, setAddClassName] = useState("");
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
    axios.get(`/book/search?name=${SearchText}`)
      .then(res => console.log(res))
      .catch(err => console.log("err : " + err));
  }

  const ScrollerHandler = (e) => {
    e.preventDefault(); 
    setAddClassName('up');
    // document.getElementById("main_top").
    // animteScrollTo('#main');  
  }

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [])

  return (
    <div className={AddClassName}>
      <Main id="main_top">
        <Logo className={AddClassName} src="/images/logo_color.png" alt="logo"/>
        <LoginButton className={AddClassName} onClick={MoveMainPage}>Login</LoginButton >
        <SearchBox style={{display: "flex"}} onSubmit={SubmitHandler}>
          <SearchIcon src="/images/search_icon.png" alt="search_icon" />
          <SearchInput type="text" value={SearchText} onChange={textHandler} placeholder="검색어를 입력해주세요."/>
          <SearchButton type="submit">검색</SearchButton>          
        </SearchBox>  
        <ScrollButton style={{display: "flex"}} onClick={(ScrollerHandler)} id="scrollButton" />
      </Main>
      <MainContext id="main">
            <List SearchText={"초급"}/>
      </MainContext>    
    </div>
  )
}

export default Home
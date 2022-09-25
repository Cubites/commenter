import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const HeaderbarLine = styled.div`
  width: 100%;
  height: 64px;
  background-color: #44B606;
`

const Headerbar = styled.div`
  width: 1152px;
  height: 64px;  
  margin:auto;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width : 1152px){
    width:100%;
    margin:0px;    
    min-width: 500px;
  }
`;
const Logo = styled.div`
  display: block;
  background-image: url("/images/logo_white.png");
  background-size: cover; 
  background-position: center;
  background-color: transparent;
  width: 200px;
  height: 50px;
  margin-left: 16px;
  margin-right: 16px;
  @media screen and (max-width : 1152px){
    background-image: url("/images/logo_white_mini.png");
    max-width: 50px;
  }
`;
const Searchbar = styled.form`
  width: 500px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
`;
const SearchInput = styled.input`
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  font-size: 20px;
  padding-left: 30px;
  outline: none;
  opacity: 0.5;
  &:hover,
  &:focus{
    opacity: 0.7;
  }
`;
const SearchButton = styled.button`
  width: 120px;
  height: 60px;
  border: none;
  border-radius: 30px;
  background-color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.8;
  text-align: center;
  cursor: pointer;
`;
const LoginButton = styled.img`
  cursor: pointer;  
  margin-left: 16px;
  margin-right: 16px;
`;
const LoginSuccess = styled.button`


`;

const Header = ({setSearchText , IsLogin, IsLoginHandler }) => {
  const [SearchWord, setSearchWord] = useState("");
  
  const navigate = useNavigate();
  const SearchWordHandler = (e) => {
    e.preventDefault();
    setSearchWord(e.currentTarget.value);
  }
  const SubmitHandler = (e) => {
    e.preventDefault();
    console.log("submit"+SearchWord);
    setSearchText(SearchWord);
  }
  console.log("Token: " + Cookies.get('login_token'));



  const MoveLoginPage = (e) => {
    e.preventDefault();
    navigate('/login');
  }

  const UserLogout = (e) => {
    e.preventDefault();
    Cookies.remove("login_token");
    Cookies.remove("user_nick");
    IsLoginHandler(Cookies.get('login_token'));
    navigate('/');
  }

  let loginCookie = Cookies.get('login_token');
  let user_nick = Cookies.get('user_nick');
  
  return (
    <HeaderbarLine>
    <Headerbar>
      <Logo/>
      <Searchbar onSubmit={SubmitHandler}>
        <SearchInput value={SearchWord} onChange={SearchWordHandler}/>
        <SearchButton type="submit"><img src="images/search_icon.png"/></SearchButton>
      </Searchbar>
      {
        IsLogin ?
        <LoginSuccess onClick={UserLogout}>로그아웃</LoginSuccess> :
        <LoginButton onClick={MoveLoginPage} src="images/login_img.png"/>
      }
    </Headerbar>
    </HeaderbarLine>
  )
}

export default Header
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Header = ({setUpAnimation, SubmitHandler}) => {
  const [SearchWord, setSearchWord] = useState("");

  const navigate = useNavigate();

  const MoveMainPage = (e) => {
    e.preventDefault();
    setUpAnimation(false);
    navigate("/");
  }

  const MoveLoginPage = (e) => {
    e.preventDefault();
    navigate('/login');
  }

  const SearchWordHandler = (e) => {
    e.preventDefault();
    setSearchWord(e.currentTarget.value);
  }
  const SearchHandlerInHeader = (e) => {
    e.preventDefault();
    SubmitHandler(SearchWord);
  }
  return (
    <Headerbar>
      <Logo src="images/logo_white.png" onClick={MoveMainPage}/>
      <Searchbar onSubmit={SearchHandlerInHeader}>
        <SearchInput value={SearchWord} onChange={SearchWordHandler}/>
        <SearchButton type="submit"><SearchButtonIcon src="images/search_icon.png"/></SearchButton>
      </Searchbar>
      <LoginButton src="images/login_img.png" onClick={MoveLoginPage}/>
    </Headerbar>
  )
}

const Headerbar = styled.div`
  width: 100%;
  min-height: 80px;
  background-color: #44B606;
  box-sizing: border-box;
  padding-left: 15%;
  padding-right: 15%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 900px) {
    padding-left: 5%;
    padding-right: 5%;
    height: 10vw;
  }
`;
const Logo = styled.img`
  display: block;
  height: 50px;
  cursor: pointer;
  @media screen and (max-width: 900px) {
    height: 4vw;
  }
`;
const Searchbar = styled.form`
  width: 500px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  margin-left: 30px;
  margin-right: 30px;
  @media screen and (max-width: 900px) {
    height: 5vw;
    margin-left: 50px;
    margin-right: 50px;
  }
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
  height: 100%;
  border: none;
  border-radius: 30px;
  background-color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.8;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
  &:active{
    opacity: 0.6;
  }
  @media screen and (max-width: 900px) {
    width: 15vw;
  }
`;
const SearchButtonIcon = styled.img`
  @media screen and (max-width: 900px) {
    width: 4vw;
  }
`;
const LoginButton = styled.img`
  cursor: pointer;
  &:hover{
    opacity: 0.9;
  }
  &:active{
    opacity: 0.8;
  }
  @media screen and (max-width: 900px) {
    height: 5vw;
  }
`;

export default Header
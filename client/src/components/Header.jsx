import React, { useState } from 'react';
import styled from 'styled-components';

const Headerbar = styled.div`
  width: 100%;
  height: 80px;
  background-color: #44B606;
  box-sizing: border-box;
  padding-left: 15%;
  padding-right: 15%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Logo = styled.img`
  display: block;
  height: 50px;
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
`;

const Header = ({setSearchText}) => {
  const [SearchWord, setSearchWord] = useState("");
  const SearchWordHandler = (e) => {
    e.preventDefault();
    setSearchWord(e.currentTarget.value);
  }
  const SubmitHandler = (e) => {
    e.preventDefault();
    setSearchText(SearchWord);
  }
  return (
    <Headerbar>
      <Logo src="images/logo_white.png"/>
      <Searchbar onSubmit={SubmitHandler}>
        <SearchInput value={SearchWord} onChange={SearchWordHandler}/>
        <SearchButton type="submit"><img src="images/search_icon.png"/></SearchButton>
      </Searchbar>
      <LoginButton src="images/login_img.png"/>
    </Headerbar>
  )
}

export default Header
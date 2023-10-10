// import { useState } from 'react';
import styled from 'styled-components';

import Header from './Header';

const Login = () => {
  return (
    <LoginPageContainer>
      <Header />
      <LoginPageMain>
        <Title>로그인</Title>
        <LoginPageLogo src="images/logo_loginpage.png" />
        <LoginPageMessage>
          모든 리뷰가 모여 있는 곳<br />지금 바로 시작하기
        </LoginPageMessage>
        <LoginNaver src="images/login_naver.png" />
        <LoginKakao src="images/login_kakao.png" />
      </LoginPageMain>
    </LoginPageContainer>
  )
}

const LoginPageContainer = styled.div`
  width: 100%;
  height: 986px;
  display: flex;
  flex-direction: column;  
`;
const LoginPageMain = styled.div`
  margin-top: 50px;
  margin-left: 15%;
  margin-right: 15%;
  min-width: 700px;
  height: 906px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 900px) {
    margin: 0;
    width: 100%;
  }
`;
const Title = styled.div`
  width: 100%;
  font-size: 2.5em;
  font-weight: bold;
  text-align: center;
  color: #46B50A;
  border-bottom: 1px solid #44B606;
  padding-bottom: 10px;
`;
const LoginPageLogo = styled.img`
  margin: 30px 0;
`;
const LoginPageMessage = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 2em;
  color: #00BF19;
  margin: 30px;
`;
const LoginNaver = styled.img`
  margin: 20px;
  cursor: pointer;
  &:hover{
    opacity: 0.6;
  }
  &:active{
    opacity: 0.3;
  }
`;
const LoginKakao = styled.img`
  margin: 20px;
  cursor: pointer;
  &:hover{
    opacity: 0.6;
  }
  &:active{
    opacity: 0.3;
  }
`


export default Login
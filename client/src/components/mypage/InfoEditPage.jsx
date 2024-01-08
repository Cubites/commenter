// import { useState } from 'react';
import styled from 'styled-components';

const InfoEditPage = () => {
  return (
    <InfoEditPageContainer>
      <Title>개인정보 수정</Title>
      <NameEditbox>
        <ItemsTitle>닉네임 변경</ItemsTitle>
        <NameEdit />
      </NameEditbox>
      <SubmitButton>수정</SubmitButton>
    </InfoEditPageContainer>
  )
}

const InfoEditPageContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.div`
  width: 100%;
  height: 80px;
  font-size: 2.5em;
  color: #46B50A;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid #333;
  margin-bottom: 20px;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
`;
const NameEditbox = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const ItemsTitle = styled.div`
  width: 150px;
  font-size: 1.1em;
  height: 54px;
  line-height: 54px;
  text-align: center;
  font-weight: bold;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
`;
const NameEdit = styled.input`
  width: 70%;
  height: 54px;
  border: 3px solid #00BF19;
  padding-left: 15px;
  font-size: 1.2em;
`;
const SubmitButton = styled.div`
  width: 200px;
  height: 50px;
  line-height: 50px;
  border-radius: 30px;
  background-color: #44B606;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  cursor: pointer;
  &:hover{
    background-color: #44b606df;
  }
  &:active{
    background-color: #44b606be;
  }
`

export default InfoEditPage
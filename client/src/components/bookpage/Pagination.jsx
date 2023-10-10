import { useState } from 'react';
import styled from 'styled-components';

const Pagination = ({ PageNum, setPageNum }) => {
  return (
    <MainContainer>
      <FirstButton>&laquo;</FirstButton>
      <PassButton>&lt;</PassButton>
      <NumberButton>1</NumberButton>
      <NumberButton>2</NumberButton>
      <NumberButton>3</NumberButton>
      <NumberButton>4</NumberButton>
      <NumberButton>5</NumberButton>
      <NumberButton>6</NumberButton>
      <NumberButton>7</NumberButton>
      <NumberButton>8</NumberButton>
      <NumberButton>9</NumberButton>
      <NumberButton>10</NumberButton>
      <PassButton>&gt;</PassButton>
      <EndButton>&raquo;</EndButton>
    </MainContainer>
  )
}

const MainContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
`;
const FirstButton = styled.div`
  width: 5%;
  height: 40px;
  display: flex;
  justify-content: center;
  border-radius: 10px 0 0 10px;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 1.5em;
  line-height: 30px;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  cursor: pointer;
  border-right: 2px solid #349844;
  &:hover{
    background-color: #349844;
    color: #fff;
  };
  &:active{
    background-color: #2b7e39;
    color: #fff;
  }
`;
const PassButton = styled.div`
  width: 5%;
  height: 40px;
  display: flex;
  justify-content: center;
  line-height: 32px;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 1.3em;
`;
const NumberButton = styled.div`
  width: 5%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 2px 2px 2px 0;
  margin-bottom: 40px;
  font-weight: bold;
  &:last-of-type{    
    border-width: 0px;
  }
`;
const EndButton = styled.div`
  width: 5%;
  height: 40px;
  display: flex;
  justify-content: center;
  border-radius: 0 10px 10px 0;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 1.5em;
  line-height: 30px;
`;

export default Pagination
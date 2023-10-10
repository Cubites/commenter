// import { useState } from 'react';
import styled from 'styled-components';

const QnaPage = () => {
  return (
    <QnaPageContainer>
      <Title>문의하기</Title>
      <QnaReasonbox>
        <ItemsTitle>문의 사유</ItemsTitle>
        <QnaReasonList>
          <QnaReasonItem>도서 추가 요청</QnaReasonItem>
          <QnaReasonItem>문의 사항</QnaReasonItem>
          <QnaReasonItem>버그 리포트</QnaReasonItem>
        </QnaReasonList>
      </QnaReasonbox>
      <QnaTextbox>
        <ItemsTitle>문의 내용</ItemsTitle>
        <QnaText />
        <SubmitButton>제출하기</SubmitButton>
      </QnaTextbox>
    </QnaPageContainer>
  )
}

const QnaPageContainer = styled.div`
  width: 70%;
  height: 100%;
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
`;
const QnaReasonbox = styled.div`
  width: 100%;
  height: 100px;
  margin: 30px 0;
`;
const ItemsTitle = styled.div`
  width: 100%;
  text-align: left;
  font-size: 1.5em;
  font-weight: bold;
  padding: 10px;
`;
const QnaReasonList = styled.div`
  width: 100%;
  height: 75px;
  padding: 15px;
  border: 3px solid #00BF19;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
const QnaReasonItem = styled.div`
  width: 25%;
  height: 45px;
  border-radius: 22.5px;
  background-color: #44B606;
  color: #fff;
  line-height: 45px;
  text-align: center;
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
`;
const QnaTextbox = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 35px 0;
`;
const QnaText = styled.input`
  width: 100%;
  height: 300px;
  border: 3px solid #00BF19;
  margin: 20px 0;
`;
const SubmitButton = styled.div`
  width: 200px;
  height: 60px;
  border-radius: 30px;
  background-color: #44B606;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  line-height: 60px;
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

export default QnaPage
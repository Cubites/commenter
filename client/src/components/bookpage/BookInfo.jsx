import { useState } from 'react';
import styled from 'styled-components';

import Header from './Header';

const BookInfo = ({BookData}) => {
  const [SortColor, setSortColor] = useState(false);
  console.log(BookData);
  return (
    <BookInfoPage>
      <Header />
      <BookInfoBlock>
        <BookPart>
          <BookImg src={`${BookData.image_url}`} />
          <BookInfoPart>
            <BookAuthor>
              {
                BookData.author.split('^').length > 1
                ? `${BookData.author.split('^')[0]} 외 ${BookData.author.split('^').length - 1}명`
                : BookData.author
              }
            </BookAuthor>
            <BookPublish>
              {`${BookData.publication.split('-')[0]}년 ${BookData.publication.split('-')[1]}월 ${BookData.publication.split('-')[2]}일`}
            </BookPublish>
            <BookPrice>
              {BookData.discount.toLocaleString() + "원"}
            </BookPrice>
          </BookInfoPart>
          <BookTag>#언어 #기초</BookTag>
          <BookPurchase src="images/purchase.png"/>
        </BookPart>
        <CommentPart>
          <BookName>
            {BookData.book_title}
          </BookName>
          <SortBox>
            <SortElement 
              style={{color: SortColor ? 'black' : '#46B50A'}}
              onClick={() => setSortColor(!SortColor)}
            >
              최신순
            </SortElement>
            <SortElement 
              style={{color: SortColor ? '#46B50A' : 'black'}}
              onClick={() => setSortColor(!SortColor)}
            >
              추천순
            </SortElement>
          </SortBox>
          <CommentInputBox>
            <CommentInput></CommentInput>
            <CommentButton src="images/comment.png" />
          </CommentInputBox>
          <CommentsBox>
            <CommentCloudBox>
              <CommentCloud>
                <CommentCloudTop>commenter</CommentCloudTop>
                <CommentCloudMiddle>테스트용<br/>코멘트입니다.</CommentCloudMiddle>
                <CommentCloudBottom>
                  <CommentDate>2023.05.24</CommentDate>
                  <CommentLikeImg src="images/like.png" />
                  <CommentLike>5</CommentLike>
                  <CommentReport>신고</CommentReport>
                </CommentCloudBottom>
              </CommentCloud>
            </CommentCloudBox>
            <CommentCloudBox>
              <CommentCloud>
                <CommentCloudTop>commenter</CommentCloudTop>
                <CommentCloudMiddle>테스트용<br/>코멘트입니다.</CommentCloudMiddle>
                <CommentCloudBottom>
                  <CommentDate>2023.05.24</CommentDate>
                  <CommentLikeImg src="images/like.png" />
                  <CommentLike>5</CommentLike>
                  <CommentReport>신고</CommentReport>
                </CommentCloudBottom>
              </CommentCloud>
            </CommentCloudBox>
            <CommentCloudBox>
              <CommentCloud>
                <CommentCloudTop>commenter</CommentCloudTop>
                <CommentCloudMiddle>테스트용<br/>코멘트입니다.</CommentCloudMiddle>
                <CommentCloudBottom>
                  <CommentDate>2023.05.24</CommentDate>
                  <CommentLikeImg src="images/like.png" />
                  <CommentLike>5</CommentLike>
                  <CommentReport>신고</CommentReport>
                </CommentCloudBottom>
              </CommentCloud>
            </CommentCloudBox>
          </CommentsBox>
        </CommentPart>
      </BookInfoBlock>
    </BookInfoPage>
  )
}

const BookInfoPage = styled.div`
  width: 100%;
  height: 986px;
  display: flex;
  flex-direction: column;
`;
const BookInfoBlock = styled.div`
  margin-top: 50px;
  margin-left: 15%;
  margin-right: 15%;
  min-width: 700px;
  height: 906px;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 900px) {
    margin: 0;
    width: 100%;
  }
`
const BookPart = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const BookImg = styled.img`
  width: 306px;
  height: 437px;
  border: 1px solid #333;
`;
const BookInfoPart = styled.div`
  width: 100%;
  height: 50px;
  margin: 10 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const BookAuthor = styled.div`
  width: 20%;
  text-align: center;
  font-size: 0.8em;
`;
const BookPublish = styled.div`
  width: 50%;
  border-color: #333;
  border-style: solid;
  border-width: 0 2px 0;
  text-align: center;
  padding: 0 5px 0;
  font-size: 0.8em;
`
const BookPrice = styled.div`
  width: 20%;
  text-align: center;
  font-size: 0.8em;
`
const BookTag = styled.div`
  width: 100%;
  height: 100px;
  margin: 10 0;
  padding: 10px;
`;
const BookPurchase = styled.img`
  width: 147px;
  height: 69px;
`
const CommentPart = styled.div`
  width: 70%;
  height: 100%;
`
const BookName = styled.div`
  width: 100%;
  height: 100px;
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
  padding: 20px 30px;
`
const SortBox = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: end;
`
const SortElement = styled.div`
  width: 50px;
  margin: 10px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
`
const CommentInputBox = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`
const CommentInput = styled.input`
  display: block;
  border: none;
  outline: none;
  padding-left: 30px;
  font-size: 1.1em;
  width: 75%;
  height: 90%;
  border-radius: 30px;
  box-shadow: 4px 4px 10px #349844;
`;
const CommentButton = styled.img`
  cursor: pointer;
  display: block;
`
const CommentsBox = styled.div`
  width: 100%;
  height: 686px;
`
const CommentCloudBox = styled.div`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  padding: 15px;
`
const CommentCloud = styled.div`
  width: 100%;
  min-height: 120px;
  border-radius: 30px;
  box-shadow: 4px 4px 10px #349844;
  display: flex;
  flex-direction: column;
  padding: 10px 30px 10px;
  background-color: white;
`
const CommentCloudTop = styled.div`
  width: 100%;
  height: 20px;
  font-weight: bold;
`
const CommentCloudMiddle = styled.div`
  width: 100%;
  height: 60px;
  padding: 5px 0;
`
const CommentCloudBottom = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
`
const CommentDate = styled.div`
  width: 20%;
  height: 40px;
  line-height: 40px;
  color: #666;
`
const CommentLikeImg = styled.img`
  display: block;
  height: 40px;
  padding: 5px;
`
const CommentLike = styled.div`
  width: 5%;
  height: 40px;
  line-height: 40px;
  text-align: center;
`
const CommentReport = styled.div`
  width: 10%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  &:hover,
  &:focus{
    font-weight: bold;
  }
  &:active{
    color: red;
  }
`

export default BookInfo
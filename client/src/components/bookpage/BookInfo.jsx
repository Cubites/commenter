import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Header from './Header';
import Pagination from './Pagination';

const BookInfo = ({BookData, setUpAnimation}) => {
  const [SortColor, setSortColor] = useState(false);
  const [CommentsInfo, setCommentsInfo] = useState([]);
  const [PageNum, setPageNum] = useState(1)
  console.log(BookData);

  useEffect(() => {
    axios.post('/comment/info', {
      isbn: BookData.isbn,
      sort: 0,
      item_size: 5,
      page_num: 1
    })
      .then(data => setCommentsInfo(() => [...data.data]))
      .catch(err => console.log('err: ', err));
  }, [BookData, PageNum]);
  return (
    <BookInfoPage>
      <Header setUpAnimation={setUpAnimation} />
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
          <BookPurchase target="_blank" href={BookData.sale_link} />
        </BookPart>
        <CommentPart>
          <BookName>
            {BookData.book_title}
          </BookName>
          <SortBox>
            <SortElement 
              style={{color: SortColor ? 'black' : '#46B50A'}}
              onClick={() => setSortColor(0)}
            >
              최신순
            </SortElement>
            <SortElement 
              style={{color: SortColor ? '#46B50A' : 'black'}}
              onClick={() => setSortColor(1)}
            >
              추천순
            </SortElement>
          </SortBox>
          <CommentInputBox>
            <CommentInput></CommentInput>
            <CommentButton src="images/comment.png" />
          </CommentInputBox>
          <CommentsBox>
            
            {
              CommentsInfo.length == 0 
              ? 
              <NoCommentBox>
                코멘트가 없습니다. <br/>
                혹시 읽어보셨나요? 읽어보셨다면 코멘트를 남겨보세요.
              </NoCommentBox>
              : CommentsInfo.map((data, i) => 
                <CommentCloudBox key={"comment" + i}>
                  <CommentCloud>
                    <CommentCloudTop>
                      {data.nickname}
                    </CommentCloudTop>
                    <CommentCloudMiddle>
                      {data.cm_content}
                    </CommentCloudMiddle>
                    <CommentCloudBottom>
                      <CommentDate>
                        {data.cm_date}
                      </CommentDate>
                      <CommentLikeImg src="images/like.png" />
                      <CommentLike>
                        {data.cm_like_num}
                      </CommentLike>
                      <CommentReport>신고</CommentReport>
                    </CommentCloudBottom>
                  </CommentCloud>
                </CommentCloudBox>
              )
            }
            <Pagination PageNum={PageNum} setPageNum={setPageNum} />
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
const BookPurchase = styled.a`
  display: block;
  width: 147px;
  height: 69px;
  text-decoration: none;
  color: #000;
  background-image: url("images/purchase.png");
  cursor: pointer;
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
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
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
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`

/* 코멘트 */
/** 코멘트가 없는 경우 **/
const NoCommentBox = styled.div`
  margin-top: 50px;
  font-size: 1.4em;
  font-weight: bold;
  color: #666;
  text-align: center;
  line-height: 1.5em;
`

/** 코멘트가 있는 경우 **/
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
  width: 30%;
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
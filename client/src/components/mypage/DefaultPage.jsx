import { useState } from 'react';
import styled from 'styled-components';

const DefaultPage = () => {
  return (
    <DefaultPageContainer>
      <UserInfo>
        <UserNameIntro>
          <UserName>코멘터</UserName>
          <UserIntro>
            코멘터입니다. 반갑습니다.
          </UserIntro>
        </UserNameIntro>
        <UserCommentLike>
          <UserCommentBox>
            <CommentTitle>코멘트</CommentTitle>
            <CommentCount>10</CommentCount>
          </UserCommentBox>
          <UserLikeBox>
            <LikeTitle>좋아요</LikeTitle>
            <LikeCount>20</LikeCount>
          </UserLikeBox>
        </UserCommentLike>
      </UserInfo>
      <BookmarkCommentBox>
        <ListTitle>북마크 목록</ListTitle>
        <List>

        </List>
        <ListTitle>코멘트 목록</ListTitle>
        <List>
          
        </List>
      </BookmarkCommentBox>
    </DefaultPageContainer>
  )
}

const DefaultPageContainer = styled.div`
  width: 70%;
  height: 100%;
`;
/* 유저 정보 */
const UserInfo = styled.div`
  width: 100%;
  height: 300px;
  border: 3px solid #00bf19;
  padding: 20px;
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
`;
/** 유저 이름, 소개 **/
const UserNameIntro = styled.div`
  width: 80%;
  height: 100%;
  border-right: 3px solid #46B50A;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: left;
`;
const UserName = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #44B606;
  opacity: 0.7;
  font-size: 1.5em;
  font-weight: bold;
  padding-bottom: 15px;
`;
const UserIntro = styled.div`
  width: 100%;
  height: 80%;
  background-color: #E4E4E4;
  padding: 10px;
`;

/** 작성한 코멘트 수, 받은 좋아요 수 **/
const UserCommentLike = styled.div`
  width: 20%;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const UserCommentBox = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CommentTitle = styled.div`
  width: 100%;
  text-align: center;
  padding-bottom: 5px;
  font-weight: bold;  
`;
const CommentCount = styled.div`
  width: 75px;
  height: 60px;
  text-align: center;
  line-height: 50px;
  font-weight: bold;
  background-image: url("images/comment_back.png");
`;
const UserLikeBox = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LikeTitle = styled.div`
  width: 100%;
  text-align: center;
  padding-bottom: 5px;
  font-weight: bold;  
`;
const LikeCount = styled.div`
  width: 63px;
  height: 60px;
  text-align: center;
  line-height: 80px;
  font-weight: bold;
  background-image: url("images/like_back.png");
`;

/* 북마크 도서 목록, 코멘트 작성한 도서 목록 */
const BookmarkCommentBox = styled.div`
  width: 100%;
  height: 566px;
  padding: 10px;
`;
const ListTitle = styled.div`
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
`;
const List = styled.div`
  width: 100%;
  min-height: 100px;
`;


export default DefaultPage
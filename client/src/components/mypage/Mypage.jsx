import { useState } from 'react';
import styled from 'styled-components';

import Header from './Header';
import DefaultPage from './DefaultPage';
import QnaPage from './QnaPage';
import InfoEditPage from './InfoEditPage';

const Mypage = () => {
  const [MenuSelect, setMenuSelect] = useState(0)
  return (
    <MypageContainer>
      <Header />
      <MypageMain>
        <TitleMenuBox>
          <Title>
            <TitleText>코멘터님<br/>환영합니다.</TitleText>
          </Title>
          <MenuBox>
            <MenuList>
              <MenuItem 
                onClick={() => setMenuSelect(0)} 
                style={{color: MenuSelect==0 ? "#00BF19" : "black"}}
              >
                북마크 / 코멘트 목록
              </MenuItem>
              <MenuItem 
                onClick={() => setMenuSelect(1)} 
                style={{color: MenuSelect==1 ? "#00BF19" : "black"}}
              >
                개인정보 수정
              </MenuItem>
              <MenuItem 
                onClick={() => setMenuSelect(2)} 
                style={{color: MenuSelect==2 ? "#00BF19" : "black"}}
              >
                문의 사항
              </MenuItem>
            </MenuList>
            <Unregister>회원 탈퇴</Unregister>
          </MenuBox>
        </TitleMenuBox>

        {/* <DefaultPage /> */}
        {/* <QnaPage /> */}
        <InfoEditPage />

      </MypageMain>
    </MypageContainer>
  )
}

const MypageContainer = styled.div`
  width: 100%;
  height: 986px;
  display: flex;
  flex-direction: column;  
`;
const MypageMain = styled.div`
  margin: 50px 15% 0;
  min-width: 700px;
  height: 906px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 900px) {
    margin: 0;
    width: 100%;
  }
`;
const TitleMenuBox = styled.div`
  width: 25%;
  height: 856px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
// 좌측 상단 인사말
const Title = styled.div`
  width: 100%;
  height: 300px;
  background-color: #44B606;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
`;
const TitleText = styled.div`
  font-size: 1.5em;
  text-align: center;
  font-weight: bold;
  line-height: 2em;
`
const MenuBox = styled.div`
  width: 100%;
  height: 516px;
  border: 3px solid #00bf19;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const MenuList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const MenuItem = styled.div`
  width: 100%;
  height: 20px;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  padding: 30px 0;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  cursor: pointer;
`;
const Unregister = styled.div`
  width: 100%;
  height: 20px;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  padding: 30px 0;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  cursor: pointer;
  &:hover{
    color: red;
  }
  &:active{
    color: #af0000;
  }
`

export default Mypage
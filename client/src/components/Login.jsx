import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Container = styled.div`
  padding-left: 15%;
  padding-right: 15%;
  height: 500px;
`

let naverClientId = "wNVVHJDXsM2ml9VpjXRN";
let kakaoClientId = "53826ce023c535254f5d2424b92e9421";
let callbackUrl =  "http://localhost:3000";

const Login = () => {
    const navigate = useNavigate();

    // Naver sdk import
    const naverScript = document.createElement("script");
    naverScript.src =
      "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
    naverScript.type = "text/javascript";
    document.head.appendChild(naverScript);

    const kakaoScript = document.createElement("script");
    kakaoScript.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    kakaoScript.type = "text/javascript";
    document.head.appendChild(kakaoScript);

    let naverLogin;
    // Naver sdk 스크립트 로드 완료시
    naverScript.onload = () => {
      //console.log("로그인 입니다");
      naverLogin = new window.naver.LoginWithNaverId({
        clientId: naverClientId,
        callbackUrl: 'http://localhost:3000/login?setLogin=N&',
        callbackHandle: true,
        isPopup: false, // 로그인 팝업여부
        loginButton: {
          color: "green", // 색상(white, green)
          type: 3, // 버튼타입(1,2,3)
          height: 60, // 배너 및 버튼 높이
        }        
      });             
      naverLogin.init(); 

      const SetLogin = new URL(window.location.href).searchParams.get('setLogin');
      console.log(SetLogin);
      if(SetLogin == "N"){
          naverLogin.getLoginStatus((status) => {
            if (status) {
              const {id} = naverLogin.user;
              alert(id);
              callLogin('N',id);
            }          
          });
      }
    };


   

    // 로그인 부분 자동으로 메인으로 이동
    const callLogin = (type, id) => {
      console.log(id);
      axios.get('/user/login?login_method='+type+'&user_code='+id)
      .then(res => {
        let {user_id, login_token, user_nick} = res.data;        
        // alert(user_id+"+"+login_token+"+"+user_nick);
        document.cookie = "login_token=" + login_token;
        document.cookie = "user_nick=" + user_nick;
        navigate('/');
      })
      .catch(err => console.log("err : " + err));
    }

    // Kakao sdk 스크립트 로드 완료시
    kakaoScript.onload = () => {
      window.Kakao.init(kakaoClientId);
      window.Kakao.Auth.createLoginButton({
        container: "#kakao-login-btn",
        success: (auth) => {
          console.log(auth);
          callLogin("K", auth.id_token);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    };

    return(
      <Container>
      <div id="naverIdLogin"></div>
      <button type="button" id="kakao-login-btn"></button>
      </Container>
    )
  
}

export default Login;
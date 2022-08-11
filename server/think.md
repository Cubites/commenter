# 로그인
* 유저 로그인 신호(login_method, user_code)
<br>> db에 아무 데이터가 존재하는지 확인
<br>> db에서 데이터 호출
<br>> db에서 가져온 데이터와 user_code가 일치하는지 비교
<br>> 일치하면 토큰 생성 후, 쿠키로 보냄 / 없으면 db에 신규유저로 저장 후, 토큰을 생성하여 쿠키로 보냄

## MariaDB 통신
* 데이터 확인
  * <code>console.log(data);</code> : 열 데이터 유무와 관계없이 값 출력
  * <code>console.log(data.length);</code> : 받은 열 데이터가 없으면 0, 있으면 열 갯수 출력
  * <code>console.log(data[0]);</code> : 받은 열 데이터가 없으면 undefined, 있으면 배열 형태로 출력
  * <code>console.log(data[0].token);</code> : 열 데이터가 없으면 에러발생, 열 데이터는 있으나 값이 없으면 null
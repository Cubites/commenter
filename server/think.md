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

## 에러
### SqlError: Pool fails to create connection: (conn=29975, no: 1040, SQLState: 08004) Too many connections
* 원인: AWS RDS DB에 커넥션이 많아 생기는 문제
* 커넥션 제한 확인
  * 1. <code>show variables like 'max_connections';</code> 쿼리문 실행
  * 2. 결과에서 최대 커넥션 수 확인가능
* 해결 방법
  * 1. 일정시간 요청이 없는 커넥션이 자동으로 끊어지게 설정
  * 2. 커넥션을 닫을 때까지 기다리는 시간을 짧게 설정
    * 시간 확인 : <code>show vaiables like '%timeout%';</code> 실행
      <br>> wait_timeout 값(단위: 초) 확인 (기본값 : 128800초; 8시간)

## JWT
* 만료시간을 넣은 JWT 값을 verify 했을 때 결과
  * 만료시간이 지나지 않은 경우
    <br>> 넣은 payload 값, iat(토큰 발급 시간), exp(만료 시간)이 return 됨
  * 만료시간이 지난 경우
    <br>> 에러 발생(err.message === 'jwt expired')
* 옳바르지 않은 JWT 값을 verify 햇을 때 결과
  <br>> 에러 발생(err.message === 'invalid token')
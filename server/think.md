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

## JWT
* 만료시간을 넣은 JWT 값을 verify 했을 때 결과
  * 만료시간이 지나지 않은 경우
    <br>> 넣은 payload 값, iat(토큰 발급 시간), exp(만료 시간)이 return 됨
  * 만료시간이 지난 경우
    <br>> 에러 발생(err.message === 'jwt expired')
* 옳바르지 않은 JWT 값을 verify 햇을 때 결과
  <br>> 에러 발생(err.message === 'invalid token')

## Router
* 모든 경로에서 실행시키는 방법 : 경로를 * 로 지정
  ```javascript
  const router = require('express').Router();
  
  router.all('*', (req, res, next) => { ... });

  module.exports = router;
  ```

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

### SqlError: Cannot execute new commands: connection closed

### SyntaxError: Unexpected token / in JSON at position 118
* 원인 : Postman에서 요청 body에 주석을 넣어서 발생한 에러
* 해결 : 요청 body에서 주석을 지움

### DB의 시간 데이터를 불러오면 UTC 시간대로 바뀌는 문제
#### 시도 방법
1. connection 파라미터 값에 <code>timezone: 'Asia/Seoul'</code> 추가
  <br>> 해결안됨
2. query 문으로 DB의 시간대 변경
  ```sql
  SHOW GLOBAL VARIABLES LIKE 'time_zone';
  -- root 계정임에도 권한 에러 발생
  ```
3. my.cnf 파일의 time_zone 값 변경
  <br>> AWS RDS는 my.cnf 파일을 직접 수정할 수 없음
4. [AWS RDS 한정] RDS 관리 페이지에서 시간대를 'Asia/Seoul'로 바꾼 파라미터 그룹을 새로만들고 DB에 적용 후 재부팅
  <br>> DB 시간대는 정상적으로 바뀐 것을 확인
  <br>> 하지만 nodejs로 불러오면 값이 UTC 시간대로 바뀌어버림
5. connection 파라미터에 다음 값 추가
  ```sql
  dateStrings: [
    'DATE',
    'DATETIME',
  ]
  ```
  <br>> 원래 DB값을 불러올 때 시간 값을 읽으면 UTC로 변환함
  <br>> 위 값을 추가하면 시간 값을 STRING으로 받으므로 UTC로 변환되지 않음

### 브라우저 에러 crbug/1173575, non-JS module files deprecated.
* 원인: react 프록시 설정(setupProxy.js)에서 target 값을 변수값으로 바꾼 것
  * 환경 변수 값을 못읽어 왔는 등의 문제로 추정
* 해결: 원래 적혀있던 대로(target 링크 하드코딩) 원복
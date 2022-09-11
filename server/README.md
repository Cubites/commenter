## .env 파일 생성
* server 폴더(서버 최상위 폴더)에 .env 파일 생성
  * 내용
    <pre>
      NAVER_CLIENT_ID=네이버_개발자_아이디
      NAVER_CLIENT_SECRET=네이버_개발자_시크릿_코드
      SALT_ROUNDS=솔트값
      COOKIE_SECRET_KEY=쿠키_시크릿_키

      DB_HOST=DB_HOST_경로
      DB_USER=DB_유저명
      DB_PASSWORD=DB_유저_비밀번호
      DB_DATABASE=DB명

      JWT_SECRET_KEY=JWT_시크릿_키
      HASING_ALGO=JWT_해싱_알고리즘
      EXPIRE_LEN=JWT_만료시간
      PUBLISHER=토큰_발급자명
    </pre>
# LLM 챗봇 실행 안내

## 1. OpenAI API 키 설정
서버는 `process.env.OPENAI_API_KEY`를 사용합니다. 아래 방법 중 하나로 키를 환경 변수로 등록하세요.

### Windows PowerShell
```powershell
$env:OPENAI_API_KEY="sk-여기에-붙여넣기"
node app.js
```

### Windows CMD
```cmd
set OPENAI_API_KEY=sk-여기에-붙여넣기
node app.js
```

### .env 파일 사용 (선택)
루트에 `.env`를 만들고 다음 한 줄을 넣은 뒤, `dotenv` 같은 라이브러리로 로드할 수 있습니다.
```
OPENAI_API_KEY=sk-여기에-붙여넣기
```
> `.env` 파일은 깃에 올리지 말고 로컬에만 보관하세요.

## 2. 서버 실행
```bash
cd final
npm install
npm start
```

## 3. 접속
브라우저에서 `http://localhost:3000`을 열어 질문을 입력하면 OpenAI 모델이 답변합니다.



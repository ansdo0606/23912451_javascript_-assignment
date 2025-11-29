import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// 현재 파일 경로 계산 (ESM에서는 __dirname 사용 불가)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수에서 API 키 읽기 (운영 환경에 필수)
const { OPENAI_API_KEY } = process.env;
const client = OPENAI_API_KEY
  ? new OpenAI({ apiKey: OPENAI_API_KEY })
  : null;

// JSON 파싱 및 정적 파일 제공
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 루트("/") 경로: index.html 파일 응답
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Chat 요청 처리
app.post("/api/chat", async (req, res) => {
  if (!client) {
    return res.status(500).json({
      success: false,
      error: "OPENAI_API_KEY 환경 변수가 설정되지 않았습니다."
    });
  }

  const { keywords } = req.body;
  const prompt = keywords?.trim();

  if (!prompt) {
    return res.status(400).json({ success: false, error: "질문을 입력하세요." });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You are a concise Korean assistant that delivers helpful, safe answers."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      query: prompt,
      answer: response.output_text?.trim() || "답변이 비어 있습니다."
    });
  } catch (error) {
    console.error("OpenAI 호출 오류:", error);
    res.status(500).json({
      success: false,
      error: "응답 생성 중 오류가 발생했습니다."
    });
  }
});

//서버 실행
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`서버 실행 중: http://localhost:${PORT}`)
);

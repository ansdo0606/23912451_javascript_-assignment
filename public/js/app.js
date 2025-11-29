const chatBox = document.getElementById("chatBox");
const form = document.getElementById("chatForm");
const inputEl = document.getElementById("keywords");
const sendBtn = document.getElementById("sendBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  appendMessage("나", text, "user");
  inputEl.value = "";
  inputEl.focus();

  toggleLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: text })
    });

    const payload = await res.json().catch(() => ({}));
    toggleLoading(false);

    if (!res.ok || !payload.success) {
      appendMessage("시스템", payload.error || `요청 실패 (${res.status})`, "error");
      return;
    }

    appendMessage("챗봇", formatMessageWithCodeBlocks(payload.answer), "bot", true);
  } catch (error) {
    toggleLoading(false);
    appendMessage("시스템", "서버 통신 오류가 발생했습니다.", "error");
    console.error(error);
  }
});

function appendMessage(author, text, type, isHtml = false) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;

  if (isHtml) {
    msg.innerHTML = `<strong>${author}</strong><br>${text}`;
    msg.querySelectorAll("pre code").forEach((el) => hljs.highlightElement(el));
  } else {
    msg.innerHTML = `<strong>${author}</strong><br>${escapeHtml(text)}`;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleLoading(isLoading) {
  sendBtn.disabled = isLoading;
  sendBtn.textContent = isLoading ? "생성 중..." : "보내기";
}

function formatMessageWithCodeBlocks(text = "") {
  return text
    .replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${escapeHtml(code)}</code></pre>`)
    .replace(/\n/g, "<br>");
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}



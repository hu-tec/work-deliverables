const authPage = document.body.dataset.authPage;
const authPageForm = document.getElementById("authPageForm");
const authMessage = document.getElementById("authMessage");

authPageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setAuthMessage("처리 중입니다.");

  const formData = new FormData(authPageForm);
  const endpoint = authPage === "signup" ? "/api/auth/signup" : "/api/auth/login";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: String(formData.get("username") || "").trim(),
        password: String(formData.get("password") || "")
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "인증 요청에 실패했습니다.");
    }
    window.location.href = "/";
  } catch (error) {
    setAuthMessage(error.message, true);
  }
});

function setAuthMessage(message, isError) {
  authMessage.textContent = message;
  authMessage.classList.toggle("warn", !!isError);
}

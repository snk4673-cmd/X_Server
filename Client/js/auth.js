const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const signupMsg = document.getElementById("signup-message");
const loginMsg = document.getElementById("login-message");

// 회원가입
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const userid = formData.get("userid");
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const url = formData.get("url");

  try {
    const data = await window.apiRequest("/auth/signup", "POST", {
      userid,
      name,
      email,
      password,
      url,
    });

    signupMsg.textContent = "회원가입이 완료되었습니다. 이제 로그인해 주세요.";
    signupMsg.style.color = "green";
    signupForm.reset();
  } catch (err) {
    signupMsg.textContent = "회원가입 실패: " + err.message;
    signupMsg.style.color = "red";
  }
});

// 로그인
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const userid = formData.get("userid");
  const password = formData.get("password");

  try {
    const data = await window.apiRequest("/auth/login", "POST", {
      userid,
      password,
    });

    const token = data.token || data.accessToken;
    if (!token) {
      throw new Error(
        "토큰이 응답에 없습니다. 백엔드 응답 형식을 확인해주세요."
      );
    }
    localStorage.setItem("token", token);
    localStorage.setItem("userid", userid);

    loginMsg.textContent = "로그인 성공! 메인 페이지로 이동합니다.";
    loginMsg.style.color = "green";

    window.location.href = "/main.html";
  } catch (err) {
    loginMsg.textContent = "로그인 실패: " + err.message;
    loginMsg.style.color = "red";
  }
});

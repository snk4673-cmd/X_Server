// 1) 로그인 안 되어 있으면 index.html로 이동
const token = localStorage.getItem("token");
if (!token) {
  alert("로그인이 필요합니다.");
  window.location.href = "./index.html";
}

// DOM 요소들 가져오기
const logoutBtn = document.getElementById("logout-btn");
const welcomeText = document.getElementById("welcome-text");
const postForm = document.getElementById("post-form");
const postMsg = document.getElementById("post-message");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const postsList = document.getElementById("posts-list");

// 로그인한 userid (index.html에서 저장했음)
const myUserid = localStorage.getItem("userid");
if (myUserid) {
  welcomeText.textContent = `${myUserid} 님`;
}

// 로그아웃
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userid");
  window.location.href = "./index.html";
});

// 페이지 처음 로딩 → 모든 포스트 불러오기
loadPosts();

// --------------------------------------
// 1) POST /post → 글 작성
// --------------------------------------
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  postMsg.textContent = "";

  const formData = new FormData(postForm);
  const text = formData.get("text");

  if (!text || text.trim().length < 3) {
    postMsg.style.color = "red";
    postMsg.textContent = "최소 3자 이상 입력해 주세요.";
    return;
  }

  try {
    // createPost → req.body.text
    await window.apiRequest("/post", "POST", { text });

    postMsg.style.color = "green";
    postMsg.textContent = "글이 등록되었습니다!";
    postForm.reset();

    // 목록 새로고침
    await loadPosts();
  } catch (err) {
    postMsg.style.color = "red";
    postMsg.textContent = "글 등록 실패: " + err.message;
  }
});

// --------------------------------------
// 2) GET /post or GET /post?userid=xxx
// --------------------------------------
async function loadPosts(userid = "") {
  postsList.innerHTML = "<li>불러오는 중...</li>";

  try {
    const query = userid ? `?userid=${encodeURIComponent(userid)}` : "";
    const posts = await window.apiRequest(`/post${query}`, "GET");
    renderPosts(posts);
  } catch (err) {
    postsList.innerHTML = `<li>불러오기 실패: ${err.message}</li>`;
  }
}

// --------------------------------------
// 3) 게시글 렌더링
// --------------------------------------
function renderPosts(posts) {
  postsList.innerHTML = "";

  if (!posts || posts.length === 0) {
    postsList.innerHTML = "<li>게시글이 없습니다.</li>";
    return;
  }

  posts.forEach((post) => {
    const li = document.createElement("li");

    // post 구조 예측:
    // { id, text, createdAt, userid, username }

    const userid = post.userid || post.userId || "알수없음";
    const username = post.username || post.name || "";
    const createdAt = post.createdAt
      ? new Date(post.createdAt).toLocaleString()
      : "";

    const meta = document.createElement("div");
    meta.className = "post-meta";
    meta.textContent = `[${userid}${
      username ? " / " + username : ""
    }] ${createdAt}`;

    const body = document.createElement("div");
    body.className = "post-content";
    body.textContent = post.text;

    li.appendChild(meta);
    li.appendChild(body);

    // 내 글이면 삭제 버튼 표시
    if (userid === myUserid) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.style.marginTop = "4px";

      delBtn.addEventListener("click", () => {
        deletePost(post.id);
      });

      li.appendChild(delBtn);
    }

    postsList.appendChild(li);
  });
}

// --------------------------------------
// 4) DELETE /post/:id
// --------------------------------------
async function deletePost(postId) {
  if (!confirm("정말 삭제하시겠어요?")) return;

  try {
    await window.apiRequest(`/post/${postId}`, "DELETE");
    loadPosts(searchInput.value.trim());
  } catch (err) {
    alert("삭제 실패: " + err.message);
  }
}

// --------------------------------------
// 5) 검색 → userid 기준
// --------------------------------------
searchBtn.addEventListener("click", () => {
  const userid = searchInput.value.trim();
  loadPosts(userid);
});

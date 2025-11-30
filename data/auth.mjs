import { db } from "../db/database.mjs";

export async function createUser(user) {
  const { userid, password, name, email, url } = user;
  console.log("createUser user:", user); // 디버그용

  return db
    .execute(
      "INSERT INTO users (userid, password, name, email, url) VALUES (?, ?, ?, ?, ?)",
      [userid, password, name, email, url ?? null] // url 없으면 null
    )
    .then((result) => result[0].insertId);
}

export async function findByUserid(userid) {
  return db
    .execute(
      "SELECT idx, userid, password, name, email, url FROM users WHERE userid=?",
      [userid]
    )
    .then((result) => {
      console.log("findByUserid rows:", result[0]); // 디버그용
      return result[0][0];
    });
}

export async function findById(idx) {
  return db
    .execute("SELECT idx, userid, name, email, url FROM users WHERE idx=?", [
      idx,
    ])
    .then((result) => result[0][0]);
}

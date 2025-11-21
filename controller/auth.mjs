import express from "express";
import * as authRepository from "../data/auth.mjs";

// export async function signup(res, res, next) {
//   const { userid, password, name, email, url } = req.body;
//   const user = await postRepository.create(userid, password, name, email, url);
//   res.status(201).json(user);
// }

export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;
  const user = await authRepository.createUser(userid, password, name, email);
  if (user) {
    res.status(201).json(user);
  }
}

// export async function login(req, res, next) {
//   const id = req.params.id;
//   const password = await postRepository.getById(id);
//   if (post) {
//     res.status(200).json(user);
//   } else {
//     res.status(404).json({ message: `아이디 또는 비밀번호가 잘못됐습니다` });
//   }
// }

export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.login(userid, password);
  if (user) {
    res.status(200).json(`${userid}님 로그인 완료`);
  } else {
    res
      .status(404)
      .json({ message: `${userid}님 아이디 또는 비밀번호를 확인하세요` });
  }
}

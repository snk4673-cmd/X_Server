import express from "express";
import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";

async function createJwtToken(idx) {
  return jwt.sign({ idx }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// export async function signup(res, res, next) {
//   const { userid, password, name, email, url } = req.body;
//   const user = await postRepository.create(userid, password, name, email, url);
//   res.status(201).json(user);
// }

export async function signup(req, res, next) {
  const { userid, password, name, email, url } = req.body;

  //회원 중복 체크

  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(409).json({ message: `${userid}이 이미 있습니다` });
  }

  const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds);
  const user = await authRepository.createUser({
    userid,
    password: hashed,
    name,
    email,
    url,
  });

  const token = await createJwtToken(user.idx);
  console.log(token);
  res.status(201).json({ token, user });
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
  const user = await authRepository.findByUserid(userid);
  if (!user) {
    res.status(401).json(`${userid} 를 찾을 수 없음`);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: `아이디 또는 비밀번호 확인` });
  }

  const token = await createJwtToken(user.idx);
  return res.status(200).json({ token, user });
}

export async function me(req, res, next) {
  const user = await authRepository.findById(req.idx);
  if (!user) {
    return res.status(404).json({ message: "일치하는 사용자가 없음" });
  }
  res.status(200).json({ token: req.token, userid: user.idx });
}

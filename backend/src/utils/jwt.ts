import jwt, { SignOptions } from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "dev-secret";

export function signJwt(payload: object, expiresIn: number = 3600) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

export function verifyJwt(token: string) {
  return jwt.verify(token, secret);
}

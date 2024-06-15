import * as jose from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const ALG = process.env.ALGORITHM || "HS256";

export const generateToken = async (userId, res) => {
  const jwt_token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("15d")
    .sign(SECRET);

  res.cookie("jwt", jwt_token, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 24 * 60 * 60 * 1000,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  });
};

export const verifyToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload.userId;
  } catch (error) {
    return null;
  }
};

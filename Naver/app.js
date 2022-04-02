require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Naver OAuth");
});

// OAuth 2.0 네이버 로그인
const oauthNaverLogin = asyncWrapper(async (req, res) => {
  const { code, state } = req.body;
  if (code && state) {
    const response = await fetch(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${code}&state=${code}`
    ).then((res) => res.json());
    const naverAccessToken = response.access_token;
    const naverUserInfo = await fetch(`https://openapi.naver.com/v1/nid/me`, {
      headers: {
        Authorization: `Bearer ${naverAccessToken}`,
      },
    }).then((res) => res.json());

    // DB에 넣을 값 생성
    const email = naverUserInfo.response.email + "-Naver";
    const nickname =
      naverUserInfo.response.nickname + String(Math.random()).slice(2, 8);
    const password = process.env.SOCIAL_LOGIN_PASSWORD;
    const image = naverUserInfo.response.profile_image;

    // DB에 추가
    let userInfo = await User.findOne({ email });
    if (!userInfo) {
      // 처음 소셜로그인 하는 경우
      userInfo = await User.create({ email, nickname, password, image });
    }
    const accessToken = generateToken(userInfo, "accessToken");
    const refreshToken = generateToken(userInfo, "refreshToken");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/users/auth/token",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.json({
      _id: userInfo._id,
      accessToken,
      message: "success",
    });
  } else {
    // authorization code 또는 state가 전달되지 않았을 경우
    res
      .status(400)
      .json({ message: "fail : require authorization code and state" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

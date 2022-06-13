import {
  KakaoOAuthToken,
  getProfile as getKakaoProfile,
  login,
} from "@react-native-seoul/kakao-login";
import React, { useState } from "react";
// import ResultView from './IntroTemp';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: #191919;
  font-size: 16px;
`;

const KakaoButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 200px;
  height: 50px;
  background-color: #fee500;
`;

const KakaoImage = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 5px;
`;

const Logo = styled.ImageBackground`
  width: 100%;
  height: 50%;
`;

const NativeStack = createNativeStackNavigator();

function Login() {
  const [result, setResult] = useState<string>("");

  const signInWithKakao = async () => {
    const token: KakaoOAuthToken = await login();

    console.log(token);

    let jwtToken = fetch("http://3.39.190.23:8080/login/kakao/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token.accessToken }),
    })
      .then((response) => response.json())
      .then((resData) => {
        console.log("--- log ---");
        console.log(resData.token);
      });


    console.log(token.accessToken);
  };

  return (
    <Container>
      {/* <ResultView result={result} /> */}
      <Logo
        source={require("../navigation/img/logo.png")} //이미지경로
        resizeMode="center" // 'cover', 'contain', 'stretch', 'repeat', 'center' 중 선택
      ></Logo>
      <KakaoButton onPress={() => signInWithKakao()}>
        <KakaoImage
          source={require("../navigation/img/kakao_logo.png")}
          resizeMode="cover"
        />
        <Title>카카오로 시작하기</Title>
      </KakaoButton>
    </Container>
  );
}


const LoginStack = () => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name="Login" component={Login} />
  </NativeStack.Navigator>
);

export default LoginStack;

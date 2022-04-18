import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import React, { useState } from 'react';
import axios from "axios";
// import ResultView from './IntroTemp';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, Image, ImageBackground } from "react-native";
import styled from "styled-components/native";

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

// const API = axios.create({
//   baseURL: "http://",
//   headers:{
//     "Content-Type":"application/json",
//   },
//   withCredentials: true,
// })

function Login() {

  const [result, setResult] = useState<string>('');

  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();
    // setResult(JSON.stringify(token));
    axios.get('http://13.125.93.119:8080/api/user/kakao?token='+token.accessToken)
    //token이 없으면 로그인 화면, 있으면 홈 화면, token을 local storage에 저장하기
    //코드 예쁘게 정리하기
    .then(function (response) {
      console.log(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return(

  <Container>
    {/* <ResultView result={result} /> */}
    <Logo
      source={require("../navigation/img/logo.png")}  //이미지경로
      resizeMode="center" // 'cover', 'contain', 'stretch', 'repeat', 'center' 중 선택 
    >
    </Logo>
    <KakaoButton onPress={() => signInWithKakao()}>
      <KakaoImage
        source={require("../navigation/img/kakao_logo.png")}
        resizeMode="cover"
      />
      <Title>카카오로 시작하기</Title>
    </KakaoButton>
  </Container>
  )
  
};

const LoginStack = () => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name="Login" component={Login} />
  </NativeStack.Navigator>
);

export default LoginStack;

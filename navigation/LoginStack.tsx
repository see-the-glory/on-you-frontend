import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import React, { useState } from 'react';
import ResultView from './IntroTemp';
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

function Login() {

  const [result, setResult] = useState<string>('');

  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();

    setResult(JSON.stringify(token));
  };

  return(

  <Container>
    <ResultView result={result} />
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

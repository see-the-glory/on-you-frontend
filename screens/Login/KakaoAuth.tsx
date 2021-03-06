import { KakaoOAuthToken, getProfile as getKakaoProfile, login as kakaoLogin } from "@react-native-seoul/kakao-login";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { CommonApi } from "../../api";
import { useDispatch } from "react-redux";
import { Login } from "../../store/actions";
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

const KakaoAuth = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const mutation = useMutation(CommonApi.getJWT, {
    onSuccess: (res) => {
      // redux 저장
      dispatch(Login(res.token));
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(error);
      // Toast Message 출력.
    },
  });

  const signInWithKakao = async () => {
    const token: KakaoOAuthToken = await kakaoLogin();

    mutation.mutate({ token: token.accessToken });
  };

  return (
    <Container>
      <Logo
        source={require("../../assets/logo.png")} //이미지경로
        resizeMode="center" // 'cover', 'contain', 'stretch', 'repeat', 'center' 중 선택
      ></Logo>
      <KakaoButton onPress={signInWithKakao}>
        <KakaoImage source={require("../../assets/kakao_logo.png")} resizeMode="cover" />
        <Title>카카오로 시작하기</Title>
      </KakaoButton>
    </Container>
  );
};

export default KakaoAuth;

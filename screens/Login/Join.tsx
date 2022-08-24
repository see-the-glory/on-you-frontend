import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useMutation } from "react-query";
import { CommonApi } from "../../api";
import { useDispatch } from "react-redux";
import { Login } from "../../store/Actions";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Title = styled.Text`
  color: #ff714b;
  font-size: 20px;
  font-weight: 700;
`;

const JoinButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-color: #ff714b;
  border-width: 1px;
  width: 75%;
  height: 48px;
  background-color: #fff;
`;

const LogoBox = styled.View`
  width: 50%;
  height: 550px;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 100%;
  height: 50%;
`;

const Join = () => {
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

  /* const signInWithKakao = async () => {
    const token: KakaoOAuthToken = await kakaoLogin();

    mutation.mutate({ token: token.accessToken });
  }; */

  return (
    <Container>
      <LogoBox>
        <Logo source={require("../../assets/logo.png")} resizeMode="cover"></Logo>
      </LogoBox>

      <JoinButton>
        <Title>온유 회원가입 하기</Title>
      </JoinButton>
    </Container>
  );
};

export default Join;

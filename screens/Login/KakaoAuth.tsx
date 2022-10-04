// import { KakaoOAuthToken, login as kakaoLogin } from "@react-native-seoul/kakao-login";
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
`;

const Logo = styled.ImageBackground`
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
`;

const KakaoButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  width: 60%;
  height: 50px;
  margin-bottom: 15%;
  background-color: #fee500;
`;

const KakaoImage = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 5px;
`;

const Title = styled.Text`
  color: #191919;
  font-size: 18px;
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

  // const signInWithKakao = async () => {
  //   const token: KakaoOAuthToken = await kakaoLogin();

  //   mutation.mutate({ token: token.accessToken });
  // };

  return (
    <Container>
      <Logo
        source={require("../../assets/logo.png")} //이미지경로
        resizeMode="cover" // 'cover', 'contain', 'stretch', 'repeat', 'center' 중 선택
      >
        {/* <KakaoButton onPress={signInWithKakao}>
          <KakaoImage source={require("../../assets/kakao_logo.png")} resizeMode="cover" />
          <Title>카카오로 시작하기</Title>
        </KakaoButton> */}
      </Logo>
    </Container>
  );
};

export default KakaoAuth;

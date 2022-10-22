// import { KakaoOAuthToken, login as kakaoLogin } from "@react-native-seoul/kakao-login";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
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

const BtnWrap = styled.View`
  width: 100%;
  height: 48px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 15%;
`;

const JoinButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 48px;
  background-color: #fff;
  margin-right: 25px;
`;

const LoginButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 48px;
  background-color: #ff714b;
`;

const JoinTitle = styled.Text`
  color: #ff714b;
  font-size: 20px;
  font-weight: 700;
`;

const LoginTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
`;

const Main: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate } }) => {
  const goToLogin = () => {
    navigate("LoginStack", {
      screen: "Login",
    });
  };

  const goToJoinStepOne = () => {
    navigate("LoginStack", {
      screen: "JoinStepOne",
    });
  };

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
      <Logo source={require("../../assets/logo.png")} resizeMode="cover">
        <BtnWrap>
          <JoinButton onPress={goToJoinStepOne}>
            <JoinTitle>회원가입</JoinTitle>
          </JoinButton>
          <LoginButton onPress={goToLogin}>
            <LoginTitle>로그인</LoginTitle>
          </LoginButton>
        </BtnWrap>
      </Logo>
    </Container>
  );
};

export default Main;

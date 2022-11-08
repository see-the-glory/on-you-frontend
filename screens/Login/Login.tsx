import { useMutation } from "react-query";
import { CommonApi, LoginRequest } from "../../api";
import { useDispatch } from "react-redux";
import { Login } from "../../store/Actions";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Root from "../../navigation/Root";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text, NativeModules, Alert, Keyboard, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  width: 100%;
  height: 95%;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Wrap = styled.View`
  width: 100%;
`;

const Form = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;

const Title = styled.Text`
  color: #1b1717;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #000000;
  padding-bottom: 5px;
  font-size: 18px;
`;

const View = styled.TouchableOpacity`
  width: 147px;
  margin-top: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #6f6f6f;
`;

const ForgetText = styled.Text`
  color: #6f6f6f;
  font-size: 12px;
`;

const LoginButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #ff714b;
`;

const LoginTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const SignIn: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate } }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const mutation = useMutation(CommonApi.getJWT, {
    onSuccess: (res) => {
      console.log(res.status);
      // redux 저장
      dispatch(Login(res.token));
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(error);
      // Toast Message 출력.
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const signInWithKakao = async () => {
  //   const token: KakaoOAuthToken = await kakaoLogin();

  //   mutation.mutate({ token: token.accessToken });
  // };

  const goToFindLoginInfo = () => {
    navigate("LoginStack", {
      screen: "FindLoginInfo",
    });
  };

  const onSubmit = () => {
    const token = {
      email: email,
      password: password,
    };

    const requestData: LoginRequest = token;

    console.log(requestData);

    mutation.mutate(requestData);
  };

  const goToRoot = () => {
    return <NavigationContainer>{<Root />}</NavigationContainer>;
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <Wrap>
          <Form>
            <Title>아이디</Title>
            <Input placeholder="example@email.com" placeholderTextColor={"#B0B0B0"} onChangeText={(text) => setEmail(text)} />
          </Form>
          <Form>
            <Title>비밀번호</Title>
            <Input secureTextEntry={true} placeholder="비밀번호를 입력해주세요." placeholderTextColor={"#B0B0B0"} onChangeText={(text) => setPassword(text)} />
            <View onPress={goToFindLoginInfo}>
              <ForgetText>로그인 정보가 기억나지 않을때</ForgetText>
            </View>
          </Form>
        </Wrap>
        <Wrap>
          <LoginButton onPress={onSubmit}>
            <LoginTitle>로그인</LoginTitle>
          </LoginButton>
        </Wrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;

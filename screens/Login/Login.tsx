import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 35px;
`;

const Title = styled.Text`
  color: #1b1717;
  font-size: 16px;
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
  height: 38px;
  background-color: #ff714b;
  margin-top: 10%;
`;

const LoginTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const Login: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  const goToFindLoginInfo = () => {
    navigate("LoginStack", {
      screen: "FindLoginInfo",
    });
  };

  return (
    <Container>
      <Form>
        <Title>아이디</Title>
        <Input placeholder="example@email.com" />
      </Form>
      <Form>
        <Title>비밀번호</Title>
        <Input placeholder="비밀번호를 입력해주세요." />
        <View onPress={goToFindLoginInfo}>
          <ForgetText>로그인 정보가 기억나지 않을때</ForgetText>
        </View>
      </Form>
      <LoginButton>
        <LoginTitle>로그인</LoginTitle>
      </LoginButton>
    </Container>
  );
};

export default Login;

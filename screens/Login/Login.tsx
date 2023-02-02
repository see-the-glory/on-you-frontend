import { useMutation, useQuery } from "react-query";
import { CommonApi, LoginRequest, UserApi, UserInfoResponse } from "../../api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/slices/auth";

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
  width: 100%;
  margin-top: 10px;
  padding: 0;
  /* border-bottom-width: 1px;
  border-bottom-color: #6f6f6f; */
`;

const ForgetText = styled.Text`
  width: 100%;
  color: #6f6f6f;
  font-size: 12px;
  text-decoration: underline;
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
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [token, setToken] = useState<string>("");

  useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        dispatch(login({ user: res.data, token }));
      } else {
        console.log(res);
        console.log(`getUserInfo query success but please check status code`);
        toast.show(`유저 정보를 불러올 수 없습니다. (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- getUserInfo Error ---");
      console.log(error);
      toast.show(`유저 정보를 불러올 수 없습니다. (Error Code: ${error})`, {
        type: "warning",
      });
    },
    enabled: token ? true : false,
  });

  const mutation = useMutation(CommonApi.getUserToken, {
    onSuccess: (res) => {
      if (res.status === 200) {
        setToken(res.token);
      } else {
        console.log(`getUserToken mutation success but please check status code`);
        console.log(res);
        toast.show(`로그인에 실패했습니다. (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- getUserToken Error ---");
      console.log(error);
      toast.show(`로그인에 실패했습니다. (Error Code: ${error})`, {
        type: "warning",
      });
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goToFindLoginInfo = () => {
    navigate("LoginStack", {
      screen: "FindLoginInfo",
    });
  };

  const onSubmit = () => {
    const requestData: LoginRequest = {
      email,
      password,
    };

    mutation.mutate(requestData);
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

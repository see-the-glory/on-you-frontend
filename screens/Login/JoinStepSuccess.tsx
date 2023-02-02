import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { CommonApi, LoginRequest, UserApi, UserInfoResponse } from "../../api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/slices/auth";

const Container = styled.View`
  width: 100%;
  height: 95%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Wrap = styled.View`
  width: 100%;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 100%;
  height: 2px;
  background-color: #295af5;
`;

const AskText = styled.Text`
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  margin-top: 24px;
`;

const SubText = styled.Text`
  color: #a0a0a0;
  font-size: 12px;
  margin-top: 7px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
  margin-top: 47px;
  font-size: 18px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: ${(props) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const Error = styled.Text`
  color: #ff714b;
  font-size: 12px;
  margin-top: 7px;
  margin-bottom: 20px;
`;

const JoinStepSuccess: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({
  navigation: { navigate },
  route: {
    params: { email, password, token },
  },
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [userToken, setUserToken] = useState<string>(token ?? "");
  const [go, setGo] = useState<boolean>(false);
  useQuery<UserInfoResponse>(["getUserInfo", userToken], UserApi.getUserInfo, {
    onSuccess: (res) => {
      if (res.status === 200) {
        dispatch(login({ user: res.data, token }));
      } else {
        console.log(`get user info query success but please check status code`);
        console.log(res);
        toast.show(`유저 정보를 불러오지 못했습니다. (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- getUserInfo Error ---");
      console.log(error);
      toast.show(`유저 정보를 불러오지 못했습니다. (Error Code: ${error})`, {
        type: "warning",
      });
    },
    enabled: go,
  });

  const mutation = useMutation(CommonApi.getUserToken, {
    onSuccess: (res) => {
      if (res.status === 200) {
        setUserToken(res.token);
        setGo(true);
      } else {
        console.log(`get user token mutation success but please check status code`);
        console.log(res);
        toast.show(`유저 토큰을 불러오지 못했습니다. (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- getUserToken Error ---");
      console.log(error);
      toast.show(`유저 토큰을 불러오지 못했습니다. (Error Code: ${error})`, {
        type: "warning",
      });
    },
  });

  const onSubmit = () => {
    if (userToken !== "") {
      setGo(true);
      return;
    }
    const requestData: LoginRequest = {
      email,
      password,
    };

    mutation.mutate(requestData);
  };

  return (
    <Container>
      <Wrap>
        <BorderWrap>
          <Border></Border>
        </BorderWrap>
        <AskText>가입이 완료되었습니다.</AskText>
        <SubText>온유에 오신 것을 환영합니다 :&#41;</SubText>
      </Wrap>
      <Wrap>
        <Button onPress={onSubmit}>
          <ButtonTitle>시작하기</ButtonTitle>
        </Button>
      </Wrap>
    </Container>
  );
};

export default JoinStepSuccess;

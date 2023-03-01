import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { CommonApi, LoginRequest, LoginResponse, UserApi, UserInfoResponse } from "../../api";
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

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: ${(props: any) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const JoinStepSuccess: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({
  navigation: { navigate },
  route: {
    params: { email, password, token },
  },
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const mutation = useMutation<LoginResponse, any, LoginRequest>(CommonApi.login, {
    onSuccess: async (res) => {
      if (res.status === 200) {
        const token = res.token;
        console.log(`Login: ${token}`);
        if (token) await dispatch(login({ token }));
      } else if (res.status === 400) {
        toast.show(`아이디와 비밀번호가 잘못되었습니다.`, { type: "warning" });
      } else if (res.status === 500) {
        toast.show(`알 수 없는 오류`, { type: "warning" });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.show(`네트워크를 확인해주세요.`, { type: "warning" });
    },
  });

  const onSubmit = () => {
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

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard, ScrollView, Alert, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import { useMutation } from "react-query";
import { CommonApi, LoginRequest } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "../../store/Actions";
import styled from "styled-components/native";

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

const JoinStepSuccess: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate }, route: { params: name } }) => {
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

  const onSubmit = () => {
    const token = {
      email: name?.email,
      password: name?.password,
    };

    const requestData: LoginRequest = token;

    console.log(requestData);

    mutation.mutate(requestData);
  };

  const goToNext = () => {
    navigate("LoginStack", {
      screen: "Login",
    });
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

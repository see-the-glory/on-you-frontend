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
  background-color: #fff;
  padding-horizontal: 20px;
  padding-top: 50px;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 30%;
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
  height: 40px;
  background-color: #d3d3d3;
  margin-top: 10%;
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const JoinStepThree = () => {
  return (
    <Container>
      <BorderWrap>
        <Border></Border>
      </BorderWrap>
      <AskText>비밀번호를 설정해주세요.</AskText>
      <SubText>로그인 정보로 활용됩니다.</SubText>
      <Input placeholder="영문, 숫자 포함 6자 이상" />
      <Button>
        <ButtonTitle>다음</ButtonTitle>
      </Button>
    </Container>
  );
};

export default JoinStepThree;

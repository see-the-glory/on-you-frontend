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

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 38px;
  background-color: #ff714b;
  margin-top: 10%;
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const FindId: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  return (
    <Container>
      <Form>
        <Title>이름</Title>
        <Input placeholder="홍길동" />
      </Form>
      <Form>
        <Title>등록된 전화번호</Title>
        <Input placeholder="010-1234-1234" />
      </Form>
      <Button>
        <ButtonTitle>확인</ButtonTitle>
      </Button>
    </Container>
  );
};

export default FindId;

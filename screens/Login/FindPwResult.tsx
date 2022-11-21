import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useEffect } from "react";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  height: 90%;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const TextWrap = styled.View`
  width: 100%;
  margin-top: 50%;
`;

const NoticeText = styled.Text`
  color: #000;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 11px;
`;

const EmailText = styled.Text`
  color: #000;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 80px;
`;

const View = styled.TouchableOpacity``;

const PwSettingText = styled.Text`
  color: #000;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  text-decoration: underline;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #ff714b;
  margin-top: 10%;
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const FindPwResult: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  const goToLogin = () => {
    navigate("LoginStack", {
      screen: "Login",
    });
  };

  return (
    <Container>
      <TextWrap>
        <NoticeText>해당 ID의 이메일 주소로</NoticeText>
        <NoticeText>임시 비밀번호를 발급해 드렸습니다.</NoticeText>
      </TextWrap>

      <Button onPress={goToLogin}>
        <ButtonTitle>확인</ButtonTitle>
      </Button>
    </Container>
  );
};

export default FindPwResult;

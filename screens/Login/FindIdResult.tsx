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

const FindIdResult: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate }, route: { params: email } }) => {
  const [userEmail, setUserEmail] = useState(email);

  const goToFindPw = () => {
    navigate("LoginStack", {
      screen: "FindPw",
    });
  };

  const goToLogin = () => {
    navigate("LoginStack", {
      screen: "Login",
    });
  };

  return (
    <Container>
      <TextWrap>
        <NoticeText>해당 정보로 가입된 아이디입니다.</NoticeText>
        <EmailText>{userEmail.email}</EmailText>
        <View onPress={goToFindPw}>
          <PwSettingText>비밀번호 재설정</PwSettingText>
        </View>
      </TextWrap>

      <Button onPress={goToLogin}>
        <ButtonTitle>확인</ButtonTitle>
      </Button>
    </Container>
  );
};

export default FindIdResult;

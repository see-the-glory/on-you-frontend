import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 30px;
`;

const TextWrap = styled.View`
  margin-top: 45%;
`;

const NoticeText = styled(CustomText)`
  color: black;
  font-size: 14px;
  line-height: 20px;
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

const FindPasswordButton = styled.TouchableOpacity``;

const PwSettingText = styled(CustomText)`
  color: #6f6f6f;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  text-decoration: underline;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #ff6534;
  margin-top: 10%;
`;

const ButtonWrap = styled.View`
  width: 100%;
`;

const LoginButton = styled.TouchableOpacity<{ disabled: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: 8px;
  background-color: ${(props: any) => (props.disabled ? "#D3D3D3" : "#ff6534")};
`;

const LoginTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  color: white;
  font-size: 20px;
  line-height: 24px;
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
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <TextWrap>
        <NoticeText>해당 정보로 가입된 아이디입니다.</NoticeText>
        <EmailText>{userEmail?.email}</EmailText>
        <FindPasswordButton onPress={goToFindPw}>
          <PwSettingText>비밀번호 찾기</PwSettingText>
        </FindPasswordButton>
      </TextWrap>

      <ButtonWrap>
        <LoginButton onPress={goToLogin}>
          <LoginTitle>확인</LoginTitle>
        </LoginButton>
      </ButtonWrap>
    </Container>
  );
};

export default FindIdResult;

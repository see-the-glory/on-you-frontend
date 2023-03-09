import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, StatusBar } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const Container = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const BackgroundView = styled.ImageBackground`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ButtonView = styled.View`
  position: absolute;
  bottom: 8%;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const JoinButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 48px;
  background-color: white;
  margin-right: 25px;
`;

const LoginButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 48px;
  background-color: #ff6534;
`;

const JoinTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  color: #ff6534;
  font-size: 20px;
  line-height: 26px;
  font-size: 20px;
`;

const LoginTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  color: white;
  line-height: 26px;
  font-size: 20px;
`;

const Logo = styled.Image`
  height: 120px;
  width: 120px;
`;

const Main: React.FC<NativeStackScreenProps<any, "Main">> = ({ navigation: { navigate } }) => {
  const goToLogin = () => {
    navigate("LoginStack", {
      screen: "Login",
    });
  };

  const goToJoinStepOne = () => {
    navigate("SignUpStack", {
      screen: "JoinStepOne",
    });
  };

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <BackgroundView source={require("../../assets/logo_background.jpg")} resizeMode="cover">
        <Logo source={require("../../assets/logo_icon.png")} />
        <ButtonView>
          <JoinButton onPress={goToJoinStepOne}>
            <JoinTitle>회원가입</JoinTitle>
          </JoinButton>
          <LoginButton onPress={goToLogin}>
            <LoginTitle>로그인</LoginTitle>
          </LoginButton>
        </ButtonView>
      </BackgroundView>
    </Container>
  );
};

export default Main;

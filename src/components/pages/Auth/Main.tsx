import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import { AuthStackParamList } from "@navigation/Auth";

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

const ContentView = styled.View`
  margin-bottom: 240px;
  justify-content: center;
  align-items: center;
`;

const ContentText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontM};
  font-size: 18px;
  margin-bottom: 10px;
`;

const ContentTitle = styled.Text`
  font-family: ${(props) => props.theme.englishSecondaryFontB};
  font-size: 40px;
`;

const ButtonView = styled.View`
  position: absolute;
  bottom: 7%;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableHighlight`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 48px;
  border: 1px white solid;
  border-radius: 30px;
  background-color: black;
`;

const Title = styled.Text<{ color: string }>`
  font-family: ${(props) => props.theme.koreanFontM};
  color: ${(props) => props.color};
  font-size: 20px;
  line-height: 21px;
`;

const Main: React.FC<NativeStackScreenProps<AuthStackParamList, "Main">> = ({ navigation: { navigate } }) => {
  const [signUpColor, setSignUpColor] = useState<string>("white");
  const [loginColor, setLoginColor] = useState<string>("white");

  const goToLogin = () => {
    navigate("LoginStack");
  };

  const goToJoinStepOne = () => {
    navigate("SignUpStack");
  };

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <BackgroundView source={require("@images/main_background.jpg")} resizeMode="cover">
        <ContentView>
          <ContentText>공동체와 함께하는 즐거운 시간</ContentText>
          <ContentTitle>ON YOU</ContentTitle>
        </ContentView>
        <ButtonView>
          <Button onPress={goToJoinStepOne} onPressIn={() => setSignUpColor("black")} onPressOut={() => setSignUpColor("white")} underlayColor="white" style={{ marginRight: 25 }}>
            <Title color={signUpColor}>회원가입</Title>
          </Button>
          <Button onPress={goToLogin} onPressIn={() => setLoginColor("black")} onPressOut={() => setLoginColor("white")} underlayColor="white">
            <Title color={loginColor}>로그인</Title>
          </Button>
        </ButtonView>
      </BackgroundView>
    </Container>
  );
};

export default Main;

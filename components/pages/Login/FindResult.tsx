import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { LoginStackParamList } from "../../../navigation/LoginStack";
import BottomButton from "../../atoms/BottomButton";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const Header = styled.View`
  padding-left: 20px;
  margin-top: 100px;
  margin-bottom: 120px;
`;

const LineView = styled.View`
  height: 1.5px;
  background-color: ${(props: any) => props.theme.infoColor};
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  font-size: 40px;
  line-height: 43px;
`;

const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  color: ${(props: any) => props.theme.infoColor};
  margin-top: 10px;
`;

const Content = styled.View``;

const ContentTitle = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontB};
  font-size: 26px;
`;
const ContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
`;

const ContentSubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  color: ${(props: any) => props.theme.infoColor};
`;

const Button = styled.TouchableOpacity`
  padding-right: 20px;
  align-items: flex-end;
`;

const FindResult: React.FC<NativeStackScreenProps<LoginStackParamList, "FindResult">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { findType, email },
  },
}) => {
  const goToFindPassword = () => {
    navigate("LoginStack", { screen: "FindPassword" });
  };

  const goToLogin = () => {
    navigate("LoginStack", { screen: "Login" });
  };

  useLayoutEffect(() => {
    setOptions({
      title: findType === "Email" ? "E-Mail 찾기" : "비밀번호 찾기",
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [findType]);

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Header>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <HeaderTitle>{findType === "Email" ? "Here is" : "Check"}</HeaderTitle>
          <LineView style={{ width: "100%", marginLeft: 20, marginBottom: 3 }} />
        </View>
        <HeaderTitle>your e-mail</HeaderTitle>
        <HeaderText>{findType === "Email" ? "해당 정보로 가입된 아이디입니다." : "이메일 주소로 임시 비밀번호를\n발급해 드렸습니다."}</HeaderText>
      </Header>
      <Content>
        {findType === "Email" ? (
          <View style={{ paddingLeft: 20 }}>
            <ContentTitle>{email}</ContentTitle>
            <LineView style={{ width: "100%", marginVertical: 10 }} />
            <Button onPress={goToFindPassword}>
              <ContentSubText>{`비밀번호 찾기>`}</ContentSubText>
            </Button>
          </View>
        ) : (
          <View style={{ flexDirection: "row", paddingRight: 20 }}>
            <LineView style={{ flex: 1, marginRight: 20, marginTop: 10 }} />
            <ContentText>{`로그인 후 마이페이지에서\n비밀번호를 변경해주세요.`}</ContentText>
          </View>
        )}
      </Content>
      <BottomButton onPress={goToLogin} title={"로그인으로"} />
    </Container>
  );
};

export default FindResult;

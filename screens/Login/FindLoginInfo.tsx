import { FontAwesome } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StatusBar, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const TopView = styled.View`
  flex: 1;
  padding: 0px 20px;
  justify-content: flex-end;
  margin-bottom: 30px;
`;

const BottomView = styled.View`
  flex: 1;
  padding: 0px 20px;
`;

const TitleView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableHighlight`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 55px;
  border-radius: 30px;
  border-width: 1px;
  border-color: #6b8bf7;
  background-color: #fff;
  margin-bottom: 25px;
`;

const Title = styled.Text`
  font-family: "AppleSDGothicNeoSB";
  line-height: 26px;
  font-size: 22px;
  padding-left: 5px;
`;

const FindLoginInfo: React.FC<NativeStackScreenProps<any, "FindLoginInfo">> = ({ navigation: { navigate } }) => {
  const goToFindId = () => {
    navigate("LoginStack", { screen: "FindId" });
  };

  const goToFindPw = () => {
    navigate("LoginStack", { screen: "FindPw" });
  };

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <TopView>
        <Button onPress={goToFindId} underlayColor="#6B8BF7">
          <TitleView>
            <Title>E-mail 찾기</Title>
          </TitleView>
        </Button>
        <Button onPress={goToFindPw} underlayColor="#6B8BF7">
          <TitleView>
            <Title>비밀번호 찾기</Title>
          </TitleView>
        </Button>
      </TopView>
      <BottomView></BottomView>
    </Container>
  );
};

export default FindLoginInfo;

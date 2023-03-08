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

const IdButton = styled.TouchableHighlight`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 55px;
  border-width: 1px;
  border-color: black;
  background-color: #fff;
`;

const Title = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: 700;
  padding-left: 5px;
`;

const PwButton = styled.TouchableHighlight`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 55px;
  border-width: 1px;
  border-color: black;
  background-color: #fff;
  margin-top: 25px;
`;

const FindLoginInfo: React.FC<NativeStackScreenProps<any, "FindLoginInfo">> = ({ navigation: { navigate } }) => {
  const goToFindId = () => {
    navigate("LoginStack", {
      screen: "FindId",
    });
  };

  const goToFindPw = () => {
    navigate("LoginStack", {
      screen: "FindPw",
    });
  };

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <TopView>
        <IdButton onPress={goToFindId} underlayColor="#ff6534">
          <TitleView>
            <FontAwesome name="user-circle-o" size={15} color="black" />
            <Title>아이디 찾기</Title>
          </TitleView>
        </IdButton>
        <PwButton onPress={goToFindPw} underlayColor="#ff6534">
          <TitleView>
            <FontAwesome name="lock" size={17} color="black" />
            <Title>비밀번호 찾기</Title>
          </TitleView>
        </PwButton>
      </TopView>
      <BottomView></BottomView>
    </Container>
  );
};

export default FindLoginInfo;

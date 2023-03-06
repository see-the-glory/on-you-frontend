import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
`;

const IdButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 53px;
  border-width: 1px;
  border-color: #ff6534;
  background-color: ${(props) => (props.disabled ? "#ffffff" : "#ff6534")};
`;

const IdTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 700;
`;

const PwButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 53px;
  border-width: 1px;
  border-color: #ff6534;
  background-color: #fff;
  margin-top: 10%;
`;

const PwTitle = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: 700;
`;

const FindLoginInfo: React.FC<NativeStackScreenProps<any, "FindLoginInfo">> = ({ navigation: { navigate } }) => {
  const [active, setActive] = useState(false);

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
      <IdButton onPress={goToFindId} onPressIn={() => setActive(true)}>
        <IdTitle>아이디 찾기</IdTitle>
      </IdButton>
      <PwButton onPress={goToFindPw}>
        <PwTitle>비밀번호 찾기</PwTitle>
      </PwButton>
    </Container>
  );
};

export default FindLoginInfo;

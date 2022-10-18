import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  position: relative;
  height: 100%;
`;

const AccTop = styled.View`
  margin-top: 20px;
  top: 20px;
  position: relative;
`;

const AccInfo = styled.View`
  top: 20px;
  margin-top: 10px;
`;

const AccHeader = styled.Text`
  font-size: 25px;
  padding-bottom: 15px;
  position: relative;
`;

const AccTitle = styled.Text`
  text-align: center;
  font-size: 30px;
  top: 20px;
  font-weight: bold;
  color: red;
`;

const AccText = styled.Text`
  font-size: 20px;
  border: 1px solid black;
  padding: 15px;
  color: red;
`;

export default function Accusation({ navigation: { navigate } }) {
  const ReportComplete = () => {
    navigate("HomeStack", {
      screen: "ReportComplete",
    });
  };

  return (
    <Container>
      {/*<AccTitle>신고</AccTitle>*/}
      <View>
        <AccTop>
          <AccHeader>이 게시물을 신고하는 이유</AccHeader>
          <Text>지식재산권 침해를 신고하는 경우를 제외하고 회원님의 신고는 익명으로 처리됩니다. 누군가 위급한 상황에 있다고 생각된다면 즉시 현지 응급 서비스 기관에 연락하시기 바랍니다.</Text>
        </AccTop>
        <AccInfo>
          <TouchableOpacity>
            <AccText onPress={ReportComplete}>스팸</AccText>
          </TouchableOpacity>
          <TouchableOpacity>
            <AccText onPress={ReportComplete}>마음에 들지 않습니다</AccText>
          </TouchableOpacity>
          <TouchableOpacity>
            <AccText onPress={ReportComplete}>사기 또는 거짓</AccText>
          </TouchableOpacity>
          <TouchableOpacity>
            <AccText onPress={ReportComplete}>혐오 발언 또는 상징</AccText>
          </TouchableOpacity>
          <TouchableOpacity>
            <AccText onPress={ReportComplete}>거짓정보</AccText>
          </TouchableOpacity>
        </AccInfo>
      </View>
    </Container>
  );
}

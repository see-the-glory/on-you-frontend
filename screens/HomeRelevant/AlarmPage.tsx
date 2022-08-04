import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  position: relative;
  height: 100%;
  padding: 0 20px 0 20px;
`;

const AlarmArea = styled.View`
  margin-bottom: 15px;
`;

const AlarmHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AlarmType = styled.Text`
  color: darkgray;
  font-size: 12px;
`;

const AlarmTime = styled.Text`
  color: darkgray;
  font-size: 10px;
`;

const AlarmText = styled.Text``;

export default function AlarmPage() {
  return (
    <Container>
      <AlarmArea>
        <AlarmHeader>
          <AlarmType>가입결과</AlarmType>
          <AlarmTime>30분전</AlarmTime>
        </AlarmHeader>
        <View>
          <AlarmText>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>김재광</Text>님의
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>온유프로젝트</Text> 가입 요청이 수락되었습니다.
          </AlarmText>
        </View>
      </AlarmArea>
      <AlarmArea>
        <AlarmHeader>
          <AlarmType>가입결과</AlarmType>
          <AlarmTime>1시간전</AlarmTime>
        </AlarmHeader>
        <View>
          <AlarmText>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>이진규</Text>님의
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>온유프로젝트</Text> 가입 요청이 거절되었습니다.
          </AlarmText>
        </View>
      </AlarmArea>
    </Container>
  );
}

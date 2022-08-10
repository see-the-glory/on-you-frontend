import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  position: relative;
  height: 100%;
  margin: 0 20px 0 20px;
  top: 2%;
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

const AlarmUserName = styled.Text`
  font-weight: bold;
  font-size: 14px;
`;
const AlramUserClub = styled.Text`
  font-weight: bold;
  font-size: 14px;
`;

const AlarmPage = ({ navigation: { navigate } }) => {
  const goToProfile = () => {
    navigate("HomeStack", {
      screen: "Profile",
    });
  };

  const goToReply = () => {
    navigate("HomeStack", {
      screen: "ReplyPage",
    });
  };

  return (
    <Container>
      <AlarmArea>
        <AlarmHeader>
          <AlarmType>가입결과</AlarmType>
          <AlarmTime>30분전</AlarmTime>
        </AlarmHeader>
        <View>
          <AlarmText>
            <AlarmUserName>김재광</AlarmUserName>님의 &nbsp;
            <AlramUserClub onPress={goToReply}>온유프로젝트</AlramUserClub>가입 요청이 수락되었습니다.
          </AlarmText>
        </View>
      </AlarmArea>
      <AlarmArea>
        <AlarmHeader>
          <AlarmType>가입결과</AlarmType>
          <AlarmTime>30분전</AlarmTime>
        </AlarmHeader>
        <View>
          <AlarmText>
            <AlarmUserName>김재광</AlarmUserName>님의 &nbsp;
            <AlramUserClub onPress={goToReply}>온유프로젝트</AlramUserClub>가입 요청이 수락되었습니다.
          </AlarmText>
        </View>
      </AlarmArea>
      <AlarmArea>
        <AlarmHeader>
          <AlarmType>가입결과</AlarmType>
          <AlarmTime>30분전</AlarmTime>
        </AlarmHeader>
        <View>
          <AlarmText>
            <AlarmUserName>김재광</AlarmUserName>님의 &nbsp;
            <AlramUserClub onPress={goToReply}>온유프로젝트</AlramUserClub>가입 요청이 수락되었습니다.
          </AlarmText>
        </View>
      </AlarmArea>
      <AlarmArea>
        <AlarmHeader>
          <AlarmType>가입결과</AlarmType>
          <AlarmTime>30분전</AlarmTime>
        </AlarmHeader>
        <View>
          <AlarmText>
            <AlarmUserName>김재광</AlarmUserName>님의 &nbsp;
            <AlramUserClub onPress={goToReply}>온유프로젝트</AlramUserClub>가입 요청이 수락되었습니다.
          </AlarmText>
        </View>
      </AlarmArea>
    </Container>
  );
};

export default AlarmPage;

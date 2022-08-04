import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  position: relative;
  height: 100%;
`;

const ReportView = styled.View`
  flex: 1;
  align-items: center;
  top: 30%;
`;
const LogoImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  z-index: 1;
`;

const ReportFin = styled.Text`
  font-size: 25px;
  margin-top: 20px;
`;

export default function ReportComplete({ navigation: { navigate } }) {
  return (
    <Container>
      <ReportView>
        <LogoImage source={{ uri: "https://cdn1.iconfinder.com/data/icons/3d-front-color/256/tick-front-color.png" }} />
        <ReportFin>신고가 완료되었습니다. 감사합니다.</ReportFin>
      </ReportView>
    </Container>
  );
}

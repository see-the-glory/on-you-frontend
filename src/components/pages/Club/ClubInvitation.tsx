import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import styled from "styled-components/native";
import { ClubStackParamList } from "@navigation/ClubStack";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ClubInvitation: React.FC<NativeStackScreenProps<ClubStackParamList, "ClubInvitation">> = () => {
  return <Container></Container>;
};

export default ClubInvitation;

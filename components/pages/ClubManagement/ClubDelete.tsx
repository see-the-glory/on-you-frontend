import React from "react";
import styled from "styled-components/native";
import { ClubManagementStackParamList } from "../../../navigation/ClubManagementStack";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ClubDelete: React.FC<NativeStackScreenProps<ClubManagementStackParamList, "ClubDelete">> = () => {
  return <Container></Container>;
};

export default ClubDelete;

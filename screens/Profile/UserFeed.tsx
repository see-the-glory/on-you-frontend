import React, { useState } from "react";
import { StatusBar, Text } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const UserFeed = () => {
  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Text>TEST</Text>
    </Container>
  );
};

export default UserFeed;

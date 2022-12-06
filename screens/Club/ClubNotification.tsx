import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";

const ClubNotification = ({ navigation: { nevigate, goback } }) => {
  return (
    <View>
      <CustomText style={{ fontSize: 25 }}>Notification</CustomText>
    </View>
  );
};

export default ClubNotification;

import React from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";
import CustomText from "./CustomText";

const Container = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
`;

const Button = styled.TouchableOpacity<{ disabled: boolean; color: string }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: ${Platform.OS === "ios" ? 8 : 0}px;
  background-color: ${(props: any) => (props.disabled ? "#D3D3D3" : props.color ?? "#295af5")};
`;

const Title = styled(CustomText)<{ color: string }>`
  font-family: "NotoSansKR-Bold";
  font-size: 20px;
  line-height: 24px;
  color: ${(props: any) => props.color ?? "white"};
`;

interface BottomButtonProps {
  onPress?: any;
  disabled?: boolean;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
}

const BottomButton: React.FC<BottomButtonProps> = ({ onPress, disabled, title, backgroundColor, textColor }) => {
  return (
    <Container>
      <Button onPress={onPress} disabled={disabled} color={backgroundColor}>
        <Title color={textColor}>{title}</Title>
      </Button>
    </Container>
  );
};

export default BottomButton;

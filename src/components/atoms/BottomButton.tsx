import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
`;

const Button = styled.TouchableOpacity<{ disabled?: boolean; color?: string }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: ${Platform.OS === "ios" ? 8 : 0}px;
  background-color: ${(props) => (props.disabled ? "#D3D3D3" : props.color ?? props.theme.primaryColor)};
`;

const Title = styled.Text<{ color?: string }>`
  font-family: ${(props) => props.theme.koreanFontSB};
  font-size: 22px;
  line-height: 25px;
  color: ${(props) => props.color ?? "white"};
`;

interface BottomButtonProps {
  onPress?: any;
  disabled?: boolean;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const BottomButton: React.FC<BottomButtonProps> = ({ onPress, disabled, title, backgroundColor, textColor, contentContainerStyle }) => {
  return (
    <Container style={contentContainerStyle}>
      <Button onPress={() => onPress()} disabled={disabled} color={backgroundColor}>
        <Title color={textColor}>{title}</Title>
      </Button>
    </Container>
  );
};

export default BottomButton;

import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import FastImage from "react-native-fast-image";

const Container = styled.TouchableOpacity<{ size: number; kerning: number; opacity: number }>`
  position: relative;
  justify-content: center;
  align-items: center;
  margin-right: ${(props: any) => props.kerning}px;
  opacity: ${(props: any) => props.opacity};
`;

const BadgeIcon = styled.View<{ size: number }>`
  position: absolute;
  z-index: 2;
  elevation: 2;
  top: ${(props: any) => props.size * 0.58}px;
  right: 0%;
  background-color: white;
  border-radius: ${(props: any) => props.size / 2}px;
  justify-content: center;
  align-items: center;
`;

const Backplate = styled.View<{ size: number }>`
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
  border-radius: ${(props: any) => Math.ceil(props.size / 2)}px;
  justify-content: center;
  align-items: center;
`;

const IconImage = styled(FastImage)<{ size: number }>`
  width: ${(props: any) => props.size - 2}px;
  height: ${(props: any) => props.size - 2}px;
  border-radius: ${(props: any) => Math.ceil(props.size / 2)}px;
  border: 0.2px solid #c4c4c4;
`;

const CircleName = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 11px;
  margin-top: 4px;
`;

interface CircleIconProps {
  size: number;
  uri?: string | null;
  name?: string;
  badge?: "check-circle" | "stars";
  kerning?: number;
  opacity?: number;
  onPress?: () => void;
}

const CircleIcon: React.FC<CircleIconProps> = ({ size, uri, name, badge, kerning, opacity, onPress }) => {
  return (
    <Container size={size} kerning={kerning ?? 0} opacity={opacity ?? 1} activeOpacity={1} onPress={onPress}>
      {badge ? (
        <BadgeIcon size={size}>
          <MaterialIcons name={badge} size={size * 0.4} color="#EC5D56" />
        </BadgeIcon>
      ) : (
        <></>
      )}
      <Backplate size={size}>
        <IconImage source={uri ? { uri: uri } : require("../assets/basic.jpg")} size={size} />
      </Backplate>
      {name ? <CircleName>{name}</CircleName> : <></>}
    </Container>
  );
};

export default CircleIcon;

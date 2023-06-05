import React, { useRef } from "react";
import styled from "styled-components/native";
import FastImage from "react-native-fast-image";
import { Iconify } from "react-native-iconify";
import { Animated } from "react-native";

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
  width: ${(props: any) => props.size * 0.4}px;
  height: ${(props: any) => props.size * 0.4}px;
  background-color: ${(props: any) => props.theme.accentColor};
  border-radius: ${(props: any) => props.size / 2}px;
  border: 1px solid white;
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
  badge?: string | null;
  kerning?: number;
  opacity?: number;
  onPress?: () => void;
}

const CircleIcon: React.FC<CircleIconProps> = ({ size, uri, name, badge, kerning, opacity, onPress }) => {
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const onLoadImage = () => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 150,
      delay: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Container size={size} kerning={kerning ?? 0} opacity={opacity ?? 1} activeOpacity={1} onPress={onPress}>
      <Animated.View style={{ opacity: animatedOpacity, justifyContent: "center", alignItems: "center" }}>
        {["MASTER", "MANAGER"].includes(badge) ? (
          <BadgeIcon size={size}>
            {badge === "MASTER" ? <Iconify icon="ph:star-fill" size={size * 0.23} color="white" /> : <Iconify icon="fluent-mdl2:skype-check" size={size * 0.23} color="white" />}
          </BadgeIcon>
        ) : (
          <></>
        )}
        <Backplate size={size}>
          <IconImage source={uri ? { uri: uri } : require("../assets/basic.jpg")} size={size} onLoad={onLoadImage} />
        </Backplate>
        {name ? <CircleName>{name}</CircleName> : <></>}
      </Animated.View>
    </Container>
  );
};

export default CircleIcon;

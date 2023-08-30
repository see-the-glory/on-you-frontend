import React, { useRef } from "react";
import styled from "styled-components/native";
import FastImage from "react-native-fast-image";
import { Iconify } from "react-native-iconify";
import { Animated } from "react-native";

const Container = styled.TouchableOpacity<{ size: number; kerning: number; opacity: number }>`
  position: relative;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.kerning}px;
  opacity: ${(props) => props.opacity};
`;

const BadgeIcon = styled.View<{ size: number }>`
  position: absolute;
  z-index: 2;
  elevation: 2;
  top: ${(props) => props.size * 0.58}px;
  right: 0%;
  width: ${(props) => props.size * 0.4}px;
  height: ${(props) => props.size * 0.4}px;
  background-color: ${(props) => props.theme.accentColor};
  border-radius: ${(props) => props.size / 2}px;
  border: 1px solid white;
  justify-content: center;
  align-items: center;
`;

const Backplate = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  justify-content: center;
  align-items: center;
  background-color: #e3e3e3;
`;

const IconImage = styled(FastImage)<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  border: 0.2px solid #c4c4c4;
`;

const CircleName = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
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

const AnimatedBadgeIcon = Animated.createAnimatedComponent(BadgeIcon);

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
      {["MASTER", "MANAGER"].includes(badge ?? "") ? (
        <AnimatedBadgeIcon size={size} style={{ opacity: animatedOpacity }}>
          {badge === "MASTER" ? <Iconify icon="ph:star-fill" size={size * 0.23} color="white" /> : <Iconify icon="fluent-mdl2:skype-check" size={size * 0.23} color="white" />}
        </AnimatedBadgeIcon>
      ) : (
        <></>
      )}

      <Backplate size={size}>
        <Animated.View style={{ opacity: animatedOpacity, justifyContent: "center", alignItems: "center" }}>
          <IconImage source={{ uri: uri ?? undefined }} size={size} onLoad={onLoadImage} />
        </Animated.View>
      </Backplate>
      {name ? <CircleName>{name}</CircleName> : <></>}
    </Container>
  );
};

export default CircleIcon;

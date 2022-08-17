import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";
import { ClubHomeFloatingButtonProps } from "../Types/Club";

const FloatingActionView = styled.View`
  position: absolute;
  align-items: center;
  z-index: 2;
  right: 20px;
  bottom: 20px;
  height: -100px;
`;

const FloatingMainButton = styled.TouchableOpacity<{ join?: boolean }>`
  width: 50px;
  height: 50px;
  background-color: ${(props) => (props.join ? "#295af5" : "#ff714b")};
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: white;
`;

const FloatingButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  background-color: white;
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const AnimatedFloatingMainButton = Animated.createAnimatedComponent(FloatingMainButton);
const AnimatedFloatingButton = Animated.createAnimatedComponent(FloatingButton);

const FloatingActionButton: React.FC<ClubHomeFloatingButtonProps> = ({ role, applyStatus, onPressEdit, onPressJoin }) => {
  const [open, setOpen] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });
  const firstY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -15],
  });
  const secondY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, -25],
  });
  const fade = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const toggleMenu = () => {
    Animated.spring(animation, {
      toValue: open,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setOpen((open + 1) % 2);
  };

  return role ? (
    <FloatingActionView>
      <AnimatedFloatingButton style={{ opacity: fade, transform: [{ translateY: secondY }] }}>
        <MaterialCommunityIcons name="image-plus" size={18} color="#ff714b" />
      </AnimatedFloatingButton>
      <AnimatedFloatingButton
        onPress={() => {
          onPressEdit();
        }}
        style={{ opacity: fade, transform: [{ translateY: firstY }] }}
      >
        <MaterialCommunityIcons name="pencil-outline" size={18} color="#ff714b" />
      </AnimatedFloatingButton>
      <AnimatedFloatingMainButton onPress={toggleMenu} activeOpacity={1} style={{ transform: [{ rotate: rotation }] }}>
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </AnimatedFloatingMainButton>
    </FloatingActionView>
  ) : (
    <FloatingActionView>
      <FloatingMainButton
        onPress={() => {
          onPressJoin();
        }}
        join={true}
      >
        <MaterialIcons name="group-add" size={28} color="whitesmoke" />
      </FloatingMainButton>
    </FloatingActionView>
  );
};

export default FloatingActionButton;

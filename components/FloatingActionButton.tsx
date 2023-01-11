import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";
import { ClubHomeFloatingButtonProps } from "../Types/Club";
import { Item } from "react-native-paper/lib/typescript/components/List/List";

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

const FloatingActionButton: React.FC<ClubHomeFloatingButtonProps> = ({ role, recruitStatus, onPressEdit, onPressJoin }) => {
  const [open, setOpen] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });
  const fade = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const onPressImagePlus = () => {
    console.log("onPress Feed Creation");
  };
  const onPressPencilOutline = () => {
    toggleMenu();
    onPressEdit();
  };
  const toggleItem = [
    {
      iconName: "image-plus",
      accessRole: ["MASTER", "MANAGER", "MEMBER"],
      onPress: onPressImagePlus,
    },
    {
      iconName: "pencil-outline",
      accessRole: ["MASTER", "MANAGER"],
      onPress: onPressPencilOutline,
    },
  ];

  const toggleMenu = () => {
    Animated.spring(animation, {
      toValue: open,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setOpen((open + 1) % 2);
  };

  return role && role !== "PENDING" ? (
    <FloatingActionView>
      {toggleItem
        .filter((item) => item.accessRole.includes(role))
        .map((item, index, items) => (
          <Animated.View
            key={index}
            style={{
              opacity: fade,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, -(items.length * 10 + 5) + index * 10],
                  }),
                },
              ],
            }}
          >
            <FloatingButton onPress={item.onPress}>
              <MaterialCommunityIcons name={item.iconName} size={18} color="#ff714b" />
            </FloatingButton>
          </Animated.View>
        ))}
      <AnimatedFloatingMainButton onPress={toggleMenu} activeOpacity={1} style={{ transform: [{ rotate: rotation }] }}>
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </AnimatedFloatingMainButton>
    </FloatingActionView>
  ) : recruitStatus?.toUpperCase() === "OPEN" ? (
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
  ) : (
    <></>
  );
};

export default FloatingActionButton;

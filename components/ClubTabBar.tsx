import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import React from "react";
import styled from "styled-components/native";
import CustomText from "./CustomText";

const TabBarContainer = styled.View<{ height: number }>`
  width: 100%;
  background-color: white;
  flex-direction: row;
  align-items: center;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-top-color: rgba(0, 0, 0, 0.2);
  border-bottom-color: rgba(0, 0, 0, 0.2);
`;

const TabButton = styled.TouchableOpacity<{ isFocused: boolean; height: number }>`
  flex: 1;
  height: ${(props: any) => props.height}px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: ${(props: any) => (props.isFocused ? "black" : "transparent")};
`;

const TextWrap = styled.View<{ height: number }>`
  height: ${(props: any) => props.height}px;
  justify-content: center;
`;

const TabText = styled(CustomText)<{ isFocused: boolean }>`
  font-size: 14px;
  ${(props: any) => (props.isFocused ? "font-family: NotoSansKR-Medium" : "")};
  color: ${(props: any) => (props.isFocused ? "black" : "gray")};
`;

const TAP_TAP_HEIGHT = 46;

const ClubTabBar: React.FC<MaterialTopTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <TabBarContainer height={TAP_TAP_HEIGHT}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        return (
          <TabButton
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            height={TAP_TAP_HEIGHT}
            isFocused={isFocused}
          >
            <TextWrap height={TAP_TAP_HEIGHT}>
              <TabText isFocused={isFocused}>{label}</TabText>
            </TextWrap>
          </TabButton>
        );
      })}
    </TabBarContainer>
  );
};

export default ClubTabBar;

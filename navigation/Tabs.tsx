import React, { useEffect, useState } from "react";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import Search from "../screens/Search";
import Home from "../screens/Home";
import Clubs from "../screens/Clubs";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated, Dimensions } from "react-native";
import { MainBottomTabParamList } from "../types/club";

const Container = styled.View`
  height: 60px;
`;

const TabBarContainer = styled.View`
  position: absolute;
  bottom: 0px;
  flex-direction: row;
  width: 100%;
  height: 60px;
  justify-content: space-around;
  align-items: center;
  background-color: white;
`;

const ShadowBox = styled.View`
  position: absolute;
  width: 100%;
  height: 60px;
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
`;

const SlidingTabContainer = styled.View<{ tabWidth: number }>`
  position: absolute;
  width: ${(props) => props.tabWidth + "px"};
  left: 0;
  align-items: center;
  box-shadow: 1px 1px 3px gray;
`;

const SlidingTab = styled.View`
  width: 100px;
  height: 100px;
  bottom: 12px;
  border-radius: 50px;
  background-color: white;
`;

const IconButton = styled.TouchableOpacity`
  align-items: center;
`;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_WIDTH = SCREEN_WIDTH / 4;
const AnimatedTab = Animated.createAnimatedComponent(SlidingTab);

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const [translateX] = useState(new Animated.Value(0));

  const translateTab = (index: number) => {
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    translateTab(state.index);
  }, [state.index]);

  return (
    <>
      <Container>
        <ShadowBox />
        <SlidingTabContainer tabWidth={TAB_WIDTH}>
          <AnimatedTab style={{ transform: [{ translateX }] }} />
        </SlidingTabContainer>
        <TabBarContainer>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];

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
              <IconButton
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
              >
                <Ionicons
                  name={
                    isFocused
                      ? route.params.activeIcon
                      : route.params.inActiveIcon
                  }
                  size={24}
                  color={isFocused ? "black" : "gray"}
                />
              </IconButton>
            );
          })}
        </TabBarContainer>
      </Container>
    </>
  );
};

const Tabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    sceneContainerStyle={{ backgroundColor: "white" }}
    screenOptions={{ tabBarShowLabel: false, headerShown: true }}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      initialParams={{ activeIcon: "home", inActiveIcon: "home-outline" }}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="Search"
      component={Search}
      initialParams={{ activeIcon: "search", inActiveIcon: "search-outline" }}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="Clubs"
      component={Clubs}
      initialParams={{ activeIcon: "grid", inActiveIcon: "grid-outline" }}
      options={{}}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      initialParams={{ activeIcon: "person", inActiveIcon: "person-outline" }}
      options={{}}
    />
  </Tab.Navigator>
);

export default Tabs;

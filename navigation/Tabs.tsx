import React, { useEffect, useRef } from "react";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Clubs from "../screens/Clubs";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated, useWindowDimensions, View } from "react-native";
import { MainBottomTabParamList } from "../Types/Club";
import { Shadow } from "react-native-shadow-2";

const Container = styled.View`
  height: 70px;
`;

const TabBarContainer = styled.View`
  position: absolute;
  bottom: 0px;
  flex-direction: row;
  width: 100%;
  height: 70px;
  justify-content: space-around;
  align-items: center;
  background-color: white;
`;

const ShadowBox = styled.View`
  position: absolute;
  width: 100%;
  height: 70px;
  background-color: white;
  box-shadow: 1px 1px 3px gray;
`;

const SlidingTabContainer = styled.View<{ tabWidth: number }>`
  position: absolute;
  width: ${(props: any) => props.tabWidth}px;
  left: 0;
  align-items: center;
  box-shadow: 1px 1px 3px gray;
`;

const Circle = styled.View<{ tabWidth: number }>`
  width: ${(props: any) => props.tabWidth * 1.8}px;
  height: ${(props: any) => props.tabWidth * 1.9}px;
  bottom: 18px;
  border-radius: ${(props: any) => props.tabWidth}px;
  background-color: white;
`;

const IconButton = styled.TouchableOpacity`
  align-items: center;
`;

const SlidingTab = Animated.createAnimatedComponent(View);
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const TAB_WIDTH = SCREEN_WIDTH / 3;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateTab = (index: number) => {
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      restSpeedThreshold: 5,
    }).start();
  };

  useEffect(() => {
    translateTab(state.index);
  }, [state.index, SCREEN_WIDTH]);

  return (
    <>
      <Container>
        <Shadow distance={3}>
          <ShadowBox />
        </Shadow>
        <SlidingTabContainer tabWidth={TAB_WIDTH}>
          <SlidingTab style={{ transform: [{ translateX }] }}>
            <Shadow distance={3} offset={[0, -18]} style={{ borderRadius: TAB_WIDTH }}>
              <Circle tabWidth={TAB_WIDTH} />
            </Shadow>
          </SlidingTab>
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
              <IconButton key={index} accessibilityRole="button" accessibilityState={isFocused ? { selected: true } : {}} accessibilityLabel={options.tabBarAccessibilityLabel} onPress={onPress}>
                <AnimatedIcon name={isFocused ? route.params.activeIcon : route.params.inActiveIcon} size={24} color={isFocused ? "black" : "gray"} style={{ bottom: 6, padding: 10 }} />
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
    screenOptions={{ tabBarShowLabel: false, headerShown: false }}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Home" component={Home} initialParams={{ activeIcon: "home", inActiveIcon: "home-outline" }} options={{ headerShown: false }} />
    <Tab.Screen name="Clubs" component={Clubs} initialParams={{ activeIcon: "grid", inActiveIcon: "grid-outline" }} options={{}} />
    <Tab.Screen name="Profile" component={Profile} initialParams={{ activeIcon: "person", inActiveIcon: "person-outline" }} options={{}} />
  </Tab.Navigator>
);

export default Tabs;

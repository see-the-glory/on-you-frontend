import React, { useEffect, useRef } from "react";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Clubs from "../screens/Clubs";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated, DeviceEventEmitter, Platform, useWindowDimensions, View } from "react-native";
import { MainBottomTabParamList } from "../Types/Club";
import { Shadow } from "react-native-shadow-2";
import Profile from "../screens/Profile/Profile";
import { Iconify } from "react-native-iconify";
import { lightTheme } from "../theme";

const Container = styled.View<{ height: number }>`
  height: ${(props: any) => props.height}px;
`;

const TabBarContainer = styled.View<{ height: number }>`
  position: absolute;
  bottom: 0px;
  flex-direction: row;
  width: 100%;
  height: ${(props: any) => props.height}px;
  justify-content: space-around;
  align-items: center;
  background-color: white;
`;

const ShadowBox = styled.View<{ height: number }>`
  position: absolute;
  width: 100%;
  height: ${(props: any) => props.height}px;
  background-color: white;
  box-shadow: 0px 9px 6px gray;
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
  bottom: ${Platform.OS === "ios" ? 18 : 16}px;
  border-radius: ${(props: any) => props.tabWidth}px;
  background-color: white;
`;

const IconButton = styled.TouchableOpacity<{ tabPaddingBottom: number }>`
  align-items: center;
  padding-top: 5px;
  padding-bottom: ${(props: any) => props.tabPaddingBottom}px;
`;

const IconName = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: ${(props: any) => props.theme.primaryColor};
  font-size: 11px;
  margin-top: 2px;
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
  const tabHeight = Platform.OS === "ios" ? 80 : 65;
  const tabPaddingBottom = Platform.OS === "ios" ? 20 : 10;

  useEffect(() => {
    translateTab(state.index);
  }, [state.index, SCREEN_WIDTH]);

  return (
    <>
      <Container height={tabHeight}>
        <Shadow distance={1}>
          <ShadowBox height={tabHeight} />
        </Shadow>
        {/* <SlidingTabContainer tabWidth={TAB_WIDTH}>
          <SlidingTab style={{ transform: [{ translateX }] }}>
            <Shadow distance={3} offset={[0, -18]} style={{ borderRadius: TAB_WIDTH }}>
              <Circle tabWidth={TAB_WIDTH} />
            </Shadow>
          </SlidingTab>
        </SlidingTabContainer> */}
        <TabBarContainer height={tabHeight}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (isFocused && route.name === "Home") DeviceEventEmitter.emit("HomeFeedScrollToTop");
              if (isFocused && route.name === "Find") DeviceEventEmitter.emit("ClubListScrollToTop");

              if (!isFocused && !event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({ name: route.name, merge: true });
              }
            };

            return (
              <IconButton
                key={index}
                tabPaddingBottom={tabPaddingBottom}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
              >
                {(() => {
                  switch (route.name) {
                    case "Home":
                      return isFocused ? <Iconify icon="fluent:home-32-regular" size={28} color={lightTheme.primaryColor} /> : <Iconify icon="fluent:home-32-regular" size={28} color="#9C9C9C" />;
                    case "Find":
                      return isFocused ? <Iconify icon="ph:list-magnifying-glass" size={30} color={lightTheme.primaryColor} /> : <Iconify icon="ph:list-magnifying-glass" size={30} color="#9C9C9C" />;
                    case "Chat":
                      return <Iconify icon="ph:chat-circle-text" size={32} color={lightTheme.primaryColor} />;
                    case "My":
                      return isFocused ? <Iconify icon="prime:user" size={32} color={lightTheme.primaryColor} /> : <Iconify icon="prime:user" size={32} color="#9C9C9C" />;
                    default:
                      return null;
                  }
                })()}
                <IconName style={{ opacity: isFocused ? 1 : 0 }}>{route.name}</IconName>
                {/* <AnimatedIcon
                  name={isFocused ? route.params.activeIcon : route.params.inActiveIcon}
                  size={24}
                  color={isFocused ? "black" : "gray"}
                  style={{ bottom: Platform.OS === "ios" ? 6 : 0, padding: 10 }}
                /> */}
              </IconButton>
            );
          })}
        </TabBarContainer>
      </Container>
    </>
  );
};

const Tabs = ({ route, navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      sceneContainerStyle={{ backgroundColor: "white" }}
      screenOptions={{ tabBarShowLabel: false, headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} initialParams={{}} options={{ headerShown: false }} />
      <Tab.Screen name="Find" component={Clubs} initialParams={{}} options={{}} />
      <Tab.Screen name="My" component={Profile} initialParams={{}} options={{}} />
    </Tab.Navigator>
  );
};

export default Tabs;

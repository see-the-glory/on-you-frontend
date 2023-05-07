import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Animated } from "react-native";
import FastImage from "react-native-fast-image";
import CircleIcon from "./CircleIcon";
import { Entypo, Ionicons } from "@expo/vector-icons";

const NavigationView = styled.SafeAreaView<{ height: number }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: ${(props: any) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 16px;
`;

const LeftNavigationView = styled.View`
  flex-direction: row;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
`;

const Header = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const FilterView = styled.View`
  flex: 1;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
`;
const InformationView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;

const CollapsedNameView = styled.View`
  align-items: center;
`;

const CollapsedNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 18px;
  line-height: 22px;
  color: #2b2b2b;
`;

const NameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 22px;
  color: white;
  margin: 10px 0px;
`;

const OptionView = styled.View`
  flex-direction: row;
`;
const OptionButton = styled.TouchableOpacity`
  background-color: transparent;
  padding: 5px 20px;
  border: 1px solid white;
  border-radius: 30px;
  margin: 0px 5px;
`;
const OptionText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  color: white;
`;

const CollapsedView = styled.SafeAreaView<{ height: number }>`
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height}px;
`;

// ClubHome Header
export interface ProfileHeaderProps {
  heightExpanded: number;
  heightCollapsed: number;
  scrollY: Animated.Value;
  headerDiff: number;
  headerHeight: number;
  tabBarHeight: number;
  goToPreferences: () => void;
  goToEditProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ headerHeight, heightExpanded, heightCollapsed, headerDiff, tabBarHeight, scrollY, goToPreferences, goToEditProfile }) => {
  const fadeIn = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [-3, 1],
  });

  const fadeOut = scrollY.interpolate({
    inputRange: [0, headerDiff / 2, headerDiff],
    outputRange: [1, 0, 0],
  });

  return (
    <>
      <NavigationView height={headerHeight}>
        <LeftNavigationView>
          <TouchableOpacity>
            <Animated.View style={{ position: "absolute" }}>
              <Entypo name="chevron-thin-left" size={20} color="white" />
            </Animated.View>
            <Animated.View style={{ opacity: fadeIn }}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </Animated.View>
          </TouchableOpacity>
        </LeftNavigationView>
        <RightNavigationView>
          <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 1 }}>
            <Animated.View style={{ position: "absolute", paddingLeft: 10, paddingRight: 1 }}>
              <Ionicons name="ellipsis-vertical-sharp" size={22} color="white" />
            </Animated.View>
            <Animated.View style={{ opacity: fadeIn }}>
              <Ionicons name="ellipsis-vertical-sharp" size={22} color="black" />
            </Animated.View>
          </TouchableOpacity>
        </RightNavigationView>
      </NavigationView>
      <Header>
        <FastImage style={{ width: "100%", height: heightExpanded + tabBarHeight }} source={require("../assets/basic.jpg")}>
          <Animated.View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 2,
              height: heightExpanded,
              opacity: fadeIn,
              justifyContent: "flex-start",
              backgroundColor: "white",
            }}
          >
            <CollapsedView height={heightCollapsed}>
              <CollapsedNameView>
                <CollapsedNameText>{"Name"}</CollapsedNameText>
              </CollapsedNameView>
            </CollapsedView>
          </Animated.View>

          <FilterView>
            <Animated.View style={{ opacity: fadeOut, width: "75%" }}>
              <InformationView>
                <CircleIcon size={100} />
                <NameText>{"Name"}</NameText>
                <OptionView>
                  <OptionButton onPress={goToEditProfile}>
                    <OptionText>{"프로필 수정"}</OptionText>
                  </OptionButton>
                  <OptionButton onPress={goToPreferences}>
                    <OptionText>{"내 정보 설정"}</OptionText>
                  </OptionButton>
                </OptionView>
              </InformationView>
            </Animated.View>
          </FilterView>
        </FastImage>
      </Header>
    </>
  );
};

export default ProfileHeader;

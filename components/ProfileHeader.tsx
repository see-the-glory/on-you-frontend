import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Animated } from "react-native";
import FastImage from "react-native-fast-image";
import CircleIcon from "./CircleIcon";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Profile } from "../api";
import { useNavigation } from "@react-navigation/native";

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
const InfoView = styled.View`
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
  margin: 13px 0px;
`;

const InfoDetailView = styled.View`
  flex-direction: row;
`;
const InfoDetailItem = styled.View`
  flex-direction: row;
  margin: 0px 5px;
`;
const InfoDetailText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: white;
  margin: 0px 5px;
`;
const InfoDetailNumber = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: ${(props: any) => props.theme.secondaryColor};
`;

const OptionView = styled.View`
  flex-direction: row;
`;
const OptionButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.15);
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
  isMe: boolean;
  profile?: Profile;
  heightExpanded: number;
  heightCollapsed: number;
  scrollY: Animated.Value;
  headerDiff: number;
  headerHeight: number;
  tabBarHeight: number;
  goToPreferences: () => void;
  goToEditProfile: () => void;
  openOptionModal: () => void;
  openShareProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isMe,
  profile,
  headerHeight,
  heightExpanded,
  heightCollapsed,
  headerDiff,
  tabBarHeight,
  scrollY,
  goToPreferences,
  goToEditProfile,
  openOptionModal,
  openShareProfile,
}) => {
  const navigation = useNavigation();
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
          <TouchableOpacity onPress={navigation.goBack}>
            <Animated.View style={{ position: "absolute" }}>
              <Entypo name="chevron-thin-left" size={20} color="white" />
            </Animated.View>
            <Animated.View style={{ opacity: fadeIn }}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </Animated.View>
          </TouchableOpacity>
        </LeftNavigationView>
        <RightNavigationView>
          {isMe ? (
            <TouchableOpacity onPress={openShareProfile} style={{ paddingLeft: 10, paddingRight: 1 }}>
              <Animated.View style={{ position: "absolute", left: 10, paddingRight: 1 }}>
                <Ionicons name="share-social-outline" size={22} color="white" />
              </Animated.View>
              <Animated.View style={{ opacity: fadeIn }}>
                <Ionicons name="share-social-outline" size={22} color="black" />
              </Animated.View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={openOptionModal} style={{ paddingLeft: 10, paddingRight: 1 }}>
              <Animated.View style={{ position: "absolute", left: 10, paddingRight: 1 }}>
                <Ionicons name="ellipsis-vertical-sharp" size={22} color="white" />
              </Animated.View>
              <Animated.View style={{ opacity: fadeIn }}>
                <Ionicons name="ellipsis-vertical-sharp" size={22} color="black" />
              </Animated.View>
            </TouchableOpacity>
          )}
        </RightNavigationView>
      </NavigationView>
      <Header>
        <FastImage style={{ width: "100%", height: heightExpanded + tabBarHeight }} source={profile?.backgroundImage ? { uri: profile?.backgroundImage } : require("../assets/basic.jpg")}>
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
                <CollapsedNameText>{profile?.name ?? "이름"}</CollapsedNameText>
              </CollapsedNameView>
            </CollapsedView>
          </Animated.View>

          <FilterView>
            <Animated.View style={{ opacity: fadeOut, width: "75%" }}>
              <InfoView>
                <CircleIcon size={100} uri={profile?.thumbnail} />
                <NameText>{profile?.name}</NameText>
                {isMe ? (
                  <OptionView>
                    <OptionButton onPress={goToEditProfile}>
                      <OptionText>{"프로필 수정"}</OptionText>
                    </OptionButton>
                    <OptionButton onPress={goToPreferences}>
                      <OptionText>{"내 정보 설정"}</OptionText>
                    </OptionButton>
                  </OptionView>
                ) : (
                  <InfoDetailView>
                    <InfoDetailItem>
                      <InfoDetailText>{"가입 모임"}</InfoDetailText>
                      <InfoDetailNumber>{profile?.clubs.length}</InfoDetailNumber>
                    </InfoDetailItem>
                    {/* <InfoDetailItem>
                    <InfoDetailText>{"작성 피드"}</InfoDetailText>
                    <InfoDetailNumber>{profile?.clubs.length}</InfoDetailNumber>
                  </InfoDetailItem> */}
                  </InfoDetailView>
                )}
              </InfoView>
            </Animated.View>
          </FilterView>
        </FastImage>
      </Header>
    </>
  );
};

export default ProfileHeader;

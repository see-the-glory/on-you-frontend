import React from "react";
import { ImageBackground, Platform, StatusBar, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated } from "react-native";
import { BlurView } from "expo-blur";
import { ClubHomeHaederProps } from "../Types/Club";

const Header = styled.View`
  width: 100%;
  justify-content: center;
  z-index: 2;
  align-items: center;
`;

const FilterView = styled.View`
  flex: 1;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  padding-top: 30px;
  justify-content: center;
  align-items: center;
`;
const InformationView = styled.View`
  justify-content: center;
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 5px;
`;

const CategoryBox = styled.View`
  background-color: rgba(255, 255, 255, 0.6);
  padding: 3px;
  border-radius: 5px;
  margin-left: 3px;
  margin-right: 3px;
`;

const ClubNameView = styled.View`
  align-items: center;
  margin-bottom: 5px;
`;

const ClubNameText = styled.Text`
  color: white;
  font-size: 28px;
  font-weight: 800;
`;

const ClubShortDescView = styled.View`
  align-items: center;
`;
const ClubShortDescText = styled.Text`
  color: white;
`;

const Break = styled.View`
  margin-bottom: 8px;
  margin-top: 8px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.5);
`;

const DetailInfoView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailInfoContent = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: #295af5;
  padding: 5px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 25px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 800;
`;

const CollapsedView = styled.View<{ top: number }>`
  top: ${(props) => props.top}px;
`;

const ContentText = styled.Text`
  color: white;
`;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedFadeOutBox = Animated.createAnimatedComponent(View);

const ClubHeader: React.FC<ClubHomeHaederProps> = ({ imageURI, name, shortDesc, categories, recruitStatus, heightExpanded, heightCollapsed, headerDiff, scrollY }) => {
  const fadeIn = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [-1, 1],
  });

  const fadeOut = scrollY.interpolate({
    inputRange: [0, headerDiff / 2, headerDiff],
    outputRange: [1, 0, 0],
  });

  return (
    <Header>
      <ImageBackground style={{ width: "100%", height: heightExpanded }} source={imageURI === null ? require("../assets/basic.jpg") : { uri: imageURI }} height={heightExpanded}>
        <AnimatedBlurView
          intensity={70}
          tint="dark"
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 2,
            height: heightExpanded,
            opacity: fadeIn,
            justifyContent: "flex-start",
          }}
        >
          <CollapsedView top={Platform.OS === "ios" ? 40 : 40 - (StatusBar.currentHeight ?? 0)}>
            <ClubNameView>
              <ClubNameText>{name}</ClubNameText>
            </ClubNameView>
            <ClubShortDescView>
              <ClubShortDescText>{shortDesc}</ClubShortDescText>
            </ClubShortDescView>
          </CollapsedView>
        </AnimatedBlurView>

        <FilterView>
          <AnimatedFadeOutBox style={{ opacity: fadeOut }}>
            <InformationView>
              <CategoryView>
                {categories[0] ? (
                  <CategoryBox>
                    <Text>{categories[0].name}</Text>
                  </CategoryBox>
                ) : (
                  <></>
                )}
                {categories[1] ? (
                  <CategoryBox>
                    <Text>{categories[1].name}</Text>
                  </CategoryBox>
                ) : (
                  <></>
                )}
              </CategoryView>
              <ClubNameView>
                <ClubNameText>{name}</ClubNameText>
              </ClubNameView>
              <ClubShortDescView>
                <ClubShortDescText>{shortDesc}</ClubShortDescText>
              </ClubShortDescView>
              <Break></Break>
              <DetailInfoView>
                <DetailInfoContent>
                  <Ionicons name="calendar" size={14} color="yellow" style={{ marginRight: 5 }} />
                  <ContentText>May 7 | 14:00 PM</ContentText>
                </DetailInfoContent>
                <DetailInfoContent>
                  <Ionicons name="md-person-circle-outline" size={14} color="yellow" style={{ marginRight: 5 }} />
                  {recruitStatus.toUpperCase() === "RECRUIT" ? <ContentText>멤버 모집 중!</ContentText> : <ContentText>멤버 모집 기간 아님</ContentText>}
                </DetailInfoContent>
              </DetailInfoView>
            </InformationView>
          </AnimatedFadeOutBox>
        </FilterView>
      </ImageBackground>
    </Header>
  );
};

export default ClubHeader;

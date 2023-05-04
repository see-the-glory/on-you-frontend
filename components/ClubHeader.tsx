import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated } from "react-native";
import { BlurView } from "expo-blur";
import FastImage from "react-native-fast-image";
import { Club } from "../api";
import CircleIcon from "./CircleIcon";
import Tag from "./Tag";

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
  padding-top: 70px;
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

const ClubNameView = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

const ClubNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 28px;
  line-height: 33px;
  color: white;
`;

const ClubShortDescView = styled.View`
  align-items: center;
`;
const ClubShortDescText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 14px;
  line-height: 15px;
  color: white;
`;

const Break = styled.View`
  margin: 10px 0px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.5);
`;

const DetailInfoView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailInfoItem = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
`;

const DetailItemTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 9px;
  color: ${(props: any) => props.theme.secondaryColor};
  margin-right: 3px;
`;

const DetailItemText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 10px;
  color: white;
`;

const CollapsedView = styled.SafeAreaView<{ height: number }>`
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height}px;
`;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedFadeOutBox = Animated.createAnimatedComponent(View);

// ClubHome Header
export interface ClubHomeHaederProps {
  clubData: Club;
  heightExpanded: number;
  heightCollapsed: number;
  scrollY: Animated.Value;
  headerDiff: number;
}

const ClubHeader: React.FC<ClubHomeHaederProps> = ({ clubData, heightExpanded, heightCollapsed, headerDiff, scrollY }) => {
  const master = clubData.members?.find((member) => member.role === "MASTER");
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
      <FastImage style={{ width: "100%", height: heightExpanded }} source={clubData.thumbnail ? { uri: clubData.thumbnail } : require("../assets/basic.jpg")}>
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
          <CollapsedView height={heightCollapsed}>
            <ClubNameView>
              <ClubNameText>{clubData.name}</ClubNameText>
            </ClubNameView>
            <ClubShortDescView>
              <ClubShortDescText>{clubData.clubShortDesc}</ClubShortDescText>
            </ClubShortDescView>
          </CollapsedView>
        </AnimatedBlurView>

        <FilterView>
          <AnimatedFadeOutBox style={{ opacity: fadeOut, width: "75%" }}>
            <InformationView>
              <CategoryView>
                {clubData.categories?.map((category, index) => (
                  <Tag key={`category_${index}`} name={category.name} backgroundColor={"rgba(255, 255, 255, 0.5)"} textColor={"black"} />
                ))}
              </CategoryView>
              <ClubNameView>
                <ClubNameText>{clubData.name}</ClubNameText>
              </ClubNameView>
              <ClubShortDescView>
                <ClubShortDescText>{clubData.clubShortDesc}</ClubShortDescText>
              </ClubShortDescView>
              <Break />
              <DetailInfoView>
                <DetailInfoItem>
                  <MaterialIcons name="star" size={15} color="#FADF7D" style={{ marginRight: 2 }} />
                  <DetailItemTitle>{`호스트`}</DetailItemTitle>
                  {master ? (
                    <>
                      <CircleIcon size={16} uri={master.thumbnail} kerning={3} />
                      <DetailItemText>{master.name}</DetailItemText>
                    </>
                  ) : (
                    <DetailItemText>{`없음`}</DetailItemText>
                  )}
                </DetailInfoItem>
                <DetailInfoItem>
                  <MaterialIcons name="people" size={15} color="#FADF7D" style={{ marginRight: 2 }} />
                  <DetailItemTitle>{`멤버`}</DetailItemTitle>
                  <DetailItemText>{clubData.recruitNumber}</DetailItemText>
                  <DetailItemText style={{ color: "#C0C0C0" }}>{` / ${clubData.maxNumber ? `${clubData.maxNumber} 명` : `무제한`}`}</DetailItemText>
                </DetailInfoItem>
              </DetailInfoView>
            </InformationView>
          </AnimatedFadeOutBox>
        </FilterView>
      </FastImage>
    </Header>
  );
};

export default ClubHeader;

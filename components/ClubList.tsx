import React from "react";
import { Text, useWindowDimensions, View, Platform } from "react-native";
import styled from "styled-components/native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Category } from "../api";

const Club = styled.View`
  /* background-color: orange; */
  align-items: flex-start;
  padding-bottom: 15px;
`;

const ThumbnailView = styled.View``;

const ThumbnailImage = styled.Image<{ size: number }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const Gradient = styled(LinearGradient)<{ size: number }>`
  padding: 0px 10px 0px 10px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  justify-content: flex-end;
  align-items: flex-start;
`;

const RecruitView = styled.View`
  background-color: #ff714b;
  padding: 2px 5px 2px 5px;
  border-radius: 5px;
`;

const RecruitText = styled.Text`
  color: white;
`;

const TitleView = styled.View`
  width: 100%;
  padding: 6px 0px 6px 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ClubNameText = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: white;
`;

const TitleViewRight = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
`;

const Number = styled.Text`
  margin-left: 3px;
  color: white;
  font-size: 12px;
`;

const ClubInfo = styled.View`
  width: 200px;
  padding: 5px 10px 15px 10px;
  justify-content: space-evenly;
`;

const TagView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Tag = styled.View<{ color: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: 3px 5px 3px 5px;
  border-radius: 5px;
  margin-right: 5px;
  border: 1px solid ${(props) => (props.color === "white" ? "#A5A5A5" : "#B4B4B4")};
`;
const DescView = styled.View`
  width: 100%;
  padding-bottom: 5px;
`;
const ShortDescText = styled.Text`
  color: #6f6f6f;
`;

interface ClubListProps {
  thumbnailPath: string | null;
  organizationName: string;
  clubName: string;
  memberNum: number;
  clubShortDesc: string | null;
  categories: Category[];
  recruitStatus: string | null;
}

const ClubList: React.FC<ClubListProps> = ({ thumbnailPath, organizationName, clubName, memberNum, clubShortDesc, categories, recruitStatus }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const colSize = Math.floor(SCREEN_WIDTH / 2) - 0.5;
  return (
    <Club>
      <ThumbnailView>
        <ThumbnailImage source={thumbnailPath === null ? require("../assets/basic.jpg") : { uri: thumbnailPath }} size={colSize}></ThumbnailImage>
        <Gradient size={colSize} colors={["transparent", "rgba(0, 0, 0, 0.8)"]} start={Platform.OS === "android" ? { x: 0, y: 0.65 } : { x: 0.5, y: 0.65 }}>
          {recruitStatus === "RECRUIT" ? (
            <RecruitView>
              <RecruitText>모집중</RecruitText>
            </RecruitView>
          ) : (
            <></>
          )}
          <TitleView>
            <ClubNameText>{clubName}</ClubNameText>
            <TitleViewRight>
              <Feather name="user" size={12} color="white" />
              <Number>{memberNum}</Number>
            </TitleViewRight>
          </TitleView>
        </Gradient>
      </ThumbnailView>

      <ClubInfo>
        {clubShortDesc !== null && clubShortDesc.length > 0 ? (
          <DescView>
            <ShortDescText>{clubShortDesc}</ShortDescText>
          </DescView>
        ) : (
          <></>
        )}
        <TagView>
          <Tag color={"white"}>
            <FontAwesome5 name="cross" size={8} color="#A5A5A5" />
            <Text style={{ color: "#A5A5A5", marginLeft: 3 }}>{organizationName}</Text>
          </Tag>
          {categories[0] ? (
            <Tag color={"#B4B4B4"}>
              <Text style={{ color: "white" }}>{categories[0].name}</Text>
            </Tag>
          ) : (
            <></>
          )}
          {categories[1] ? (
            <Tag color={"#B4B4B4"}>
              <Text style={{ color: "white" }}>{categories[1].name}</Text>
            </Tag>
          ) : (
            <></>
          )}
        </TagView>
      </ClubInfo>
    </Club>
  );
};

export default ClubList;

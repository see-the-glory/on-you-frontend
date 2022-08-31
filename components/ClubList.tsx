import React from "react";
import { useWindowDimensions, Platform, PixelRatio } from "react-native";
import styled from "styled-components/native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Category } from "../api";
import CustomText from "./CustomText";

const Club = styled.View`
  align-items: flex-start;
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
  padding: 1px 3px;
  border-radius: 3px;
`;

const RecruitText = styled(CustomText)`
  font-size: 9px;
  color: white;
  line-height: 12px;
`;

const TitleView = styled.View`
  width: 100%;
  padding: 5px 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ClubNameText = styled(CustomText)`
  font-size: 15px;
  font-family: "NotoSansKR-Bold";
  line-height: 25px;
  color: white;
`;

const TitleViewRight = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
`;

const Number = styled(CustomText)`
  margin-left: 3px;
  color: white;
  font-size: 9px;
  line-height: 12px;
`;

const ClubInfo = styled.View`
  width: 100%;
  padding: 0px 10px;
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
  padding: 0px 3px;
  border-radius: 5px;
  margin-right: 5px;
  border: 1px solid ${(props) => (props.color === "white" ? "#A5A5A5" : "#B4B4B4")};
`;

const TagText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 10px;
  line-height: 14px;
`;

const DescView = styled.View`
  width: 100%;
  margin: 5px 0px;
`;
const ShortDescText = styled(CustomText)`
  color: #6f6f6f;
  font-size: 12px;
  line-height: 19px;
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
  const colSize = Math.round(SCREEN_WIDTH / 2);
  return (
    <Club>
      <ThumbnailView>
        <ThumbnailImage source={thumbnailPath === null ? require("../assets/basic.jpg") : { uri: thumbnailPath }} size={colSize}></ThumbnailImage>
        <Gradient size={colSize} colors={["transparent", "rgba(0, 0, 0, 0.8)"]} start={Platform.OS === "android" ? { x: 0, y: 0.65 } : { x: 0.5, y: 0.65 }}>
          {recruitStatus === "OPEN" ? (
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
            <FontAwesome5 name="cross" size={6} color="#A5A5A5" />
            <TagText style={{ color: "#A5A5A5", marginLeft: 3 }}>{organizationName}</TagText>
          </Tag>
          {categories[0] ? (
            <Tag color={"#B4B4B4"}>
              <TagText style={{ color: "white" }}>{categories[0].name}</TagText>
            </Tag>
          ) : (
            <></>
          )}
          {categories[1] ? (
            <Tag color={"#B4B4B4"}>
              <TagText style={{ color: "white" }}>{categories[1].name}</TagText>
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

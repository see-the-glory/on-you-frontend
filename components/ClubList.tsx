import React from "react";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Category } from "../api";
import CustomText from "./CustomText";
import FastImage from "react-native-fast-image";
import Tag from "./Tag";

const Club = styled.View`
  align-items: flex-start;
`;

const ThumbnailView = styled.View``;

const ThumbnailImage = styled(FastImage)<{ size: number }>`
  position: absolute;
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
`;

const Gradient = styled(LinearGradient)<{ size: number }>`
  padding: 0px 10px 0px 10px;
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
  justify-content: flex-end;
  align-items: flex-start;
`;

const RecruitView = styled.View`
  background-color: #ff6534;
  padding: 2px 4px;
  border-radius: 5px;
`;

const RecruitText = styled(CustomText)`
  font-size: 10px;
  color: white;
  line-height: 14px;
`;

const TitleView = styled.View`
  width: 100%;
  padding-bottom: 5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ClubNameText = styled(CustomText)`
  font-size: 16px;
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
  thumbnailPath?: string | null;
  organizationName?: string;
  clubName?: string;
  memberNum?: number;
  clubShortDesc?: string | null;
  categories?: Category[];
  recruitStatus?: string | null;
  colSize: number;
}

const ClubList: React.FC<ClubListProps> = ({ thumbnailPath, organizationName, clubName, memberNum, clubShortDesc, categories, recruitStatus, colSize }) => {
  const lineCount = Math.floor((colSize - 10) / 12);
  return (
    <Club>
      <ThumbnailView>
        <ThumbnailImage source={thumbnailPath ? { uri: thumbnailPath } : require("../assets/basic.jpg")} size={colSize} />
        <Gradient size={colSize} colors={["transparent", "rgba(0, 0, 0, 0.8)"]} start={{ x: 0.5, y: 0.65 }}>
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
        {clubShortDesc && clubShortDesc.length > 0 ? (
          <DescView>
            <ShortDescText>{clubShortDesc.length <= lineCount ? clubShortDesc : `${clubShortDesc.slice(0, lineCount)}\n${clubShortDesc.slice(lineCount)}`}</ShortDescText>
          </DescView>
        ) : (
          <></>
        )}
        <TagView>
          <Tag
            name={organizationName ?? ""}
            iconName="cross"
            backgroundColor="white"
            textColor="#A5A5A5"
            borderColor="#A5A5A5"
            iconSize={7}
            contentContainerStyle={{ paddingTop: 1, paddingBottom: 1, paddingRight: 3, paddingLeft: 3 }}
            textStyle={{ fontSize: 10, lineHeight: 14 }}
          />

          {categories?.map((category, index) => (
            <Tag
              key={`Category_${index}`}
              name={category?.name ?? ""}
              backgroundColor="#B4B4B4"
              textColor="white"
              borderColor="#B4B4B4"
              contentContainerStyle={{ paddingTop: 1, paddingBottom: 1, paddingRight: 3, paddingLeft: 3 }}
              textStyle={{ fontSize: 10, lineHeight: 14 }}
            />
          ))}
        </TagView>
      </ClubInfo>
    </Club>
  );
};

export default ClubList;

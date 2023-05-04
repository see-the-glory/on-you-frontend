import React from "react";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Category } from "../api";
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
  padding: 1.5px 5px;
  border-radius: 3px;
  margin-bottom: 3px;
`;

const RecruitText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 8px;
  line-height: 9px;
  color: white;
`;

const TitleView = styled.View`
  width: 100%;
  padding-bottom: 5px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const ClubNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  flex: 5;
  font-size: 14px;
  line-height: 17px;
  color: white;
`;

const TitleViewRight = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 5px;
`;

const Number = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  margin-left: 3px;
  color: white;
  font-size: 9px;
`;

const ClubInfo = styled.View<{ width: number }>`
  width: ${(props: any) => (props.width ? `${props.width}px` : "100%")};
  padding: 0px 10px;
  justify-content: space-evenly;
`;

const TagView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const DescView = styled.View`
  width: 100%;
  margin: 5px 0px;
`;
const ShortDescText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #6f6f6f;
  font-size: 10px;
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

      <ClubInfo width={colSize}>
        <DescView>
          <ShortDescText>{clubShortDesc}</ShortDescText>
        </DescView>
        <TagView>
          <Tag
            name={organizationName ?? ""}
            iconName="cross"
            backgroundColor="white"
            textColor="#A5A5A5"
            borderColor="#A5A5A5"
            iconSize={6}
            contentContainerStyle={{ paddingTop: 1, paddingBottom: 1, paddingRight: 3, paddingLeft: 3 }}
            textStyle={{ fontSize: 9, lineHeight: 11 }}
          />

          {categories?.map((category, index) => (
            <Tag
              key={`Category_${index}`}
              name={category?.name ?? ""}
              backgroundColor="#B4B4B4"
              textColor="white"
              borderColor="rgba(0,0,0,0)"
              contentContainerStyle={{ paddingTop: 1, paddingBottom: 1, paddingRight: 3, paddingLeft: 3 }}
              textStyle={{ fontSize: 9, lineHeight: 11 }}
            />
          ))}
        </TagView>
      </ClubInfo>
    </Club>
  );
};

export default ClubList;

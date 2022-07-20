import React from "react";
import { Text, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";

const Club = styled.View`
  /* background-color: orange; */
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
`;

const ThumbnailImage = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const ClubInfo = styled.View`
  width: 200px;
  height: 70px;
  padding-left: 10px;
  justify-content: space-evenly;
`;

const TitleView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const CategoryBox = styled.View`
  background-color: #c4c4c4;
  padding: 3px 5px 3px 5px;
  border-radius: 5px;
  margin-left: 3px;
  margin-right: 3px;
`;

const OrganizationNameText = styled.Text`
  font-size: 12px;
`;
const ClubNameText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  padding-right: 5px;
`;
const MemberNumView = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface ClubListProps {
  thumbnailPath: string | null;
  organizationName: string;
  clubName: string;
  memberNum: number;
  clubShortDesc: string | null;
  category1Name: string;
  category2Name: string | null;
}

const ClubList: React.FC<ClubListProps> = ({
  thumbnailPath,
  organizationName,
  clubName,
  memberNum,
  clubShortDesc,
  category1Name,
  category2Name,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  return (
    <Club>
      <ThumbnailImage
        source={
          thumbnailPath === null
            ? require("../assets/basic.jpg")
            : { uri: thumbnailPath }
        }
        size={Math.floor(SCREEN_WIDTH / 2) - 0.5}
      />
      <ClubInfo>
        <TitleView>
          <ClubNameText>{clubName}</ClubNameText>
          <CategoryBox>
            <Text style={{ color: "white" }}>{category1Name}</Text>
          </CategoryBox>
          {category2Name ? (
            <CategoryBox>
              <Text style={{ color: "white" }}>{category2Name}</Text>
            </CategoryBox>
          ) : (
            <></>
          )}
        </TitleView>
        <Text style={{ color: "#808080" }}>{clubShortDesc}</Text>
      </ClubInfo>
    </Club>
  );
};

export default ClubList;

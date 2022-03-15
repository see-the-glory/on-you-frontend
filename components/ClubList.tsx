import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";

const Club = styled.TouchableOpacity`
  width: 100%;
  height: 80px;
  margin-bottom: 20px;
  align-items: center;
  flex-direction: row;
`;

const ThumbnailImage = styled.Image`
  width: 100px;
  height: 75px;
  border-radius: 8px;
  margin-left: 20px;
`;

const ClubInfo = styled.View`
  width: 200px;
  height: 70px;
  margin-left: 20px;
  justify-content: space-evenly;
`;

const ChurchNameText = styled.Text`
  font-size: 12px;
`;
const ClubNameText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;
const MemberNumView = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface ClubListProps {
  thumbnailPath: string;
  churchName: string;
  clubName: string;
  memberNum: number;
}

const ClubList: React.FC<ClubListProps> = ({
  thumbnailPath,
  churchName,
  clubName,
  memberNum,
}) => (
  <Club>
    <ThumbnailImage source={{ uri: thumbnailPath }} />
    <ClubInfo>
      <ChurchNameText>
        <Text>{churchName}</Text>
      </ChurchNameText>
      <ClubNameText>
        <Text>{clubName}</Text>
      </ClubNameText>
      <MemberNumView>
        <FontAwesome name="user-o" size={12} color="black" />
        <Text style={{ marginLeft: 7 }}>{memberNum} 명</Text>
      </MemberNumView>
    </ClubInfo>
  </Club>
);

export default ClubList;

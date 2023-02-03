import moment from "moment";
import React from "react";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { FeedComment } from "../api";
import CircleIcon from "./CircleIcon";
import CustomText from "./CustomText";

const Container = styled.View<{ padding: number }>`
  flex-direction: row;
  padding: 10px ${(props: any) => (props.padding ? props.padding : 0)}px;
  background-color: white;
`;

const LeftView = styled.View``;
const RightView = styled.View``;

const ContentTextBundle = styled(CustomText)<{ width: number }>`
  ${(props: any) => (props.width ? `width: ${props.width}px` : "")};
`;

const ContentUserName = styled(CustomText)`
  font-size: 14px;
  line-height: 21px;
  font-family: "NotoSansKR-Bold";
`;
const ContentText = styled(CustomText)`
  font-size: 14px;
  line-height: 21px;
`;
const InformationView = styled.View`
  margin: 3px 0px;
`;
const CreatedTime = styled(CustomText)`
  font-size: 11px;
  color: #8e8e8e;
`;

interface CommentProps {
  commentData: FeedComment;
}

const Comment: React.FC<CommentProps> = ({ commentData }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const paddingSize = 20;
  const iconSize = 45;
  const iconKerning = 10;

  return (
    <Container padding={20}>
      <LeftView>
        <CircleIcon uri={commentData.thumbnail} size={iconSize} kerning={iconKerning} />
      </LeftView>
      <RightView>
        <ContentTextBundle width={SCREEN_WIDTH - paddingSize * 2 - iconSize - iconKerning}>
          <ContentUserName>{commentData.userName.trim() + `  `}</ContentUserName>
          <ContentText>{commentData.content.trim()}</ContentText>
        </ContentTextBundle>
        <InformationView>
          <CreatedTime>{moment(commentData.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</CreatedTime>
        </InformationView>
      </RightView>
    </Container>
  );
};

export default Comment;

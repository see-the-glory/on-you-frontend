import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { FeedComment } from "../api";
import CircleIcon from "./CircleIcon";
import CustomText from "./CustomText";

const Container = styled.View<{ padding: number }>`
  flex-direction: row;
  padding: 10px ${(props: any) => (props.padding ? props.padding : 0)}px;
  align-items: flex-start;
  background-color: white;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Content = styled.View`
  margin-bottom: 2px;
`;
const Footer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Side = styled.View<{ width: number }>`
  width: ${(props: any) => (props.width ? props.width : 0)}px;
  padding-top: 3px;
  justify-content: flex-start;
  align-items: center;
`;

const UserName = styled(CustomText)`
  font-size: 15px;
  line-height: 22px;
  color: #2b2b2b;
  font-family: "NotoSansKR-Medium";
  margin-right: 8px;
`;

const ContentText = styled(CustomText)`
  font-size: 14px;
  line-height: 21px;
`;

const SubText = styled(CustomText)`
  font-size: 11px;
  line-height: 16px;
  color: #8e8e8e;
`;

const ReplyButton = styled.TouchableOpacity``;

const LikeButton = styled.TouchableOpacity``;

interface CommentProps {
  commentData: FeedComment;
  likeComment: (commentId: number) => void;
  setReplyStatus: (commentId: number, userName: string) => void;
}

const Comment: React.FC<CommentProps> = ({ commentData, likeComment, setReplyStatus }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const paddingSize = 20;
  const iconSize = 45;
  const iconKerning = 10;
  const sideWidth = 20;

  return (
    <Container padding={paddingSize}>
      <CircleIcon uri={commentData.thumbnail} size={iconSize} kerning={iconKerning} />
      <View>
        <Header>
          <UserName>{commentData.userName.trim()}</UserName>
          <SubText>{moment(commentData.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</SubText>
        </Header>
        <Content width={SCREEN_WIDTH - paddingSize * 2 - iconSize - iconKerning - sideWidth}>
          <ContentText>{commentData.content.trim()}</ContentText>
        </Content>
        <Footer>
          {commentData.likeCount > 0 ? <SubText style={{ marginRight: 8 }}>{`좋아요 ${commentData.likeCount}명`}</SubText> : <></>}
          <ReplyButton onPress={() => setReplyStatus(commentData.commentId, commentData.userName)}>
            <SubText>{`답글달기`}</SubText>
          </ReplyButton>
        </Footer>
      </View>
      <Side width={sideWidth}>
        <LikeButton onPress={() => likeComment(commentData.commentId)}>
          <Ionicons name="heart-outline" size={16} color="#BABABA" />
        </LikeButton>
      </Side>
    </Container>
  );
};

export default Comment;

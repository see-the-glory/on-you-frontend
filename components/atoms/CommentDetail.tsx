import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import moment from "moment";
import React, { useCallback } from "react";
import { useWindowDimensions, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { FeedComment, LikeUser } from "../../api";
import CircleIcon from "./CircleIcon";
import { lightTheme } from "../../theme";
import LinkedText from "./LinkedText";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/reducers";

const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: white;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Content = styled.View<{ width: number }>`
  width: ${(props: any) => (props.width ? props.width : 0)}px;
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

const UserName = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 13px;
  line-height: 21px;
  margin-right: 8px;
  color: #2b2b2b;
`;

const ContentText = styled(LinkedText)`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 21px;
  color: #2b2b2b;
`;

const SubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 11px;
  line-height: 14px;
  color: #8e8e8e;
`;

const ReplyButton = styled.TouchableOpacity``;

const LikeButton = styled.TouchableOpacity``;

const LikeUserButton = styled.TouchableOpacity``;

interface CommentDetailProps {
  commentData: FeedComment;
  commentType: number; // 0 : 기본댓글 , 1: 답글
  parentIndex: number;
  replyIndex?: number;
  parentId: number;
  thumbnailSize: number;
  thumbnailKerning: number;
  likeComment: (commentId: number, commentType: number, parentIndex: number, replyIndex?: number) => void;
  setReplyStatus: (parentId: number, userName: string) => void;
}

const CommentDetail: React.FC<CommentDetailProps> = ({ commentData, commentType, parentIndex, replyIndex, parentId, thumbnailSize, thumbnailKerning, likeComment, setReplyStatus }) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const paddingSize = 20;
  const sideWidth = 20;
  const contentWidth = SCREEN_WIDTH - paddingSize * 2 - thumbnailSize - thumbnailKerning - sideWidth;
  const replyPaddingLeft = paddingSize + thumbnailSize + thumbnailKerning;
  const replyContentWidth = contentWidth - thumbnailSize - thumbnailKerning;

  const goToProfile = (userId: number) => navigation.push("ProfileStack", { screen: "Profile", params: { userId } });
  const goToFeedLikes = useCallback(
    (likeUsers?: LikeUser[]) => {
      // 로그인 되어있다면, likeYn에 따라 likeUsers 목록에 내 정보를 넣거나 뺀다.
      if (me?.thumbnail && me?.name && me?.id) {
        likeUsers = likeUsers?.filter((user) => user.userId != me?.id);
        if (commentData.likeYn) likeUsers?.push({ thumbnail: me?.thumbnail, userName: me?.name, likeDate: moment().tz("Asia/Seoul").format("YYYY-MM-DDThh:mm:ss"), userId: me?.id });
      }

      if (!likeUsers || likeUsers.length === 0) return;
      navigation.push("FeedStack", { screen: "FeedLikes", params: { likeUsers } });
    },
    [commentData.likeYn]
  );

  return (
    <Container style={{ paddingVertical: 10, paddingLeft: commentType === 1 ? replyPaddingLeft : paddingSize, paddingRight: paddingSize }}>
      <CircleIcon uri={commentData.thumbnail} size={thumbnailSize} kerning={thumbnailKerning} onPress={() => goToProfile(commentData.userId)} />
      <View>
        <Header>
          <TouchableOpacity activeOpacity={1} onPress={() => goToProfile(commentData.userId)}>
            <UserName>{commentData.userName.trim()}</UserName>
          </TouchableOpacity>
          <SubText>{moment(commentData.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</SubText>
        </Header>
        <Content width={commentType === 1 ? replyContentWidth : contentWidth}>
          <ContentText>{commentData.content.trim()}</ContentText>
        </Content>
        <Footer>
          {commentData.likeCount > 0 ? (
            <LikeUserButton activeOpacity={1} onPress={() => goToFeedLikes(commentData.likeUserResponseList)}>
              <SubText style={{ marginRight: 8 }}>{`좋아요 ${commentData.likeCount}명`}</SubText>
            </LikeUserButton>
          ) : (
            <></>
          )}
          <ReplyButton onPress={() => setReplyStatus(parentId, commentData.userName)}>
            <SubText>{`답글달기`}</SubText>
          </ReplyButton>
        </Footer>
      </View>
      <Side width={sideWidth}>
        <LikeButton onPress={() => likeComment(commentData.commentId, commentType, parentIndex, replyIndex)}>
          {commentData.likeYn ? <Ionicons name="heart" size={20} color={lightTheme.accentColor} /> : <Ionicons name="heart-outline" size={20} color="#BABABA" />}
        </LikeButton>
      </Side>
    </Container>
  );
};

export default CommentDetail;

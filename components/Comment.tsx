import { AntDesign } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import Collapsible from "react-native-collapsible";
import { SwipeRow } from "react-native-swipe-list-view";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { FeedComment, LikeUser } from "../api";
import { RootState } from "../redux/store/reducers";
import CommentDetail from "./CommentDetail";

const HiddenItemContainer = styled.View`
  height: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
`;
const HiddenItemButton = styled.TouchableOpacity<{ width: number }>`
  width: ${(props: any) => props.width}px;
  height: 100%;
  background-color: #8e8e8e;
  justify-content: center;
  align-items: center;
`;

const ReplyShowButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const ReplyText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 11px;
  color: #8e8e8e;
`;

interface CommentProps {
  commentData: FeedComment;
  parentIndex: number;
  parentId: number;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, commentType: number, parentIndex: number, replyIndex?: number) => void;
  setReplyStatus: (parentId: number, userName: string) => void;
  goToFeedLikes: (likeUsers?: LikeUser[]) => void;
}

const Comment: React.FC<CommentProps> = ({ commentData, parentIndex, parentId, deleteComment, likeComment, setReplyStatus, goToFeedLikes }) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const [collapsed, setCollapsed] = useState<boolean>(commentData?.replies?.length < 4 ? false : true);
  const paddingSize = 20;
  const hiddenItemWidth = 60;
  const thumbnailSize = 36;
  const thumbnailKerning = 10;
  const commentRef = useRef(null);
  const replyRef = useRef(null);

  return (
    <>
      <SwipeRow ref={commentRef} key={`Comment_${parentIndex}`} disableRightSwipe={true} disableLeftSwipe={commentData.userId !== me?.id} rightOpenValue={-hiddenItemWidth} tension={60}>
        <HiddenItemContainer>
          <HiddenItemButton
            width={hiddenItemWidth}
            onPress={() => {
              deleteComment(commentData.commentId ?? -1);
              commentRef?.current?.closeRow();
            }}
          >
            <AntDesign name="delete" size={20} color="white" />
          </HiddenItemButton>
        </HiddenItemContainer>
        <CommentDetail
          commentData={commentData}
          commentType={0}
          parentIndex={parentIndex}
          parentId={parentId}
          thumbnailSize={thumbnailSize}
          thumbnailKerning={thumbnailKerning}
          likeComment={likeComment}
          setReplyStatus={setReplyStatus}
          goToFeedLikes={goToFeedLikes}
        />
      </SwipeRow>
      {commentData?.replies?.length && collapsed ? (
        <ReplyShowButton style={{ paddingLeft: paddingSize + thumbnailSize + thumbnailKerning }} onPress={() => setCollapsed(false)}>
          <AntDesign name="minus" size={11} color="#8e8e8e" />
          <ReplyText>{` 답글 ${commentData.replies.length}개 더보기`}</ReplyText>
        </ReplyShowButton>
      ) : commentData?.replies?.length && !collapsed ? (
        <ReplyShowButton activeOpacity={1} style={{ paddingLeft: paddingSize + thumbnailSize + thumbnailKerning }} onPress={() => setCollapsed(true)}>
          <AntDesign name="minus" size={11} color="#8e8e8e" />
          <ReplyText>{` 답글 감추기`}</ReplyText>
        </ReplyShowButton>
      ) : (
        <></>
      )}
      {/* Collapsible 에 minHeight 이 없으면 HiddenItemContainer의 배경색이 적용되지 않는 이슈가 있음. */}
      <Collapsible style={{ minHeight: commentData.replies.length ? 50 : 0 }} collapsed={collapsed}>
        {commentData.replies?.map((reply: FeedComment, index: number) => (
          <SwipeRow ref={replyRef} key={`Reply_${index}`} disableRightSwipe={true} disableLeftSwipe={reply.userId !== me?.id} rightOpenValue={-hiddenItemWidth} tension={60}>
            <HiddenItemContainer>
              <HiddenItemButton
                width={hiddenItemWidth}
                onPress={() => {
                  deleteComment(reply.commentId ?? -1);
                  replyRef?.current?.closeRow();
                }}
              >
                <AntDesign name="delete" size={20} color="white" />
              </HiddenItemButton>
            </HiddenItemContainer>
            <CommentDetail
              commentData={reply}
              commentType={1}
              replyIndex={index}
              parentIndex={parentIndex}
              parentId={parentId}
              thumbnailSize={thumbnailSize}
              thumbnailKerning={thumbnailKerning}
              likeComment={likeComment}
              setReplyStatus={setReplyStatus}
              goToFeedLikes={goToFeedLikes}
            />
          </SwipeRow>
        ))}
      </Collapsible>
    </>
  );
};

export default Comment;

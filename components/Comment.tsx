import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import { SwipeRow } from "react-native-swipe-list-view";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { FeedComment } from "../api";
import { RootState } from "../redux/store/reducers";
import CommentDetail from "./CommentDetail";
import CustomText from "./CustomText";

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
const ReplyText = styled(CustomText)`
  font-size: 11px;
  line-height: 16px;
  color: #8e8e8e;
`;

interface CommentProps {
  commentData: FeedComment;
  parentIndex: number;
  parentId: number;
  deleteComment: (commentId: number) => void;
  likeComment: (commentId: number, commentType: number, parentIndex: number, replyIndex?: number) => void;
  setReplyStatus: (parentId: number, userName: string) => void;
}

const Comment: React.FC<CommentProps> = ({ commentData, parentIndex, parentId, deleteComment, likeComment, setReplyStatus }) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const paddingSize = 20;
  const hiddenItemWidth = 60;
  const thumbnailSize = 45;
  const thumbnailKerning = 10;

  return (
    <>
      <SwipeRow disableRightSwipe={true} disableLeftSwipe={commentData.userId !== me?.id} rightOpenValue={-hiddenItemWidth} tension={60}>
        <HiddenItemContainer>
          <HiddenItemButton width={hiddenItemWidth} onPress={() => deleteComment(commentData.commentId ?? -1)}>
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
        />
      </SwipeRow>
      {commentData?.replies?.length && collapsed ? (
        <ReplyShowButton style={{ paddingLeft: paddingSize + thumbnailSize + thumbnailKerning }} onPress={() => setCollapsed(false)}>
          <AntDesign name="minus" size={11} color="#8e8e8e" />
          <ReplyText>{` 답글 ${commentData.replies.length}개 더 보기`}</ReplyText>
        </ReplyShowButton>
      ) : (
        <></>
      )}
      {/* Collapsible 에 minHeight 이 없으면 HiddenItemContainer의 배경색이 적용되지 않는 이슈가 있음. */}
      <Collapsible style={{ minHeight: 100 }} collapsed={collapsed}>
        {commentData.replies?.map((reply: FeedComment, index: number) => (
          <SwipeRow key={`Reply_${index}`} disableRightSwipe={true} disableLeftSwipe={reply.userId !== me?.id} rightOpenValue={-hiddenItemWidth} tension={60}>
            <HiddenItemContainer>
              <HiddenItemButton width={hiddenItemWidth} onPress={() => deleteComment(reply.commentId ?? -1)}>
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
            />
          </SwipeRow>
        ))}
      </Collapsible>
    </>
  );
};

export default Comment;

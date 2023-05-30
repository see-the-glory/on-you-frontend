import { Entypo, EvilIcons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, DeviceEventEmitter, KeyboardAvoidingView, LayoutChangeEvent, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { FeedComment, FeedApi, FeedCommentsResponse, ErrorResponse, BaseResponse, FeedCommentCreationRequest, FeedCommentDefaultRequest } from "../../api";
import Comment from "../../components/Comment";
import CircleIcon from "../../components/CircleIcon";
import { SwipeListView } from "react-native-swipe-list-view";
import { RootState } from "../../redux/store/reducers";
import { useAppDispatch } from "../../redux/store";
import feedSlice from "../../redux/slices/feed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Container = styled.View`
  flex: 1;
`;

const FooterView = styled.View``;

const ReplyStatusView = styled.View<{ padding: number }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ececec;
  padding: 10px ${(props: any) => (props.padding ? props.padding : 0)}px;
`;

const StatusText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 13px;
  color: #8e8e8e;
`;

const CloseButton = styled.TouchableOpacity``;

const CommentInputView = styled.View<{ padding: number }>`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #c4c4c4;
  align-items: flex-end;
  padding: 10px ${(props: any) => (props.padding ? props.padding : 0)}px;
  margin-bottom: 10px;
`;

const RoundingView = styled.View`
  flex-direction: row;
  flex: 1;
  height: 100%;
  padding: 3px 10px;
  /* border-width: 0.5px;
  border-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px; */
`;
const CommentInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 13px;
  flex: 1;
  margin: 1px 0px;
`;
const SubmitButton = styled.TouchableOpacity`
  width: 40px;
  justify-content: center;
  align-items: center;
  padding-left: 8px;
  margin-bottom: 8px;
`;
const SubmitLoadingView = styled.View`
  width: 40px;
  justify-content: center;
  align-items: center;
  padding-left: 8px;
  margin-bottom: 8px;
`;
const SubmitButtonText = styled.Text<{ disabled: boolean }>`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 15px;
  line-height: 20px;
  color: #63abff;
  opacity: ${(props: any) => (props.disabled ? 0.3 : 1)};
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 15px;
  line-height: 20px;
  color: #acacac;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const FeedComments = ({
  navigation: { setOptions, navigate, goBack },
  route: {
    params: { feedIndex, feedId, clubId },
  },
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const commentInputRef = useRef<TextInput>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [parentUserName, setParentUserName] = useState<string>();
  const [parentCommentId, setParentCommentId] = useState<number>();
  const [validation, setValidation] = useState<boolean>(false);
  const [commentInputHeight, setCommentInputHeight] = useState<number>(0);
  const [commentData, setCommentData] = useState<FeedComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const insets = useSafeAreaInsets();
  const paddingSize = 20;
  let { refetch: commentsRefetch } = useQuery<FeedCommentsResponse, ErrorResponse>(["getFeedComments", feedId], FeedApi.getFeedComments, {
    onSuccess: (res: FeedCommentsResponse) => {
      setCommentData(res?.data);
      setIsLoading(false);
      if (feedIndex !== undefined) {
        const count = res.data.length + res.data.reduce((acc, comment) => acc + comment.replies.length, 0);
        dispatch(feedSlice.actions.updateCommentCount({ feedId, count }));
      } else {
        DeviceEventEmitter.emit("SelectFeedRefetch");
      }
    },
    onError: (error) => {
      console.log(`API ERROR | getFeedComments ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const createFeedCommentMutation = useMutation<BaseResponse, ErrorResponse, FeedCommentCreationRequest>(FeedApi.createFeedComment, {
    onSuccess: (res) => {
      setComment("");
      setParentUserName(undefined);
      setParentCommentId(undefined);
      setValidation(false);
      commentsRefetch();
    },
    onError: (error) => {
      console.log(`API ERROR | createFeedComment ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });
  const deleteFeedCommentMutation = useMutation<BaseResponse, ErrorResponse, FeedCommentDefaultRequest>(FeedApi.deleteFeedComment, {
    onSuccess: (res) => {
      commentsRefetch();
      toast.show(`댓글을 삭제했습니다.`, { type: "success" });
    },
    onError: (error) => {
      console.log(`API ERROR | deleteFeedComment ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });
  const likeFeedCommentMutation = useMutation<BaseResponse, ErrorResponse, FeedCommentDefaultRequest>(FeedApi.likeFeedComment, {
    onError: (error) => {
      console.log(`API ERROR | likeFeedComment ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  const submit = () => {
    if (!validation) return toast.show(`글을 입력하세요.`, { type: "warning" });

    let requestData: FeedCommentCreationRequest = {
      feedId,
      content: comment.trim(),
    };

    if (parentCommentId) requestData.parentId = parentCommentId;

    createFeedCommentMutation.mutate(requestData);
  };

  const deleteComment = (commentId: number) => {
    if (commentId === -1) return toast.show(`댓글 정보가 잘못되었습니다.`, { type: "warning" });

    let requestData: FeedCommentDefaultRequest = { commentId };
    deleteFeedCommentMutation.mutate(requestData);
  };

  /**
   *
   * @param commentId
   * @param commentType 0: 기본 , 1: 답글
   * @param parentIndex
   * @param replyIndex
   * @returns
   */
  const likeComment = (commentId: number, commentType: number, parentIndex: number, replyIndex?: number) => {
    if (commentId === -1) return toast.show(`댓글 정보가 잘못되었습니다.`, { type: "warning" });

    let requestData: FeedCommentDefaultRequest = { commentId };
    likeFeedCommentMutation.mutate(requestData);

    setCommentData((prev) => {
      if (commentType == 0) {
        // 기본 댓글
        if (prev[parentIndex].likeYn) prev[parentIndex].likeCount--;
        else prev[parentIndex].likeCount++;
        prev[parentIndex].likeYn = !prev[parentIndex].likeYn;
      } else {
        // 답글
        if (replyIndex !== undefined) {
          if (prev[parentIndex].replies[replyIndex].likeYn) prev[parentIndex].replies[replyIndex].likeCount--;
          else prev[parentIndex].replies[replyIndex].likeCount++;
          prev[parentIndex].replies[replyIndex].likeYn = !prev[parentIndex].replies[replyIndex].likeYn;
        }
      }
      return prev;
    });
  };

  const setReplyStatus = (parentId?: number, userName?: string) => {
    if (!parentId || !userName) return;

    setParentCommentId(parentId);
    setParentUserName(userName);
    commentInputRef?.current?.focus();
    setComment(`@${userName} `);
    setValidation(true);
  };

  const initReplyStatus = () => {
    setParentCommentId(undefined);
    setParentUserName(undefined);
    setComment("");
    setValidation(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await commentsRefetch();
    setRefreshing(false);
  };

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={commentInputHeight} style={{ flex: 1 }}>
        {isLoading ? (
          <Loader>
            <ActivityIndicator />
          </Loader>
        ) : (
          <SwipeListView
            // keyboardDismissMode={"on-drag"}
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            data={commentData}
            keyExtractor={(item: FeedComment, index: number) => String(index)}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ marginBottom: 40 }}
            renderItem={({ item, index }: { item: FeedComment; index: number }) => (
              <Comment commentData={item} parentIndex={index} parentId={item.commentId} deleteComment={deleteComment} likeComment={likeComment} setReplyStatus={setReplyStatus} />
            )}
            ListEmptyComponent={() => (
              <EmptyView>
                <EmptyText>{`아직 등록된 댓글이 없습니다.\n첫 댓글을 남겨보세요.`}</EmptyText>
              </EmptyView>
            )}
          />
        )}
        <FooterView>
          {parentUserName && parentCommentId ? (
            <ReplyStatusView padding={paddingSize}>
              <StatusText>{`${parentUserName}님에게 답글 남기는중`}</StatusText>
              <CloseButton onPress={initReplyStatus}>
                <EvilIcons name="close" size={16} color="#8E8E8E" />
              </CloseButton>
            </ReplyStatusView>
          ) : (
            <></>
          )}
          <CommentInputView
            padding={paddingSize}
            onLayout={(event: LayoutChangeEvent) => {
              const { height } = event.nativeEvent.layout;
              setCommentInputHeight(height + insets.bottom);
            }}
          >
            <CircleIcon uri={me?.thumbnail} size={35} kerning={10} />
            <RoundingView>
              <CommentInput
                ref={commentInputRef}
                placeholder="댓글을 입력해보세요"
                placeholderTextColor="#B0B0B0"
                value={comment}
                textAlign="left"
                multiline={true}
                maxLength={1000}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                returnKeyType="done"
                returnKeyLabel="done"
                textAlignVertical="center"
                onChangeText={(value: string) => {
                  setComment(value);
                  if (!validation && value.trim() !== "") setValidation(true);
                  if (validation && value.trim() === "") setValidation(false);
                }}
                onEndEditing={() => setComment((prev) => prev.trim())}
                includeFontPadding={false}
              />
            </RoundingView>
            {createFeedCommentMutation.isLoading ? (
              <SubmitLoadingView>
                <ActivityIndicator />
              </SubmitLoadingView>
            ) : (
              <SubmitButton disabled={!validation} onPress={submit}>
                <SubmitButtonText disabled={!validation}>게시</SubmitButtonText>
              </SubmitButton>
            )}
          </CommentInputView>
        </FooterView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default FeedComments;

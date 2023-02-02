import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, FlatList, KeyboardAvoidingView, Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { FeedComment, FeedApi, FeedCommentsResponse, User } from "../../api";
import CustomText from "../../components/CustomText";
import Comment from "../../components/Comment";
import CustomTextInput from "../../components/CustomTextInput";
import CircleIcon from "../../components/CircleIcon";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { RootState } from "../../redux/store/reducers";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const FooterView = styled.View<{ padding: number }>`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #c4c4c4;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px ${(props: any) => (props.padding ? props.padding : 0)}px 20px ${(props: any) => (props.padding ? props.padding : 0)}px;
  background-color: white;
`;
const CommentInput = styled(CustomTextInput)`
  flex: 1;
  margin-bottom: 5px;
`;
const SubmitButton = styled.TouchableOpacity`
  align-items: center;
  padding-left: 5px;
`;
const SubmitButtonText = styled(CustomText)<{ disabled: boolean }>`
  font-size: 14px;
  line-height: 20px;
  color: #63abff;
  padding-bottom: 5px;
  opacity: ${(props: any) => (props.disabled ? 0.5 : 1)};
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled(CustomText)`
  font-size: 14px;
  color: #bdbdbd;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

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

const FeedComments = ({
  navigation: { setOptions, navigate, goBack },
  route: {
    params: { feedId },
  },
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const [comment, setComment] = useState<string>("");
  const [validation, setValidation] = useState<boolean>(false);
  const hiddenItemWidth = 60;
  const {
    data: comments,
    isLoading: commentsLoading,
    refetch: commentsRefetch,
  } = useQuery<FeedCommentsResponse>(["getFeedComments", token, feedId], FeedApi.getFeedComments, {
    onSuccess: (res) => {
      if (res.status !== 200) {
        console.log("--- Error getFeedComments ---");
        console.log(res);
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error getFeedComments ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const createFeedCommentMutation = useMutation(FeedApi.createFeedComment);
  const deleteFeedCommentMutation = useMutation(FeedApi.deleteFeedComment);

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
    return () => {
      DeviceEventEmitter.emit("HomeFeedRefetch");
    };
  }, []);

  const submit = () => {
    if (!validation) {
      return toast.show(`글을 입력하세요.`, {
        type: "warning",
      });
    }

    let requestData = {
      token,
      data: {
        id: feedId,
        content: comment.trim(),
      },
    };

    createFeedCommentMutation.mutate(requestData, {
      onSuccess: (res) => {
        if (res.status === 200) {
          setComment("");
          commentsRefetch();
        } else {
          console.log("--- Error createFeedComment ---");
          console.log(res);
          toast.show(`Error Code: ${res.status}`, {
            type: "warning",
          });
        }
      },
      onError: (error) => {
        console.log("--- Error createFeedComment ---");
        console.log(error);
        toast.show(`Error Code: ${error}`, {
          type: "warning",
        });
      },
    });
  };

  const deleteComment = (commentId: number) => {
    if (commentId === -1) {
      return toast.show(`댓글 정보가 잘못되었습니다.`, {
        type: "warning",
      });
    }
    let requestData = {
      token,
      data: {
        id: commentId,
      },
    };

    deleteFeedCommentMutation.mutate(requestData, {
      onSuccess: (res) => {
        if (res.status === 200) {
          commentsRefetch();
          toast.show(`댓글을 삭제했습니다.`, {
            type: "success",
          });
        } else {
          console.log("--- Error deleteFeedComment ---");
          console.log(res);
          toast.show(`Error Code: ${res.status}`, {
            type: "warning",
          });
        }
      },
      onError: (error) => {
        console.log("--- Error deleteFeedComment ---");
        console.log(error);
        toast.show(`Error Code: ${error}`, {
          type: "warning",
        });
      },
    });
  };

  return commentsLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100} style={{ flex: 1 }}>
        <SwipeListView
          contentContainerStyle={{ flexGrow: 1 }}
          data={[...(comments?.data ?? [])].reverse()}
          keyExtractor={(item: FeedComment, index: number) => String(index)}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{ marginBottom: 100 }}
          renderItem={({ item, index }: { item: FeedComment; index: number }) => (
            // 현재 타 유저의 댓글도 삭제 가능해서 테스트용으로 열어놓음.
            // <SwipeRow disableRightSwipe={true} disableLeftSwipe={item.userId !== me?.id} rightOpenValue={-hiddenItemWidth}>
            <SwipeRow disableRightSwipe={true} rightOpenValue={-hiddenItemWidth}>
              <HiddenItemContainer>
                <HiddenItemButton width={hiddenItemWidth} onPress={() => deleteComment(item.commentId ?? -1)}>
                  <AntDesign name="delete" size={20} color="white" />
                </HiddenItemButton>
              </HiddenItemContainer>
              <Comment commentData={item} />
            </SwipeRow>
          )}
          ListEmptyComponent={() => (
            <EmptyView>
              <EmptyText>{`아직 등록된 댓글이 없습니다.\n첫 댓글을 남겨보세요.`}</EmptyText>
            </EmptyView>
          )}
        />
        <FooterView padding={20}>
          <CircleIcon uri={me?.thumbnail} size={35} kerning={10} />
          <CommentInput
            placeholder="댓글을 입력해보세요"
            placeholderTextColor="#B0B0B0"
            value={comment}
            textAlign="left"
            multiline={true}
            maxLength={255}
            onChangeText={(value: string) => {
              setComment(value);
              if (!validation && value !== "") setValidation(true);
              if (validation && value === "") setValidation(false);
            }}
            includeFontPadding={false}
          />

          <SubmitButton disabled={!validation} onPress={submit}>
            <SubmitButtonText disabled={!validation}>게시</SubmitButtonText>
          </SubmitButton>
        </FooterView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default FeedComments;

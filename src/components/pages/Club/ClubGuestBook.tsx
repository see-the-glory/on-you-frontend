import { AntDesign, Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import React, { useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, LayoutChangeEvent, Platform, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RowMap, SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BaseResponse, ClubApi, ErrorResponse, GuestComment, GuestCommentDeletionRequest, GuestCommentRequest, GuestCommentResponse } from "api";
import CircleIcon from "@components/atoms/CircleIcon";
import LinkedText from "@components/atoms/LinkedText";
import { RootState } from "redux/store/reducers";
import { ClubStackParamList } from "@navigation/ClubStack";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
`;

const HeaderTitleView = styled.View`
  justify-content: center;
  align-items: center;
`;
const HeaderClubName = styled.Text`
  font-family: ${(props) => props.theme.koreanFontM};
  font-size: 13px;
  color: #8e8e8e;
  line-height: 21px;
`;
const HeaderText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontM};
  font-size: 15px;
  line-height: 20px;
  color: #2b2b2b;
`;

const FooterView = styled.View``;

const CommentInputView = styled.View<{ padding: number }>`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #c4c4c4;
  align-items: flex-end;
  padding: 10px ${(props) => (props.padding ? props.padding : 0)}px;
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
  font-family: ${(props) => props.theme.koreanFontR};
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
  font-family: ${(props) => props.theme.koreanFontM};
  font-size: 15px;
  line-height: 20px;
  color: #63abff;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 15px;
  line-height: 20px;
  color: #acacac;
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
  width: ${(props) => props.width}px;
  height: 100%;
  background-color: #8e8e8e;
  justify-content: center;
  align-items: center;
`;

const CommentContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: white;
`;

const CommentHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;
const CommentContent = styled.View`
  flex: 1;
`;
const CommentUserName = styled.Text`
  font-family: ${(props) => props.theme.koreanFontB};
  font-size: 13px;
  margin-right: 8px;
  color: #2b2b2b;
`;

const CommentContentText = styled(LinkedText)`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 14px;
  color: #2b2b2b;
`;

const CommentSubText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 11px;
  color: #8e8e8e;
`;

const ClubGuestBook: React.FC<NativeStackScreenProps<ClubStackParamList, "ClubGuestBook">> = ({
  route: {
    params: { clubId, clubData },
  },
  navigation: { setOptions, push, goBack },
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const [commentInputHeight, setCommentInputHeight] = useState<number>(0);
  const [validation, setValidation] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const insets = useSafeAreaInsets();
  const commentListRef = useRef(null);
  const paddingSize = 20;
  const hiddenItemWidth = 60;
  const thumbnailSize = 36;
  const thumbnailKerning = 10;

  const {
    data: guestComment,
    isLoading: isGuestCommentLoading,
    refetch: guestCommentRefetch,
  } = useQuery<GuestCommentResponse, ErrorResponse>(["getGuestComment", clubId], ClubApi.getGuestComment, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getGuestComment ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    staleTime: 10000,
    cacheTime: 15000,
  });

  const createGuestCommentMutation = useMutation<BaseResponse, ErrorResponse, GuestCommentRequest>(ClubApi.createGuestComment, {
    onSuccess: (res) => {
      setComment("");
      setValidation(false);
      Keyboard.dismiss();
      guestCommentRefetch();
      commentListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    },
    onError: (error) => {
      console.log(`API ERROR | createGuestComment ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const deleteGuestCommentMutation = useMutation<BaseResponse, ErrorResponse, GuestCommentDeletionRequest>(ClubApi.deleteGuestComment, {
    onSuccess: (res) => {
      guestCommentRefetch();
      toast.show(`방명록을 삭제했습니다.`, { type: "success" });
    },
    onError: (error) => {
      console.log(`API ERROR | deleteGuestComment ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const guestCommentSubmit = () => {
    if (!validation) return toast.show(`글을 입력하세요.`, { type: "warning" });

    const requestData: GuestCommentRequest = {
      clubId,
      content: comment.trim(),
    };

    createGuestCommentMutation.mutate(requestData);
  };

  const deleteGuestComment = (guestCommentId: number) => {
    if (guestCommentId === undefined) return;
    const requestData: GuestCommentDeletionRequest = { guestCommentId };
    Alert.alert("방명록 삭제", "작성하신 방명록을 삭제하시겠어요?", [
      { text: "아니요" },
      {
        text: "예",
        onPress: () => deleteGuestCommentMutation.mutate(requestData),
      },
    ]);
  };

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HeaderTitleView>
          <HeaderClubName>{clubData.name}</HeaderClubName>
          <HeaderText>방명록</HeaderText>
        </HeaderTitleView>
      ),

      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
        </TouchableOpacity>
      ),
    });
  }, []);

  const goToProfile = (userId: number) => push("ProfileStack", { screen: "Profile", params: { userId } });

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={commentInputHeight} style={{ flex: 1 }}>
        {isGuestCommentLoading ? (
          <Loader>
            <ActivityIndicator />
          </Loader>
        ) : (
          <SwipeListView
            // keyboardDismissMode={"on-drag"}
            listViewRef={commentListRef}
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={{ flexGrow: 1 }}
            data={[...(guestComment?.data ?? [])].reverse()}
            keyExtractor={(item: GuestComment, index: number) => String(index)}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ marginBottom: 40 }}
            renderItem={({ item, index }: { item: GuestComment; index: number }, rowMap: RowMap<GuestComment>) => (
              <SwipeRow disableRightSwipe={true} disableLeftSwipe={item.userId !== me?.id} rightOpenValue={-hiddenItemWidth} tension={60}>
                <HiddenItemContainer>
                  <HiddenItemButton
                    width={hiddenItemWidth}
                    onPress={() => {
                      if (rowMap[index]) rowMap[index].closeRow();
                      deleteGuestComment(item?.id);
                    }}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </HiddenItemButton>
                </HiddenItemContainer>
                <CommentContainer style={{ paddingVertical: 10, paddingLeft: paddingSize, paddingRight: paddingSize }}>
                  <CircleIcon onPress={() => goToProfile(item?.userId)} uri={item?.thumbnail} size={thumbnailSize} kerning={thumbnailKerning} />
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <CommentHeader>
                      <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                        <CommentUserName onPress={() => goToProfile(item?.userId)}>{item?.userName.trim()}</CommentUserName>
                      </TouchableOpacity>
                      <CommentSubText>{moment(item?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</CommentSubText>
                    </CommentHeader>
                    <CommentContent>
                      <CommentContentText>{item?.content.trim()}</CommentContentText>
                    </CommentContent>
                  </View>
                </CommentContainer>
              </SwipeRow>
            )}
            ListEmptyComponent={() => (
              <EmptyView>
                <EmptyText>{`아직 등록된 방명록이 없습니다.\n첫 방명록을 남겨보세요.`}</EmptyText>
              </EmptyView>
            )}
          />
        )}
        <FooterView>
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
                placeholder="방명록을 입력해보세요"
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
            {createGuestCommentMutation.isLoading ? (
              <SubmitLoadingView>
                <ActivityIndicator />
              </SubmitLoadingView>
            ) : (
              <SubmitButton disabled={!validation} onPress={guestCommentSubmit}>
                <SubmitButtonText disabled={!validation}>게시</SubmitButtonText>
              </SubmitButton>
            )}
          </CommentInputView>
        </FooterView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ClubGuestBook;

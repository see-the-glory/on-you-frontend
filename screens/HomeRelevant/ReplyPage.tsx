import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert, Animated, Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableWithoutFeedback, useWindowDimensions,
  View
} from "react-native";
import styled from "styled-components/native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import {
  FeedApi,
  FeedReplyRequest,
  getReply,
  getUserInfo,
  Reply,
  ReplyReponse,
  UserApi,
  UserInfoResponse
} from "../../api";
import { ModifiyPeedScreenProps } from "../../types/feed";
import { useToast } from "react-native-toast-notifications";
import Swipeable from 'react-native-gesture-handler/Swipeable';
const window = Dimensions.get("window");


const Loader = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.SafeAreaView`
  height: 100%;
  position: relative;
  width: 100%;
`;

const CommentList = styled.View`
  height: 95%;
`

const CommentArea = styled.View`
  flex: 1;
  flex-direction: row;
  width: 100%;
  padding: 10px 20px 0 20px;
`;

const CommentImg = styled.Image`
  width: 46px;
  height: 46px;
  border-radius: 100px;
  flex-grow: 0;
  background-color: #c4c4c4;
`;
const CommentId = styled.Text`
  color: black;
  font-size: 12px;
  left: 8px;
  font-weight: bold;
`;

const Comment = styled.Text`
  color: black;
  margin-left: 10px;
  width: 200px;
  left: 5px;
  font-size: 12px;
  font-weight: 300;
`;

const CommentMent = styled.View`
  flex-direction: row;
`;

const CommentRemainder = styled.View`
  flex-direction: row;
`;

const NoReplyText = styled.Text`
  font-size: 20px;
  text-align: center;
  left: 0;
  right: 0;
  margin: auto;
  color: #B0B0B0;
`

const Time = styled.Text`
  font-size: 10px;
  font-weight: 300;
  color: #8e8e8e;
  left: 9px;
`;

const ReplyArea = styled.View`
  display: flex;
  flex-direction: row;
  padding: 1% 0 0 20px;
  height: auto;
`;

const ReplyInputArea = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 88%;
`

const ReplyInput = styled.TextInput`
  color: #b0b0b0;
  left: 15px;
  width: 80%;
`;

const ReplyImg = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 100px;
`;

const ReplyButton = styled.TouchableOpacity``;
const ReplyDone = styled.Text`
  color: #63abff;
  font-size: 15px;
  font-weight: bold;
  width: 30px;
  height: 24px;
  top: 15%;
`;
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const ReplyPage:React.FC<ModifiyPeedScreenProps> = ({
                                                      navigation:{navigate},
                                                      route: { params: { feedData }},
                                                    }) => {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const token = useSelector((state:any) => state.AuthReducers.authToken);
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");


  /** 리플 데이터   */
  const { data: replys, isLoading: replysLoading } =
    useQuery<ReplyReponse>(["getReply",token,feedData.id], FeedApi.getReply,{
      onSuccess: (res) => {
        // console.log(res);
      },
      onError: (err) => {
        console.log(`[getFeeds error] ${err}`);
      },
    });


  /** 유저 데이터   */
  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["userInfo", token], UserApi.getUserInfo);

  // console.log(userInfo?.data.id);

  //댓글추가
  const mutation = useMutation( FeedApi.ReplyFeed, {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res)
        setRefreshing(false);

      } else {
        console.log(`mutation success but please check status code`);
        console.log(res);
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
    onSettled: (res, error) => {},
  });

  const RelpyFeed=()=>{
    if(content === ''){
      Alert.alert('댓글을 입력하세요.')
    }else{
      const data = {
        id: feedData.id,
        content: content,
      };
      Keyboard.dismiss();
      // console.log(data);
      const likeRequestData: FeedReplyRequest=
        {
          data,
          token,
        }
      mutation.mutate(likeRequestData);
    }
    return content.length==0
    }



  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["replys"]);
    setRefreshing(false);
  };

  return replysLoading ? (
    <Loader>
      <ActivityIndicator/>
    </Loader>
  ):(
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 110 : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <CommentList>
              {replys?.data.length !== 0 ?
              <FlatList
                refreshing={refreshing}
                onRefresh={onRefresh}
                keyExtractor={(item: Reply, index: number) => String(index)}
                data={replys?.data}
                disableVirtualization={false}
                renderItem={({ item, index }: { item: Reply; index: number }) => (
                  <ScrollView>
                    <CommentArea key={index}>
                      <CommentImg source={{ uri: item.thumbnail }} />
                      <View style={{ marginBottom: 20, top: 7 }}>
                        <CommentMent>
                          <CommentId>{item.userName}</CommentId>
                          <Comment>{item.content}</Comment>
                        </CommentMent>
                        <CommentRemainder>
                          <Time>{item.created}</Time>
                        </CommentRemainder>
                      </View>
                    </CommentArea>
                  </ScrollView>
                )}
              />:
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <CommentArea>
                  <NoReplyText>아직 등록된 댓글이 없습니다. {"\n"} 첫 댓글을 남겨보세요</NoReplyText>
                </CommentArea>
                </TouchableWithoutFeedback>
              }
            </CommentList>
            <ReplyArea>
              <ReplyImg
                source={{
                  uri: userInfo?.data.thumbnail === null ? "https://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg" : userInfo?.data.thumbnail,
                }}
              />
              <ReplyInputArea>
                {replys?.data.length === null ?
                  <ReplyInput
                    placeholder="댓글을 입력해보세요..."
                    onChangeText={(content) => setContent(content)}
                    autoCompleteType="off"
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline={true}
                    returnKeyType="done"
                    returnKeyLabel="done"
                  />:
                  <ReplyInput
                    placeholder="댓글을 입력해보세요..."
                    onChangeText={(content) => setContent(content)}
                    autoCompleteType="off"
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline={true}
                    returnKeyType="done"
                    returnKeyLabel="done"
                  />
                }
                <ReplyButton onPress={RelpyFeed}>
                  <ReplyDone>게시</ReplyDone>
                </ReplyButton>
              </ReplyInputArea>
            </ReplyArea>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Container>
  );
};
export default ReplyPage;
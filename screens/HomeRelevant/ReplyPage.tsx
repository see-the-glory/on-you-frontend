import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, FlatList, Button, TextInput, Alert, Animated, ActivityIndicator, Image } from "react-native";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { Dimensions } from "react-native";
import { Reply, ReplyResponse, User, FeedApi, UserInfoResponse, getUserInfo, UserApi } from "../../api";
import { ReplyPageScreenProps } from "../../types/feed";
const Container = styled.SafeAreaView`
  flex: 1;
  height: 100%;
  position: absolute;
  width: 100%;
`;

const ReplyContainer = styled.View`
  height: 100%;
  flex-basis: 90%;
`;
const ReplyWriteArea = styled.View`
  height: 100%;
  flex-basis: 10%;
`;

const CommentArea = styled.View`
  flex: 1;
  flex-direction: row;
  width: 100%;
  top: 6px;
  margin: 10px 20px 0 20px;
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

const Time = styled.Text`
  font-size: 10px;
  font-weight: 300;
  color: #8e8e8e;
  left: 9px;
`;

const ReplyArea = styled.View`
  display: flex;
  flex-direction: row;
  padding: 10px 0 10px 20px;
  border: solid 0.5px #c4c4c4;
  bottom: 0;
`;

const ReplyInput = styled.TextInput`
  color: #b0b0b0;
  left: 15px;
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
  left: 550%;
  width: 30px;
  height: 24px;
  top: 15%;
`;
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

//파일전송방법
// route: {
//   params: { category1, category2 },
// },
const ReplyPage: React.FC<ReplyPageScreenProps> = ({ navigation: { navigate },
                                                     route:{params:{userId,id}} }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.AuthReducers.authToken);
  const queryClient = useQueryClient();

  const [content, setContent]=useState<string>("");

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["replys"]);
    setRefreshing(false);
  };

  const FeedId = () => {
    return fetch(`http://3.39.190.23:8080/api/feeds`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  const getReply = () => {
    return fetch(`http://3.39.190.23:8080/api/feeds/${userId}/comments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  const PostReply=()=>{
    return fetch(`http://3.39.190.23:8080/api/feeds/${id}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content)
    }).then((res) => res.json());
  };



  /** 리플 데이터   */
  const { data: replys, isLoading: replysLoading } = useQuery<ReplyResponse>(["getReply"], getReply, {
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(`[getFeeds error] ${err}`);
    },
  });

  /** 유저 데이터   */
  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo);

  console.log(userInfo?.data);

  return (
    <Container>
      <ReplyContainer>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item: Reply, index: number) => String(index)}
            data={replys?.data}
            renderItem={({ item, index }: { item: Reply; index: number }) => (
              <CommentArea>
                <CommentImg source={{ uri: item.thumbnail }} />
                <View style={{ marginBottom: 20, top: 7 }}>
                  <CommentMent>
                    <CommentId>{item.userName}</CommentId>
                    <Comment>{item.content}</Comment>
                  </CommentMent>
                  <CommentRemainder>
                    <Time>{rand(1, 60)}분 전</Time>
                  </CommentRemainder>
                </View>
              </CommentArea>
            )}
          />
        )}
      </ReplyContainer>
      <ReplyWriteArea>
        <ReplyArea>
          <ReplyImg
            source={{
              uri: userInfo?.data.thumbnail === null ? "http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg" : userInfo?.data.thumbnail,
            }}
          />
          <ReplyInput>댓글을 입력해보세요...</ReplyInput>
          <ReplyButton onPress={PostReply}>
            <ReplyDone>게시</ReplyDone>
          </ReplyButton>
        </ReplyArea>
      </ReplyWriteArea>
    </Container>
  );
};
export default ReplyPage;

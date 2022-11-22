import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import {
  ActivityIndicator, Animated,
  FlatList, Keyboard,
  KeyboardAvoidingView,
  Platform, SafeAreaView, ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "react-query";
import {
  Club,
  Feed,
  FeedApi,
  FeedsResponse, FeedUpdateRequest, ModifiedReponse,
  updateFeed, UserApi, UserInfoResponse
} from "../../api";
import { ModifiyPeedScreenProps } from "../../types/feed";
import { RootStackParamList } from "../../types/Club";
import { Modalize, useModalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useNavigation } from "@react-navigation/native";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;
const Container=styled.SafeAreaView`
  flex: 1;
`
const FeedUser = styled.View`
  flex-direction: row;
  padding: 20px 0 0 20px;
`;

const UserInfo = styled.View`
  padding-left: 10px;
`;
const UserImage = styled.Image`
  width: 42.5px;
  height: 42.5px;
  border-radius: 100px;
  background-color: #c4c4c4;
`;

const UserId = styled.Text`
  color: black;
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 5px;
`;
const ClubBox = styled.TouchableOpacity`
  padding: 3px 6px 3px 6px;
  background-color: #c4c4c4;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const ClubName = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: white;
`;
const FeedImage = styled.View`
  padding: 10px 10px;
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  padding: 0 12px 0 12px;
`;

const ContentArea = styled.View`
  height: 20%;
`

const Ment = styled.TextInput`
  width: 100%;
  height: 30%;
  color: black;
  font-size: 20px;
  padding-left: 20px;
`;

const ImageSource = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const FixCompleteText = styled.Text`
  color: #63abff;
  font-size: 15px;
  font-weight: bold;
`

const ModalContainer = styled.View`
  flex: 1;
`;
const ModalView = styled.View`
  background-color: white;
  align-items: center;
  opacity: 1;
  width: 100%;
  height: auto;
`;
const ModalText = styled.Text`
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  padding: 30px;
  width: 100%;
  color: black;
  height: auto;
`;
interface FeedEditItem{
  id:number
  content:string;
  screen: keyof RootStackParamList;
}

const ModifiyPeed:React.FC<ModifiyPeedScreenProps>=({
                                                      navigation:{navigate},
                                                      route:{params: {feedData}}})=> {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false)
  const [content, setContent] = useState("")
  const [data, setData] = useState<Feed>(feedData);
  const [items, setItems] = useState<FeedEditItem[]>();
  const navigation = useNavigation();
  //피드호출
  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingFeeds,
  } = useQuery<ModifiedReponse>(["getFeeds",token,feedData.id], FeedApi.getSelectFeeds, {
    onSuccess: (res) => {
      setIsPageTransition(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["userInfo", token], UserApi.getUserInfo);

  const mutation = useMutation(FeedApi.updateFeed, {
    onSuccess: (res) => {
      if (res.status === 200 && res.json?.resultCode === "OK") {
        return navigate("Tabs", {
          screen: "Home",
        });
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res.json);
        /*  return navigate("Tabs", {
            screen: "Home",
          });*/
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      /*   return navigate("Tabs", {
           screen: "Home",
         });*/
    },
    onSettled: (res, error) => {},
  });

  //피드업데이트
  const FixComplete =() =>{
    const data={
      id: feedData.id,
      access: "PUBLIC",
      content: content,
    };
    console.log(data);

    const requestData: FeedUpdateRequest={
      data,
      token,
    };
    mutation.mutate(requestData);
    return navigate("Tabs", {
      screen: "Home",
    });
  };
  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <TouchableOpacity onPress={FixComplete}><FixCompleteText>저장</FixCompleteText></TouchableOpacity>
    })
  },[navigation, FixComplete]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <KeyboardAvoidingView behavior={Platform.select({ios: 'position', android: 'position'})} style={{flex: 1}}>
          <View>
            <FeedUser >
              <UserImage source={{ uri: userInfo?.data.thumbnail }} />
              <UserInfo>
                <UserId>{data.userName}</UserId>
                <UserId>{data.id}</UserId>
                <ClubBox>
                  <ClubName>{data.clubName}</ClubName>
                </ClubBox>
              </UserInfo>
            </FeedUser>
            <FeedImage>
              <ImageSource source={data.imageUrls[0]===undefined?{uri:"https://i.pinimg.com/564x/eb/24/52/eb24524c5c645ce204414237b999ba11.jpg"}:{uri:data.imageUrls[0]}} size={FEED_IMAGE_SIZE}/>
            </FeedImage>
          </View>
          <ContentArea>
            <Ment
              onChangeText={(content) => setContent(content)}
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              returnKeyType="done"
              returnKeyLabel="done"
            >
              {data.content}
            </Ment>
          </ContentArea>
        </KeyboardAvoidingView>
      </Container>
    </TouchableWithoutFeedback>
  );
};
export default ModifiyPeed;
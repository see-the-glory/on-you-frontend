import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Keyboard, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { Feed, FeedApi, FeedUpdateRequest, ModifiedReponse, UserApi, UserInfoResponse } from "../../api";
import { ModifiyFeedScreenProps } from "../../types/feed";
import { RootStackParamList } from "../../types/Club";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../components/CustomTextInput";
import CustomText from "../../components/CustomText";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;
const Container = styled.SafeAreaView`
  flex: 1;
  margin-bottom: ${Platform.OS === "ios" ? 20 : 30}px;
  padding: 0 20px 0 20px;
`;
const FeedUser = styled.View`
  flex-direction: row;
  padding: 20px 0 0 0px;
`;

const UserInfo = styled.View`
  padding-left: 10px;
`;

const UserImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  border-style: solid;
  border-color: #dddddd;
  border-width: 1.5px;
  background-color: #c4c4c4;
`;

const UserId = styled(CustomText)`
  color: black;
  font-family: "NotoSansKR-Bold";
  font-size: 14px;
  margin-bottom: 5px;
`;
const ClubBox = styled.TouchableOpacity`
  padding: 3px 6px 3px 6px;
  background-color: #c4c4c4;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const ClubName = styled(CustomText)`
  font-size: 10px;
  line-height: 15px;
  font-weight: 500;
  color: white;
`;

const FeedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin: 20px 40px 10px 0;
`;

const FeedImage = styled.View`
  padding: 10px 10px;
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  padding: 0 12px 0 12px;
`;

const ContentArea = styled.View``;
const ImageArea = styled.View`
  // padding-bottom: 1px;
`;

const Ment = styled(CustomTextInput)`
  width: 100%;
  height: 150px;
  color: black;
  font-size: 14px;
`;

const ImageSource = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

interface FeedEditItem {
  id: number;
  content: string;
  screen: keyof RootStackParamList;
}

const ModifiyFeed: React.FC<ModifiyFeedScreenProps> = ({
  navigation: { navigate },
  route: {
    params: { feedData },
  },
}) => {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const [content, setContent] = useState("");
  const [data, setData] = useState<Feed>(feedData);
  const [items, setItems] = useState<FeedEditItem[]>();
  const navigation = useNavigation();
  //피드호출
  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingFeeds,
  } = useQuery<ModifiedReponse>(["getFeeds", token, feedData.id], FeedApi.getSelectFeeds, {
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
      if (res.status === 200) {
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
  const FixComplete = async () => {
    const data = {
      id: feedData.id,
      access: "PUBLIC",
      content: content,
    };
    console.log("fixed Data:", data);

    const requestData: FeedUpdateRequest = {
      data,
      token,
    };

    mutation.mutate(requestData);
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={FixComplete}>
          <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>저장</CustomText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, FixComplete]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <KeyboardAvoidingView behavior={Platform.select({ ios: "position", android: "position" })} style={{ flex: 1 }}>
          {/* <ImageArea> */}
          <FeedUser>
            <UserImage source={{ uri: userInfo?.data.thumbnail }} />
            <UserInfo>
              <UserId>{data.userName}</UserId>
              <ClubBox>
                <ClubName>{data.clubName}</ClubName>
              </ClubBox>
            </UserInfo>
          </FeedUser>
          <FeedImage>
            <ImageSource
              source={data.imageUrls[0] === undefined ? { uri: "https://i.pinimg.com/564x/eb/24/52/eb24524c5c645ce204414237b999ba11.jpg" } : { uri: data.imageUrls[0] }}
              size={FEED_IMAGE_SIZE}
            />
          </FeedImage>
          {/* </ImageArea> */}
          <ContentArea>
            <Ment
              onChangeText={(content) => setContent(content)}
              placeholderTextColor="#B0B0B0"
              placeholder="게시글 입력 ..."
              textAlign="left"
              textAlignVertical="top"
              multiline={true}
              maxLength={1000}
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
export default ModifiyFeed;

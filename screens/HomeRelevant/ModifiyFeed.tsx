import React, { useEffect, useState,useRef } from "react";
import styled from "styled-components/native";
import {
  ActivityIndicator, Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform, SafeAreaView, ScrollView,
  StatusBar, Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native";
import { useSelector } from "react-redux";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "react-query";
import { Feed, FeedApi, FeedUpdateRequest, ModifiedReponse, UserApi, UserInfoResponse,Club,ClubResponse } from "../../api";
import { ModifiyFeedScreenProps } from "../../types/feed";
import { RootStackParamList } from "../../types/Club";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../components/CustomTextInput";
import CustomText from "../../components/CustomText";
import {
  ImageSlider
} from "react-native-image-slider-banner";
import { Modalize,useModalize } from "react-native-modalize";
// import { Portal } from "react-native-portalize";
import { Portal } from 'react-native-paper';
import { MaterialIcons,Ionicons } from "@expo/vector-icons";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;
const Container = styled.SafeAreaView`
  flex: 1;
  margin-bottom: ${Platform.OS === "ios" ? 20 : 30}px;
`;
const FeedUser = styled.View`
  flex-direction: row;
  padding: 20px 0 0 20px;
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
  font-size: 16px;
  font-weight: bold;
`;
const ClubModIcon=styled.View`
  display: flex;
  flex-direction: row;
`
const ClubBox = styled.TouchableOpacity`
  padding: 3px 6px 3px 6px;
  background-color: #c4c4c4;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
`;

const ClubName = styled(CustomText)`
  font-size: 10px;
  line-height: 15px;
  font-weight: 500;
  color: white;
`;

const FeedImage = styled.View`
  padding: 10px 0 0 0;
  justify-content: center;
  align-items: center;
  width: 100%;
`;


const ContentArea = styled.View`
  padding: 0 20px;
  flex:1;
`;

const Ment = styled(CustomTextInput)`
  width: 100%;
  height: 100px;
  color: black;
  font-size: 14px;
  padding-top: 5%;
`;

const ImageSource = styled.Image<{ size: number }>`
  width: 100%;
  height: 400px;
`;

const ModalArea = styled.View`
  flex: 1;
`

//모달
const ClubArea = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 5px 0 0 0;
  border-style: solid;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 1px;
`;

const ClubImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin: 5px;
`;

const ClubMy = styled.View`
  justify-content: center;
  padding-top: 3%;
`;
const ClubId = styled(CustomText)`
  padding-left: 2%;
  color: black;
  font-size: 12px;
  font-weight: bold;
`;

const CommentMent = styled.View`
  flex-direction: row;
  padding-bottom: 4px;
`;

const CommentRemainder = styled.View`
  flex-direction: row;
`;

const CtrgArea = styled.View`
  width: auto;
  height: auto;
  margin: 0.1px 6px 13.9px 8px;
  border-radius: 3px;
  background-color: #c4c4c4;
`;

const CtgrText = styled.View`
  display: flex;
  flex-direction: row;
  margin: 3px 5px 3px 5px;
`;

const OrganizationName = styled(CustomText)`
  width: auto;
  height: auto;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #fff;
`;

//
const ModalContainer = styled.View`
  flex: 1;
`;

const ModalView = styled.View`
  background-color: white;
  opacity: 1;
  width: 100%;
  padding: 10px 20px 0 20px;
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const token = useSelector((state:any) => state.AuthReducers.authToken);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const [content, setContent] = useState(feedData.content);
  const [data, setData] = useState<Feed>(feedData);
  const navigation = useNavigation();
  const modalizeRef = useRef<Modalize>(null);
  const [loading, setLoading] = useState(false);
  const [isSummitShow, setSummitShow] = useState(true)//저장버튼 로딩
  const onOpen = () => {
    console.log("Before Modal Passed FeedId");
    modalizeRef.current?.open();
  };
  const onClose=()=>{
    modalizeRef.current?.close();
  }
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
    if(content.length == 0){
      Alert.alert('글을 수정하세요');
    }else{
      setSummitShow(false);
      const data = {
        id: feedData.id,
        access: "PUBLIC",
        content: content,
        clubId: feedData.clubId
      };
      console.log("fixed Data:", data);

      const requestData: FeedUpdateRequest = {
        data,
        token,
      };

      mutation.mutate(requestData);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={FixComplete}>
          {isSummitShow?
            <CustomText style={{ color: "#2995FA", fontSize: 18, lineHeight: 20 }}>저장</CustomText>
            :<ActivityIndicator/>}
        </TouchableOpacity>
      ),
    });
  }, [navigation, FixComplete,isSummitShow]);

  const imageList = [];
  for (let i = 0; i < feedData?.imageUrls?.length; i++) {
    imageList.push({ img: feedData?.imageUrls[i] });
  }

  const {
    isLoading: myClubInfoLoading, // true or false
    data: myClub,
  } = useQuery<ClubResponse>(["selectMyClubs", token], UserApi.selectMyClubs);

  const ChangeClub = (id:any, name:any) =>{
    data.clubName = name;
    feedData.clubId = id;
    onRefresh();
    modalizeRef.current?.close();
  }

  const onRefresh = async () => {
    console.log("onRefresh executed");
    setRefreshing(true);
    await queryClient.refetchQueries(["getFeeds"]).then(() => {
      setRefreshing(false);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <KeyboardAvoidingView behavior={Platform.select({ ios: "position", android: "position" })} style={{ flex: 1 }}>
          <FeedUser>
            <UserImage source={{ uri: userInfo?.data.thumbnail }} />
            <UserInfo>
              <UserId>{data.userName}</UserId>
              <ClubBox onPress={onOpen}>
                <ClubName>{data.clubName}</ClubName>
                <Ionicons name="pencil" size={18} style={{left: 3, top: 2}} color="gray" />
              </ClubBox>
            </UserInfo>
          </FeedUser>
          {/* <TouchableOpacity>
              <Ionicons name="pencil" size={18} style={{left: 3, top: 2}} color="gray" />
            </TouchableOpacity>*/}
          <Modalize ref={modalizeRef} modalHeight={250}
                    handlePosition="inside" modalStyle={{top: 250}}
                    disableScrollIfPossible={false}
          >
            <ModalContainer>
              <ModalView >
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <FlatList
                    refreshing={refreshing} onRefresh={onRefresh}
                    keyExtractor={(item: Club, index: number) => String(index)}
                    data={myClub?.data}
                    renderItem={({ item, index }: { item: Club; index: number }) => (
                      <>
                        <ClubArea onPress={()=>ChangeClub(item.id, item.name)}>
                          <ClubImg source={{ uri: item.thumbnail }} />
                          <ClubMy>
                            <CommentMent>
                              <ClubId>{item.name}</ClubId>
                            </CommentMent>
                            <CommentRemainder>
                              <CtrgArea>
                                <CtgrText>
                                  <OrganizationName>{item.categories?.map((name)=>{return name.name})}</OrganizationName>
                                </CtgrText>
                              </CtrgArea>
                            </CommentRemainder>
                          </ClubMy>
                        </ClubArea>
                      </>
                    )}
                  />
                )}
              </ModalView>
            </ModalContainer>
          </Modalize>
          <FeedImage>
            {data.imageUrls?.length > 1 ?
              (
                <ImageSlider
                  data={imageList}
                  preview={false}
                  caroselImageStyle={{resizeMode: 'cover',height: 400}}
                  activeIndicatorStyle={{backgroundColor: 'orange'}}
                  indicatorContainerStyle={{ bottom: 0 }}
                />
              ):(
                <ImageSource source={{uri: data.imageUrls[0]}} size={400}/>
              )}
          </FeedImage>
          <ContentArea>
            <Ment
              onChangeText={(content:any) => setContent(content)}
              placeholderTextColor="#B0B0B0"
              placeholder="게시글 입력 ..."
              textAlign="left"
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
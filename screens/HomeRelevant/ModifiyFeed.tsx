import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components/native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Feed, FeedApi, FeedUpdateRequest, ModifiedReponse, UserApi, UserInfoResponse, Club, ClubResponse, ClubApi } from "../../api";
import { ModifiyFeedScreenProps } from "../../types/feed";
import { ClubStackParamList } from "../../types/Club";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../components/CustomTextInput";
import CustomText from "../../components/CustomText";
import { ImageSlider } from "react-native-image-slider-banner";
import { Modalize, useModalize } from "react-native-modalize";
import {
  MaterialIcons,
  Ionicons,
  Entypo
} from "@expo/vector-icons";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const FeedUser = styled.View`
  flex-direction: row;
  padding: 15px;
`;

const UserInfo = styled.View`
  padding-left: 10px;
`;

const UserImage = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 100px;
  border-style: solid;
  border-color: #dddddd;
  border-width: 1.5px;
  background-color: #c4c4c4;
`;

const UserId = styled(CustomText)`
  font-size: 16px;
  font-family: "NotoSansKR-Medium";
  color: #2b2b2b;
  line-height: 25px;
  bottom: 1px;
`;
const ClubModIcon = styled.View`
  display: flex;
  flex-direction: row;
`;
const ClubBox = styled.View`
/*  padding: 1px 6px 1px 6px;
  background-color: #c4c4c4;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  top: 1%;*/
  flex-direction: row;
  align-items: center;
  background-color: #c4c4c4;
  padding: 2px 6px;
  border-radius: 5px;
  margin-right: 5px;
  ${(props: any) => (props.borderColor ? `border: 1px solid ${props.borderColor};` : "")}
`;

const ClubName = styled.Text`
  font-size: 11px;
  line-height: 14px;
  color: ${(props: any) => (props.color ? props.color : "white")};
`;

const FeedImage = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 67%;
`;

const ContentArea = styled.View`
  padding: 0 20px 0 20px;
  top: ${Platform.OS === "ios" ? 2 : 0}%;
  font-size: 15px;
`;

const Ment = styled(CustomTextInput)`
  width: 100%;
  height: 50px;
  color: black;
  font-size: 14px;
`;

const ImageSource = styled.Image`
  width: 100%;
  height: 105%;
  background-color: lightgray;
`;

const ModalArea = styled.View`
  flex: 1;
`;

//모달
const ClubArea = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 5px 15px 0 0px;
  border-style: solid;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 1px;
  align-self: flex-start;
`;

const ClubImg = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 25px;
  margin: 5px;
`;

const HeaderNameView = styled.View`
  justify-content: center;
  align-items: flex-start;
  padding-left: 4px;
  bottom: 1px;
`;
const ModalClubName = styled.Text`
  padding-left: 1%;
  color: black;
  font-size: 17px;
  font-weight: 500;
  padding-top: 2%;
`;

const ModalClubNameArea = styled.View`
  flex-direction: row;
  padding-bottom: 4px;
`;
const CommentRemainder = styled.View`
  flex-direction: row;
`;

const CtrgArea = styled.View`
  width: auto;
  height: auto;
  margin: 5px 2px;
  bottom: 6px;
  border-radius: 7px;
  display: flex;
  flex-direction: row;
  background-color: #c4c4c4;
`;

const CtgrText = styled.View`
  margin: 0 4px 1px 4px;
`;

const ClubCtrgList = styled(CustomText)`
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
  top: 2%;
`;

const IntroTextLeft = styled(CustomText)`
  text-align: left;
  padding-left: 20px;
  font-size: 10px;
  color: #b0b0b0;
`;

const IntroTextRight = styled(CustomText)`
  text-align: right;
  font-size: 10px;
  padding-right: 20px;
  color: #b0b0b0;
`;

const ModalView = styled.View`
  background-color: white;
  opacity: 1;
  width: 100%;
  padding: 10px 20px 0 20px;
  height: auto;
`;

const FeedModifyFin = styled.Text`
  font-size: 14px;
  color: #63abff;
  line-height: 20px;
  padding-top: 5px;
`

interface FeedEditItem {
  id: number;
  content: string;
  screen: keyof ClubStackParamList;
}

const ModifiyFeed: React.FC<ModifiyFeedScreenProps> = ({
  navigation: { navigate },
  route: {
    params: { feedData },
  },
}) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.token);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const [content, setContent] = useState(feedData.content);
  const [data, setData] = useState<Feed>(feedData);
  const navigation = useNavigation();
  const modalizeRef = useRef<Modalize>(null);
  const [loading, setLoading] = useState(false);
  const [isSummitShow, setSummitShow] = useState(true); //저장버튼 로딩
  const onOpen = () => {
    console.log("Before Modal Passed FeedId");
    modalizeRef.current?.open();
  };
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
    if (content?.length == 0) {
      Alert.alert("글을 수정하세요");
    } else {
      setSummitShow(false);
      const data = {
        id: feedData.id,
        access: "PUBLIC",
        content: content,
        clubId: feedData.clubId,
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
      headerLeft: () => (
          <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
            <Entypo name="chevron-thin-left" size={20} color="black" />
          </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={FixComplete}>{isSummitShow ?
            <FeedModifyFin>저장</FeedModifyFin> : <ActivityIndicator />}</TouchableOpacity>
      ),
    });
  }, [navigation, FixComplete, isSummitShow]);

  const imageList = [];
  for (let i = 0; i < feedData?.imageUrls?.length; i++) {
    imageList.push({ img: feedData?.imageUrls[i] });
  }

  const {
    isLoading: myClubInfoLoading, // true or false
    data: myClub,
  } = useQuery<ClubResponse>(["selectMyClubs", token], ClubApi.selectMyClubs);

  const ChangeClub = (id: any, name: any) => {
    data.clubName = name;
    feedData.clubId = id;
    onRefresh();
    modalizeRef.current?.close();
  };

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
              <View style={{ display: "flex", flexDirection: "row" }}>
                <ClubBox>
                  <ClubName>{data.clubName}</ClubName>
                </ClubBox>
                <TouchableOpacity onPress={onOpen}>
                  <Ionicons name="pencil" size={18} style={{top: 1 }} color="gray" />
                </TouchableOpacity>
              </View>
            </UserInfo>
          </FeedUser>
          {/* <TouchableOpacity>
              <Ionicons name="pencil" size={18} style={{left: 3, top: 2}} color="gray" />
            </TouchableOpacity>*/}
          <Modalize ref={modalizeRef} modalHeight={400} handlePosition="inside" modalStyle={{ top: 280 }} disableScrollIfPossible={false}>
            <ModalContainer>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <IntroTextLeft>모임 변경</IntroTextLeft>
                <IntroTextRight>가입한 모임 List</IntroTextRight>
              </View>
              <ModalView>
                <FlatList
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  keyExtractor={(item: Club, index: number) => String(index)}
                  data={myClub?.data}
                  renderItem={({ item, index }: { item: Club; index: number }) => (
                    <>
                      <ClubArea onPress={() => ChangeClub(item.id, item.name)}>
                        <ClubImg source={{ uri: item.thumbnail }} />
                        <HeaderNameView>
                          <ModalClubNameArea>
                            <ModalClubName>{item.name}</ModalClubName>
                          </ModalClubNameArea>
                          <CommentRemainder>
                            {item.categories?.map((name) => {
                              return (
                                <CtrgArea>
                                  <CtgrText>
                                    <ClubCtrgList>{name.name}</ClubCtrgList>
                                  </CtgrText>
                                </CtrgArea>
                              );
                            })}
                          </CommentRemainder>
                        </HeaderNameView>
                      </ClubArea>
                    </>
                  )}
                />
              </ModalView>
            </ModalContainer>
          </Modalize>
          <FeedImage>
            {data.imageUrls?.length > 1 ? (
              <ImageSlider
                data={imageList}
                preview={false}
                caroselImageStyle={{ resizeMode: "cover" }}
                activeIndicatorStyle={{ backgroundColor: "orange" }}
                indicatorContainerStyle={{ bottom: 0 }}
              />
            ) : (
              <ImageSource source={{ uri: data.imageUrls[0] }} size={0} resizeMode="contain" />
            )}
          </FeedImage>
          <ContentArea>
            <Ment
              onChangeText={(content: any) => setContent(content)}
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

import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components/native";
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Feed, FeedApi, FeedUpdateRequest, UserApi, UserInfoResponse, Club, ClubResponse, ClubApi, MyClub, ErrorResponse, FeedResponse, MyClubsResponse, BaseResponse } from "../../api";
import { ModifiyFeedScreenProps } from "../../types/feed";
import { ClubStackParamList } from "../../types/Club";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../components/CustomTextInput";
import CustomText from "../../components/CustomText";
import { Modalize, useModalize } from "react-native-modalize";
import { MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import Carousel from "../../components/Carousel";
import FastImage from "react-native-fast-image";
import { Portal } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const FeedUser = styled.View`
  flex-direction: row;
  padding: 10px 20px;
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
  color: #2b2b2b;
  line-height: 25px;
  bottom: 1px;
`;

const ClubBox = styled.View`
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

const ContentArea = styled.View`
  padding: 0 20px 0 20px;
  top: 2%;
  font-size: 15px;
  height: 100px;
`;

const Ment = styled(CustomTextInput)`
  width: 100%;
  height: 100px;
  color: black;
  font-size: 14px;
`;

const ModalArea = styled.View`
  flex: 1;
`;

//모달
const ClubArea = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 0 15px 0 0;
  border-style: solid;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 1px;
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
  padding: 10px 20px 20px 20px;
  height: auto;
`;

const FeedModifyFin = styled.Text`
  font-size: 14px;
  color: #63abff;
  line-height: 20px;
  padding-top: 5px;
`;

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
  const me = useSelector((state: RootState) => state.auth.user);
  const [content, setContent] = useState(feedData.content);
  const navigation = useNavigation();
  const modalizeRef = useRef<Modalize>(null);
  const [isSummitShow, setSummitShow] = useState(true); //저장버튼 로딩
  const [clubId, setClubId] = useState(feedData.clubId);
  const [clubName, setClubName] = useState(feedData.clubName);
  const feedSize = Dimensions.get("window").width;
  const toast = useToast();

  const onOpen = () => {
    console.log("Before Modal Passed FeedId");
    modalizeRef.current?.open();
  };

  const mutation = useMutation<BaseResponse, ErrorResponse, FeedUpdateRequest>(FeedApi.updateFeed, {
    onSuccess: (res) => {
      toast.show(`피드가 수정되었습니다.`, { type: "success" });
      DeviceEventEmitter.emit("HomeFeedRefetch");
      navigate("Tabs", { screen: "Home" });
    },
    onError: (error) => {
      console.log(`API ERROR | updateFeed ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  //피드업데이트
  const FixComplete = async () => {
    if (content?.length == 0) {
      Alert.alert("글을 수정하세요");
    } else {
      setSummitShow(false);
      const data = {
        id: feedData.id,
        clubId: clubId,
        access: "PUBLIC",
        content: content,
      };
      console.log("fixed Data:", data);

      const requestData: FeedUpdateRequest = { data };

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
      headerRight: () => <TouchableOpacity onPress={FixComplete}>{isSummitShow ? <FeedModifyFin>저장</FeedModifyFin> : <ActivityIndicator />}</TouchableOpacity>,
    });
  }, [navigation, FixComplete, isSummitShow]);

  const {
    isLoading: clubInfoLoading, // true or false
    data: club,
  } = useQuery<MyClubsResponse, ErrorResponse>(["getMyClubs"], UserApi.getMyClubs);

  const ChangeClub = (id: any, name: any) => {
    console.log(id, name);
    setClubName(name);
    setClubId(id);
    modalizeRef.current?.close();
  };

  return (
      <Container>
        <KeyboardAvoidingView behavior={Platform.select({ ios: "position", android: "position" })} style={{ flex: 1 }}>
          <FeedUser>
            <UserImage source={{ uri: me?.thumbnail }} />
            <UserInfo>
              <UserId>{feedData.userName}</UserId>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <ClubBox>
                  <ClubName>{clubName}</ClubName>
                </ClubBox>
                <TouchableOpacity onPress={onOpen}>
                  <Ionicons name="pencil" size={18} style={{ top: 1 }} color="gray" />
                </TouchableOpacity>
              </View>
            </UserInfo>
          </FeedUser>
          <Portal>
            <Modalize ref={modalizeRef} modalHeight={300}
                      handleStyle={{ top: 14, height: 3, width: 35, backgroundColor: "#d4d4d4" }}
                      handlePosition="inside"
                      modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <ModalContainer>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <IntroTextLeft>모임 변경</IntroTextLeft>
                  <IntroTextRight>가입한 모임 List</IntroTextRight>
                </View>
                <ModalView>
                    <FlatList
                        refreshing={refreshing}
                        keyExtractor={(item: MyClub, index: number) => String(index)}
                        data={club?.data}
                        renderItem={({ item, index }: { item: MyClub; index: number }) => (
                            <>
                              {item.applyStatus === "APPROVED" ? (
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
                              ) : null}
                            </>
                        )}
                    />
                </ModalView>
              </ModalContainer>
            </Modalize>
          </Portal>
          <Carousel
              pages={feedData.imageUrls}
              pageWidth={feedSize}
              gap={0}
              offset={0}
              initialScrollIndex={0}
              keyExtractor={(item: string, index: number) => String(index)}
              showIndicator={true}
              renderItem={({ item, index }: { item: string; index: number }) => (
                  <FastImage key={String(index)} source={item ? { uri: item } : require("../../assets/basic.jpg")} style={{ width: feedSize, height: feedSize }} resizeMode={"contain"} />
              )}
              ListEmptyComponent={<FastImage source={require("../../assets/basic.jpg")} style={{ width: feedSize, height: feedSize }} resizeMode={"contain"} />}
          />
          <ContentArea>
            <Ment
                onChangeText={(content: any) => setContent(content)}
                placeholderTextColor="#B0B0B0"
                placeholder="게시글 입력 ..."
                textAlign="left"
                multiline={true}
                maxLength={999}
                returnKeyType="done"
                returnKeyLabel="done"
            >
              {feedData.content}
            </Ment>
          </ContentArea>
        </KeyboardAvoidingView>
      </Container>
  );
};
export default ModifiyFeed;

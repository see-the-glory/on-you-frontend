import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import styled from "styled-components/native";
import { ActivityIndicator, Alert, DeviceEventEmitter, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { FeedApi, FeedUpdateRequest, UserApi, MyClub, ErrorResponse, MyClubsResponse, BaseResponse } from "../../api";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../../components/CustomTextInput";
import CustomText from "../../components/CustomText";
import { Modalize } from "react-native-modalize";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "../../components/Carousel";
import FastImage from "react-native-fast-image";
import { Portal } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";
import { BackHandler } from "react-native";
import CircleIcon from "../../components/CircleIcon";
import Tag from "../../components/Tag";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FeedUser = styled.View`
  flex-direction: row;
  padding: 10px;
`;

const UserInfo = styled.View`
  padding-left: 10px;
  justify-content: center;
`;

const UserInfoSubButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const UserId = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 16px;
  color: #2b2b2b;
  margin-bottom: 2px;
  line-height: 22px;
`;

const ContentInfo = styled.View`
  padding: 10px 10px 0px 0px;
  align-items: flex-end;
  justify-content: center;
`;

const InfoText = styled(CustomText)`
  font-size: 12px;
  color: #b5b5b5;
`;

const ContentArea = styled.View`
  margin: 0px 10px 50px 10px;
  padding: 10px;
  background-color: #f3f3f3;
`;

const Ment = styled(CustomTextInput)`
  width: 100%;
  height: 250px;
  color: black;
  font-size: 14px;
  line-height: 20px;
`;

//모달
const ClubArea = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  padding: 10px 20px;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 0.5px;
  align-items: center;
`;

const HeaderNameView = styled.View`
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
`;

const ModalClubName = styled(CustomText)<{ selected: boolean }>`
  font-family: "NotoSansKR-Medium";
  color: ${(props: any) => (props.selected ? "#B0B0B0" : "#2B2B2B")};
  font-size: 14px;
  line-height: 22px;
`;

const ModalClubNameArea = styled.View`
  flex-direction: row;
`;
const CommentRemainder = styled.View`
  flex-direction: row;
`;

const ModalContainText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
`;

const IntroTextLeft = styled(CustomText)`
  text-align: left;
  line-height: 19px;
  font-size: 12px;
  padding-left: 20px;
  color: #b0b0b0;
`;

const IntroTextRight = styled(CustomText)`
  text-align: right;
  font-size: 12px;
  line-height: 19px;
  padding-right: 20px;
  color: #b0b0b0;
`;

const FeedModifyFin = styled.Text`
  font-size: 14px;
  color: #63abff;
  line-height: 20px;
  padding-top: 5px;
`;

const FeedModification = ({
  navigation: { navigate, goBack },
  route: {
    params: { feedData },
  },
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const [content, setContent] = useState<string>(feedData.content);
  const navigation = useNavigation();
  const modalizeRef = useRef<Modalize>(null);
  const [clubId, setClubId] = useState<number>(feedData.clubId);
  const [clubName, setClubName] = useState<string>(feedData.clubName);
  const feedSize = Dimensions.get("window").width;
  const toast = useToast();
  const maxLength = 1000;

  const onOpen = () => {
    console.log("Before Modal Passed FeedId");
    modalizeRef.current?.open();
  };

  const mutation = useMutation<BaseResponse, ErrorResponse, FeedUpdateRequest>(FeedApi.updateFeed, {
    onSuccess: (res) => {
      toast.show(`피드가 수정되었습니다.`, { type: "success" });
      DeviceEventEmitter.emit("HomeAllRefetch");
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
      const data = {
        id: feedData.id,
        clubId: clubId,
        access: "PUBLIC",
        content: content,
      };

      const requestData: FeedUpdateRequest = { data };
      mutation.mutate(requestData);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        mutation.isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={FixComplete}>
            <FeedModifyFin>저장</FeedModifyFin>
          </TouchableOpacity>
        ),
    });
  }, [content, clubId, mutation.isLoading]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  const { isLoading: clubInfoLoading, data: club } = useQuery<MyClubsResponse, ErrorResponse>(["getMyClubs"], UserApi.getMyClubs, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getMyClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const ChangeClub = (id: any, name: any) => {
    console.log(id, name);
    setClubName(name);
    setClubId(id);
    modalizeRef.current?.close();
  };

  const modalRenderItem = ({ item, index }: { item: MyClub; index: number }) => (
    <ClubArea key={`Club_${index}`} onPress={() => ChangeClub(item.id, item.name)}>
      <CircleIcon size={45} uri={item.thumbnail} />
      <HeaderNameView>
        <ModalClubNameArea>
          <ModalClubName selected={item.id === clubId}>{item.name}</ModalClubName>
        </ModalClubNameArea>
        <CommentRemainder>
          {item.categories?.map((category, index) => (
            <Tag key={`Category_${index}`} textColor="white" backgroundColor="#C4C4C4" name={category.name} />
          ))}
        </CommentRemainder>
      </HeaderNameView>
    </ClubArea>
  );

  const modalListHeaderComponent = () => (
    <ModalContainText>
      <IntroTextLeft>모임 변경</IntroTextLeft>
      <IntroTextRight>가입한 모임 List</IntroTextRight>
    </ModalContainText>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90} style={{ flex: 1 }}>
      <ScrollView>
        <FeedUser>
          <CircleIcon size={45} uri={me?.thumbnail} />
          <UserInfo>
            <UserId>{feedData.userName}</UserId>
            <UserInfoSubButton onPress={onOpen} activeOpacity={1}>
              <Tag name={clubName} textColor="black" backgroundColor="#E0E0E0" />
              <MaterialCommunityIcons name="pencil-outline" size={20} color="#C4C4C4" />
            </UserInfoSubButton>
          </UserInfo>
        </FeedUser>
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

        <ContentInfo>
          <InfoText>{`${content.length} / ${maxLength}`}</InfoText>
        </ContentInfo>
        <ContentArea>
          <Ment
            value={content}
            onChangeText={(content: string) => setContent(content)}
            placeholderTextColor="#B0B0B0"
            placeholder="게시글 입력 ..."
            textAlignVertical="top"
            textAlign="left"
            multiline={true}
            maxLength={maxLength}
            includeFontPadding={false}
          />
        </ContentArea>
      </ScrollView>

      <Portal>
        <Modalize
          ref={modalizeRef}
          modalHeight={300}
          handleStyle={{ top: 14, height: 3, width: 35, backgroundColor: "#d4d4d4" }}
          handlePosition="inside"
          modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingTop: 30 }}
          flatListProps={
            clubInfoLoading
              ? undefined
              : {
                  data: Array.isArray(club?.data) ? club?.data?.filter((item) => item.applyStatus === "APPROVED") : [],
                  renderItem: modalRenderItem,
                  ListHeaderComponent: modalListHeaderComponent,
                  keyExtractor: (item, index) => String(index),
                  showsVerticalScrollIndicator: false,
                  stickyHeaderIndices: [0],
                }
          }
        >
          {clubInfoLoading ? (
            <Loader>
              <ActivityIndicator />
            </Loader>
          ) : null}
        </Modalize>
      </Portal>
    </KeyboardAvoidingView>
  );
};
export default FeedModification;

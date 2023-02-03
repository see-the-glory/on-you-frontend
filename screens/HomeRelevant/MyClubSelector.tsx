import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {ActivityIndicator, FlatList, View, Text, TouchableOpacity, DeviceEventEmitter} from "react-native";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Club, ClubApi, ClubResponse, ClubsParams, ClubsResponse, Feed, MyClub, MyClubResponse, UserApi } from "../../api";
import { MyClubSelectorScreenProps } from "../../types/feed";
import CustomText from "../../components/CustomText";
import {Entypo} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
const Container = styled.SafeAreaView`
  flex: 1;
  height: 100%;
  position: absolute;
  width: 100%;
`;

const IntroText = styled(CustomText)`
  text-align: left;
  padding: 10px 0 0 20px;
  font-size: 12px;
  color: #b0b0b0;
`;

const ReplyContainer = styled.View`
  height: 100%;
`;

const ClubArea = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 5px 15px 0 15px;
  border-style: solid;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 1px;
  align-self: flex-start;
`;

const ClubImg = styled.Image`
  width: 46px;
  height: 46px;
  border-radius: 25px;
  margin: 5px;
`;

const ClubMy = styled.View`
  justify-content: center;
`;

const CommentMent = styled.View`
  flex-direction: row;
  padding-bottom: 4px;
`;

const ClubName = styled.Text`
  padding-left: 1%;
  color: black;
  font-size: 17px;
  font-weight: 500;
  padding-top: 2%;
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

const HeaderNameView = styled.View`
  justify-content: center;
  align-items: flex-start;
  padding-left: 4px;
  bottom: 1px;
`;

const HeaderText = styled(CustomText)`
  font-size: 16px;
  font-family: "NotoSansKR-Medium";
  color: #2b2b2b;
  line-height: 25px;
  bottom: 1px;
`;
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const MyClubSelector: React.FC<MyClubSelectorScreenProps> = ({
                                                               navigation: {setOptions,navigate,goBack },
                                                               route: {
                                                                 params: { userId },
                                                               },
                                                             }) => {
  const token = useSelector((state: any) => state.auth.token);
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [params, setParams] = useState<ClubsParams>({
    token,
    categoryId: 0,
    minMember: null,
    maxMember: null,
    sortType: "created",
    orderBy: "DESC",
    showRecruiting: 0,
    showMy: 0,
  });
  const [clubId, setClubId] = useState("");
  const [clubName, setClubName] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    isLoading: myClubInfoLoading, // true or false
    data: myClub,
  } = useQuery<MyClubResponse>(["selectMyClubs", token], UserApi.selectMyClubs);

  const goToImageSelect = (clubData: Club) => {
    return navigate("HomeStack", {
      screen: "ImageSelecter",
      userId: userId,
      clubId: clubData.id,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["selectMyClubs"]);
    setRefreshing(false);
  };

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

  return (
      <Container>
        <IntroText>가입한 모임 List</IntroText>
        <ReplyContainer>
          {loading ? (
              <ActivityIndicator />
          ) : (
              <FlatList
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  keyExtractor={(item: MyClub, index: number) => String(index)}
                  data={myClub?.data}
                  renderItem={({ item, index }: { item: MyClub; index: number }) => (
                      <>
                        {item.applyStatus === "APPROVED" ? (
                            <ClubArea key={index} onPress={() => goToImageSelect(item)}>
                              <ClubImg source={{ uri: item.thumbnail }} />
                              <HeaderNameView>
                                <CommentMent>
                                  <ClubName>{item.name}</ClubName>
                                </CommentMent>
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
          )}
        </ReplyContainer>
      </Container>
  );
};
export default MyClubSelector;
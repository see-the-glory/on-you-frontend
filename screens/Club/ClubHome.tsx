import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  FlatList,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  LayoutChangeEvent,
  Keyboard,
} from "react-native";
import styled from "styled-components/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ClubHomeScreenProps, ClubHomeParamList, RefinedSchedule } from "../../Types/Club";
import { BaseResponse, ClubApi, ErrorResponse, GuestComment, GuestCommentRequest, GuestCommentResponse, Member } from "../../api";
import ScheduleModal from "./ClubScheduleModal";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";
import { useAppDispatch } from "../../redux/store";
import clubSlice from "../../redux/slices/club";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/reducers";
import { useToast } from "react-native-toast-notifications";
import Collapsible from "react-native-collapsible";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import Carousel from "../../components/Carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MEMBER_ICON_KERNING = 20;
const MEMBER_ICON_SIZE = 40;
const SCREEN_PADDING_SIZE = 20;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Break = styled.View<{ sep: number }>`
  width: 100%;
  margin-bottom: ${(props: any) => props.sep}px;
  margin-top: ${(props: any) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: #e3e3e3;
  opacity: 0.5;
`;

const SectionView = styled.View`
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TitleView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
`;

const SectionTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 14px;
  color: ${(props: any) => props.theme.primaryColor};
`;

const ContentView = styled.View<{ paddingSize?: number }>`
  padding-left: ${(props: any) => props.paddingSize ?? 0}px;
  padding-right: ${(props: any) => props.paddingSize ?? 0}px;
  margin-bottom: 15px;
`;

const ContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 13px;
  line-height: 18px;
  color: #0a0a0a;
`;

const ContentSubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 13px;
  line-height: 18px;
  color: #5b5b5b;
`;

const SeparatorView = styled.View`
  width: 25px;
`;

const ScheduleView = styled.TouchableOpacity`
  min-width: 110px;
  box-shadow: 1px 1px 2px gray;
`;

const ScheduleAddView = styled.TouchableOpacity`
  background-color: white;
  min-width: 110px;
  min-height: 150px;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 1px 1px 2px gray;
  elevation: 5;
  padding: 20px 5px;
`;

const ScheduleDateView = styled.View<{ index: number }>`
  background-color: ${(props: any) => (props.index === 0 ? "#FF551F" : "#EBEBEB")};
  justify-content: center;
  align-items: center;
  padding: 7px 15px;
  elevation: 3;
  min-height: 40px;
`;

const ScheduleDetailView = styled.View`
  background-color: white;
  padding: 5px 7px;
  elevation: 3;
`;

const ScheduleDetailItemView = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 3px 5px;
`;

const ScheduleText = styled(CustomText)<{ index: number }>`
  font-size: 11px;
  line-height: 15px;
  color: ${(props: any) => (props.index === 0 ? "white" : "black")};
`;

const ScheduleSubText = styled(CustomText)`
  font-size: 10px;
  font-weight: 300;
  color: #939393;
  line-height: 13px;
`;

const ScheduleTitle = styled(CustomText)<{ index: number }>`
  font-size: 18px;
  font-family: "NotoSansKR-Bold";
  line-height: 25px;
  color: ${(props: any) => (props.index === 0 ? "white" : "black")};
`;

const MemberView = styled.View`
  margin-bottom: 150px;
`;

const MemberLineView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 25px;
  margin-top: 2px;
`;

const MemberSubTitleView = styled.View`
  margin-left: 5px;
  margin-bottom: 10px;
`;

const MemberSubTitle = styled(CustomText)`
  font-size: 13px;
  color: #bababa;
`;

const MemberTextView = styled.View`
  margin-left: 5px;
  margin-bottom: 20px;
`;

const MemberText = styled(CustomText)`
  font-size: 11px;
  line-height: 17px;
  color: #b0b0b0;
`;

const GuestBookInfoView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0px;
`;
const GuestCommentButton = styled.TouchableOpacity`
  border: 0.5px solid #c5c5c5;
  padding: 8px 10px;
`;
const GuestCommentGuideText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  color: #b0b0b0;
`;

const GuestCommentInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  width: 100%;
  padding: 5px;
  font-size: 14px;
`;

const InfoText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 10px;
  color: #959595;
`;

const GusetPage = styled.View``;
const GuestItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 0px;
  border-bottom-width: 0.5px;
  border-bottom-color: #dddddd;
`;
const GuestItemInnerView = styled.View`
  flex: 1;
`;
const GuestItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const GuestItemHeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;
const GuestItemHeaderRight = styled.View``;

const GuestName = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 12px;
  color: #2b2b2b;
  margin-right: 5px;
`;
const GuestCreatedTime = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 10px;
  color: #8e8e8e;
`;
const GuestItemContent = styled.View``;
const GuestContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  color: #2b2b2b;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #acacac;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ClubHome: React.FC<ClubHomeScreenProps & ClubHomeParamList> = ({
  navigation: { navigate },
  route: {
    name: screenName,
    params: { clubData },
  },
  scrollY,
  offsetY,
  scheduleOffsetX,
  headerDiff,
  schedules,
  syncScrollOffset,
  screenScrollRefs,
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const [scheduleVisible, setScheduleVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(-1);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [memberLoading, setMemberLoading] = useState(true);
  const [memberData, setMemberData] = useState<Member[][]>();
  const [managerData, setManagerData] = useState<Member[][]>();
  const [masterData, setMasterData] = useState<Member>();
  const memberCountPerLine = Math.floor((SCREEN_WIDTH - SCREEN_PADDING_SIZE) / (MEMBER_ICON_SIZE + MEMBER_ICON_KERNING));
  const dispatch = useAppDispatch();
  const myRole = useSelector((state: RootState) => state.club.role);
  const toast = useToast();
  const [clubLongDescLines, setClubLongDescLines] = useState<string[]>(typeof clubData?.clubLongDesc === "string" ? clubData?.clubLongDesc?.split("\n") : []);
  const [isCollapsedLongDesc, setIsCollapsedLongDesc] = useState<boolean>(true);
  const [guestCommentBundle, setGuestCommentBulde] = useState<GuestComment[][]>([]);
  const [comment, setComment] = useState<string>("");
  const collapsed = 8;
  const guestCommentLine = 4;
  const [guestBookIndex, setGuestBookIndex] = useState<number>(0);

  useLayoutEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const guestCommentSubscription = DeviceEventEmitter.addListener("GuestCommentRefetch", () => {
      console.log("ClubHome - GuestCommentRefetch Refetch Event");
      guestCommentRefetch();
    });

    return () => {
      guestCommentSubscription.remove();
    };
  }, []);

  const onScrollGuestBook = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setGuestBookIndex(newIndex);
  };

  const { isLoading: isGuestCommentLoading, refetch: guestCommentRefetch } = useQuery<GuestCommentResponse, ErrorResponse>(["getGuestComment", clubData.id], ClubApi.getGuestComment, {
    onSuccess: (res) => {
      let result = [];
      for (let i = 0; i < res?.data.length; i += guestCommentLine) result.push(res?.data?.slice(i, i + guestCommentLine));
      setGuestCommentBulde(result);
    },
    onError: (error) => {
      console.log(`API ERROR | getGuestComment ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const getClubMembers = () => {
    const members: Member[] = [];
    const manager: Member[] = [];
    const memberBundle: Member[][] = [];
    const managerBundle: Member[][] = [];

    if (clubData && clubData.members) {
      for (let i = 0; i < clubData?.members?.length; ++i) {
        if (clubData.members && clubData.members[i].role?.toUpperCase() === "MASTER") {
          setMasterData(clubData.members[i]);
        } else if (clubData.members && clubData.members[i].role?.toUpperCase() === "MANAGER") {
          manager.push(clubData.members[i]);
        } else if (clubData.members && clubData.members[i].role?.toUpperCase() === "MEMBER") {
          members.push(clubData.members[i]);
        }
      }
    }

    for (var i = 0; i < members.length; i += memberCountPerLine) {
      memberBundle.push(members.slice(i, i + memberCountPerLine));
    }

    for (var i = 0; i < manager.length; i += memberCountPerLine) {
      managerBundle.push(manager.slice(i, i + memberCountPerLine));
    }
    setMemberData(memberBundle);
    setManagerData(managerBundle);
  };

  const getData = async () => {
    getClubMembers();
    setMemberLoading(false);
  };

  const closeScheduleModal = (refresh: boolean) => {
    setScheduleVisible(false);
    if (refresh) DeviceEventEmitter.emit("SchedulesRefetch");
  };

  const goToScheduleAdd = () => {
    if (myRole && ["MASTER", "MANAGER"].includes(myRole)) {
      return navigate("ClubStack", { screen: "ClubScheduleAdd", params: { clubData } });
    } else {
      toast.show(`권한이 없습니다.`, { type: "warning" });
    }
  };

  const clubLongDescTouch = () => {
    setIsCollapsedLongDesc((prev) => !prev);
  };

  const loading = memberLoading;
  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <>
      <Animated.ScrollView
        ref={(ref: any) => {
          screenScrollRefs.current[screenName] = ref;
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        onMomentumScrollEnd={(event) => {
          dispatch(clubSlice.actions.updateClubHomeScrollY({ scrollY: event.nativeEvent.contentOffset.y }));
          syncScrollOffset(screenName);
        }}
        onScrollEndDrag={() => syncScrollOffset(screenName)}
        contentOffset={{ x: 0, y: offsetY ?? 0 }}
        style={{
          flexGrow: 1,
          paddingTop: 15,
          backgroundColor: "#F5F5F5",
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, headerDiff],
                outputRange: [-headerDiff, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
        contentContainerStyle={{
          paddingTop: headerDiff,
          minHeight: SCREEN_HEIGHT + headerDiff * 2,
          backgroundColor: "#F5F5F5",
        }}
      >
        <SectionView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
          <TitleView>
            <SectionTitle>{`소개`}</SectionTitle>
          </TitleView>
          <ContentView>
            {clubLongDescLines.length <= collapsed ? (
              <ContentText>{clubData.clubLongDesc}</ContentText>
            ) : (
              <TouchableWithoutFeedback onPress={clubLongDescTouch}>
                <View>
                  {isCollapsedLongDesc ? (
                    <ContentText>
                      {`${clubLongDescLines.slice(0, collapsed).join("\n")}`}
                      <ContentSubText>{` 더보기`}</ContentSubText>
                    </ContentText>
                  ) : (
                    <ContentText>{`${clubLongDescLines.slice(0, collapsed).join("\n")}`}</ContentText>
                  )}
                  <Collapsible collapsed={isCollapsedLongDesc}>
                    <ContentText>{`${clubLongDescLines.slice(collapsed).join("\n")}`}</ContentText>
                  </Collapsible>
                </View>
              </TouchableWithoutFeedback>
            )}
          </ContentView>
        </SectionView>
        <View style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
          <Break sep={15} />
        </View>
        <SectionView>
          <TitleView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
            <SectionTitle>{`스케줄`}</SectionTitle>
          </TitleView>
          {myRole && myRole !== "PENDING" ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => dispatch(clubSlice.actions.updateClubHomeScheduleScrollX({ scrollX: event.nativeEvent.contentOffset.x }))}
              contentOffset={{ x: scheduleOffsetX ?? 0, y: 0 }}
              contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: SCREEN_PADDING_SIZE }}
              data={schedules}
              keyExtractor={(item: RefinedSchedule, index: number) => String(index)}
              ItemSeparatorComponent={SeparatorView}
              renderItem={({ item, index }: { item: RefinedSchedule; index: number }) =>
                item.isEnd === false ? (
                  <ScheduleView
                    onPress={() => {
                      setScheduleVisible(true);
                      setSelectedSchedule(index);
                    }}
                  >
                    <ScheduleDateView index={index}>
                      <ScheduleText index={index}>{item.year}</ScheduleText>
                      <ScheduleTitle index={index}>
                        {item.month}/{item.day} {item.dayOfWeek}
                      </ScheduleTitle>
                    </ScheduleDateView>
                    <ScheduleDetailView>
                      <ScheduleDetailItemView>
                        <Feather name="clock" size={10} color="#CCCCCC" style={{ marginRight: 5 }} />
                        <ScheduleText>
                          {`${item.ampm} ${item.hour} 시`} {item.minute !== "0" ? `${item.minute} 분` : ""}
                        </ScheduleText>
                      </ScheduleDetailItemView>
                      <ScheduleDetailItemView>
                        <Feather name="map-pin" size={10} color="#CCCCCC" style={{ marginRight: 5 }} />
                        <ScheduleText>{item.location}</ScheduleText>
                      </ScheduleDetailItemView>
                      <Break sep={2} />

                      <ScheduleDetailItemView>
                        <Ionicons name="people-sharp" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                        <ScheduleText>{item.members?.length}명 참석</ScheduleText>
                      </ScheduleDetailItemView>
                      <ScheduleDetailItemView style={{ justifyContent: "center" }}>
                        <ScheduleSubText>더보기</ScheduleSubText>
                      </ScheduleDetailItemView>
                    </ScheduleDetailView>
                  </ScheduleView>
                ) : (
                  <ScheduleAddView onPress={goToScheduleAdd}>
                    <Feather name="plus" size={28} color="#6E6E6E" />
                    <ScheduleText style={{ textAlign: "center", color: "#6E6E6E" }}>{`새로운 스케줄을\n등록해보세요.`}</ScheduleText>
                  </ScheduleAddView>
                )
              }
            />
          ) : (
            // Schedule FlatList의 padding 이슈 때문에 ContentView에 paddingSize Props 추가.
            <ContentView paddingSize={SCREEN_PADDING_SIZE}>
              <ContentText>모임의 멤버만 확인할 수 있습니다.</ContentText>
            </ContentView>
          )}
        </SectionView>
        <View style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
          <Break sep={15} />
        </View>
        <SectionView>
          <TitleView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
            <SectionTitle>{`멤버`}</SectionTitle>
          </TitleView>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: SCREEN_PADDING_SIZE }}
            data={clubData?.members?.filter((member) => member.applyStatus === "APPROVED")}
            keyExtractor={(item: Member, index: number) => String(index)}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            renderItem={({ item, index }: { item: Member; index: number }) => (
              <CircleIcon size={MEMBER_ICON_SIZE} uri={item?.thumbnail} name={item?.name} badge={item.role === "MASTER" ? "stars" : item.role === "MANAGER" ? "check-circle" : undefined} />
            )}
          />
        </SectionView>
        <View style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
          <Break sep={15} />
        </View>
        <SectionView>
          <TitleView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
            <SectionTitle>{`방명록`}</SectionTitle>
          </TitleView>

          <View style={{ width: "100%", marginBottom: 15 }}>
            <GuestCommentButton
              activeOpacity={1}
              style={{ marginHorizontal: SCREEN_PADDING_SIZE }}
              onPress={() => {
                DeviceEventEmitter.emit("ClubGuestCommentFocus");
                screenScrollRefs.current[screenName]?.scrollToEnd({ animated: true });
              }}
            >
              <GuestCommentGuideText>{`방명록을 작성해보세요. (최대 100자)`}</GuestCommentGuideText>
            </GuestCommentButton>
          </View>
          <FlatList
            horizontal
            pagingEnabled
            automaticallyAdjustContentInsets={false}
            snapToInterval={SCREEN_WIDTH}
            decelerationRate="fast"
            onScroll={onScrollGuestBook}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING_SIZE }}
            data={guestCommentBundle}
            keyExtractor={(item: GuestComment[], index: number) => String(index)}
            ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
            renderItem={({ item, index }: { item: GuestComment[]; index: number }) => (
              <GusetPage style={{ width: SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2 }}>
                {item?.map((guest: GuestComment, index: number) => (
                  <GuestItem key={`guest_${index}`}>
                    <CircleIcon size={25} uri={guest.thumbnail} kerning={5} />
                    <GuestItemInnerView>
                      <GuestItemHeader>
                        <GuestItemHeaderLeft>
                          <GuestName>{guest.userName}</GuestName>
                          <GuestCreatedTime>{moment(guest.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</GuestCreatedTime>
                        </GuestItemHeaderLeft>
                        <GuestItemHeaderRight>
                          <Ionicons name="close-outline" size={14} color="#8E8E8E" />
                        </GuestItemHeaderRight>
                      </GuestItemHeader>
                      <GuestItemContent>
                        <GuestContentText>{guest.content}</GuestContentText>
                      </GuestItemContent>
                    </GuestItemInnerView>
                  </GuestItem>
                ))}
              </GusetPage>
            )}
            ListEmptyComponent={() => (
              <EmptyView style={{ width: SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2 }}>
                <EmptyText>{`아직 등록된 방명록이 없습니다.`}</EmptyText>
              </EmptyView>
            )}
          />

          <GuestBookInfoView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
            {guestCommentBundle?.length > 0 ? (
              <>
                <Ionicons name="caret-back-sharp" size={10} color={guestBookIndex > 0 ? "#959595" : "rgba(0, 0, 0, 0)"} />
                <InfoText style={{ marginHorizontal: 6 }}>{`${guestBookIndex + 1} / ${guestCommentBundle?.length}`}</InfoText>
                <Ionicons name="caret-forward-sharp" size={10} color={guestBookIndex < guestCommentBundle?.length - 1 ? "#959595" : "rgba(0, 0, 0, 0)"} />
              </>
            ) : (
              <></>
            )}
          </GuestBookInfoView>
        </SectionView>
      </Animated.ScrollView>
      <ScheduleModal
        visible={scheduleVisible}
        clubId={clubData.id}
        scheduleData={schedules}
        selectIndex={selectedSchedule}
        closeModal={(refresh: boolean) => {
          closeScheduleModal(refresh);
        }}
      />
    </>
  );
};

export default ClubHome;

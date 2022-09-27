import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated, FlatList, RefreshControl } from "react-native";
import styled from "styled-components/native";
import { Feather, Entypo, Ionicons } from "@expo/vector-icons";
import { ClubHomeScreenProps, ClubHomeParamList, RefinedSchedule } from "../../Types/Club";
import { useMutation, useQuery } from "react-query";
import { ClubApi, ClubRoleResponse, ClubSchedulesResponse, Member, Schedule } from "../../api";
import ScheduleModal from "./ClubScheduleModal";
import CircleIcon from "../../components/CircleIcon";
import ScheduleAddModal from "./ClubScheduleAddModal";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import CustomText from "../../components/CustomText";

const MEMBER_ICON_KERNING = 25;
const MEMBER_ICON_SIZE = 50;
const SCREEN_PADDING_SIZE = 20;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Break = styled.View<{ sep: number }>`
  width: 100%;
  margin-bottom: ${(props) => props.sep}px;
  margin-top: ${(props) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.2);
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

const SectionTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 14px;
  margin-left: 5px;
  line-height: 20px;
`;

const ContentView = styled.View<{ paddingSize?: number }>`
  padding-left: ${(props) => (props.paddingSize ? props.paddingSize + 5 : 5)}px;
  padding-right: ${(props) => (props.paddingSize ? props.paddingSize + 5 : 5)}px;
  margin-bottom: 15px;
`;

const ContentText = styled(CustomText)`
  font-size: 12px;
  line-height: 17px;
`;

const ScheduleSeparator = styled.View`
  width: 25px;
`;

const ScheduleView = styled.TouchableOpacity`
  min-width: 110px;
  box-shadow: 1px 1px 2px gray;
`;

const ScheduleAddView = styled.TouchableOpacity`
  background-color: white;
  min-width: 110px;
  min-height: 120px;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 1px 1px 2px gray;
  elevation: 5;
  padding: 20px 5px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ScheduleBadge = styled.View`
  position: absolute;
  z-index: 1;
  right: -10px;
  top: -15px;
  border-radius: 50px;
  background-color: #ff714b;
  padding: 4px 6px;
  justify-content: center;
  align-items: center;
  text-align: center;
  elevation: 3;
`;

const ScheduleBadgeText = styled(CustomText)`
  color: white;
  font-size: 8px;
  font-family: "NotoSansKR-Bold";
  line-height: 10px;
  text-align: center;
`;

const ScheduleDateView = styled.View<{ index: number }>`
  background-color: ${(props) => (props.index === 0 ? "#eaff87" : "#CCCCCC")};
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 7px 15px;
  elevation: 3;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
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
  margin: 1px 5px;
`;

const ScheduleText = styled(CustomText)`
  font-size: 11px;
  line-height: 15px;
`;

const ScheduleSubText = styled(CustomText)`
  font-size: 10px;
  font-weight: 300;
  color: #939393;
  line-height: 13px;
`;

const ScheduleTitle = styled(CustomText)`
  font-size: 18px;
  font-family: "NotoSansKR-Bold";
  line-height: 25px;
`;

const MemberView = styled.View`
  margin-bottom: 150px;
`;

const MemberLineView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 25px;
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

const ModalHeaderRight = styled.View`
  position: absolute;
  right: 15px;
`;

const ModalCloseButton = styled.TouchableOpacity``;

const ClubHome: React.FC<ClubHomeScreenProps & ClubHomeParamList> = ({
  navigation: { navigate },
  route: {
    params: { clubData },
  },
  scrollY,
  headerDiff,
}) => {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const [scheduleVisible, setScheduleVisible] = useState(false);
  const [scheduleAddVisible, setScheduleAddVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(-1);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [scheduleData, setScheduleData] = useState<Array<RefinedSchedule>>([]);
  const [memberLoading, setMemberLoading] = useState(true);
  const [memberData, setMemberData] = useState<Member[][]>();
  const [managerData, setManagerData] = useState<Member[][]>();
  const [masterData, setMasterData] = useState<Member>();
  const toast = useToast();
  const memberCountPerLine = Math.floor((SCREEN_WIDTH - SCREEN_PADDING_SIZE) / (MEMBER_ICON_SIZE + MEMBER_ICON_KERNING));
  const {
    isLoading: scheduleLoading,
    data: schedules,
    refetch: scheduleRefetch,
    isRefetching: isRefetchingSchedules,
  } = useQuery<ClubSchedulesResponse>(["getClubSchedules", clubData.id], ClubApi.getClubSchedules, {
    onSuccess: (res) => {
      const week = ["일", "월", "화", "수", "목", "금", "토"];
      const result: RefinedSchedule[] = [];
      for (let i = 0; i < res?.data?.length; ++i) {
        const date = new Date(res.data[i].startDate);
        const dayOfWeek = week[date.getDay()];
        let refined: RefinedSchedule = {
          id: res.data[i].id,
          location: res.data[i].location,
          name: res.data[i].name,
          members: res.data[i].members,
          startDate: res.data[i].startDate,
          endDate: res.data[i].endDate,
          content: res.data[i].content,
          year: moment(res.data[i].startDate).format("YYYY"),
          month: moment(res.data[i].startDate).format("MM"),
          day: moment(res.data[i].startDate).format("DD"),
          hour: moment(res.data[i].startDate).format("h"),
          minute: moment(res.data[i].startDate).format("m"),
          ampm: moment(res.data[i].startDate).format("A") === "AM" ? "오전" : "오후",
          dayOfWeek: dayOfWeek,
          isEnd: false,
        };
        result.push(refined);
      }

      result.push({ isEnd: true });

      setScheduleData(result);
    },
  });

  const {
    isLoading: clubRoleLoading,
    data: clubRole,
    isRefetching: isRefetchingClubRole,
  } = useQuery<ClubRoleResponse>(["getClubRole", token, clubData.id], ClubApi.getClubRole, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const scheduleMutation = useMutation(ClubApi.createClubSchedule, {
    onSuccess: (res) => {
      if (res.status === 200 && res.json?.resultCode === "OK") {
        setScheduleAddVisible(false);
        toast.show("일정 등록이 완료되었습니다.", {
          type: "success",
        });
        scheduleRefetch();
      } else {
        toast.show("일정 등록에 실패했습니다.", {
          type: "warning",
        });
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res.json);
      }
    },
    onError: (error) => {
      toast.show("일정 등록에 실패했습니다.", {
        type: "warning",
      });
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
  });

  const getClubMembers = () => {
    console.log(clubData.members);
    const members: Member[] = [];
    const manager: Member[] = [];
    const memberBundle: Member[][] = [];
    const managerBundle: Member[][] = [];

    for (let i = 0; i < clubData.members.length; ++i) {
      if (clubData.members[i].role?.toUpperCase() === "MASTER") {
        setMasterData(clubData.members[i]);
      } else if (clubData.members[i].role?.toUpperCase() === "MANAGER") {
        manager.push(clubData.members[i]);
      } else if (clubData.members[i].role?.toUpperCase() === "MEMBER") {
        members.push(clubData.members[i]);
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

  useEffect(() => {
    console.log("clubHome useEffect");
    getData();
  }, []);

  const loading = memberLoading || scheduleLoading || clubRoleLoading;

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Animated.ScrollView
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      style={{
        flex: 1,
        paddingTop: 15,
        backgroundColor: "white",
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
        backgroundColor: "white",
      }}
    >
      <SectionView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <TitleView>
          <Entypo name="megaphone" size={16} color="#295AF5" />
          <SectionTitle>ABOUT</SectionTitle>
        </TitleView>
        <ContentView>
          <ContentText>{clubData.clubLongDesc}</ContentText>
        </ContentView>
        <Break sep={7} />
      </SectionView>
      <SectionView>
        <TitleView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
          <Ionicons name="calendar" size={16} color="#295AF5" />
          <SectionTitle>SCHEDULE</SectionTitle>
        </TitleView>
        {clubRole?.data?.role === undefined ? (
          // Schedule FlatList의 padding 이슈 때문에 ContentView에 paddingSize Props 추가.
          <ContentView paddingSize={SCREEN_PADDING_SIZE}>
            <ContentText>모임의 멤버만 확인할 수 있습니다.</ContentText>
          </ContentView>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 15,
              paddingHorizontal: SCREEN_PADDING_SIZE,
            }}
            data={scheduleData}
            keyExtractor={(item: RefinedSchedule, index: number) => String(index)}
            ItemSeparatorComponent={ScheduleSeparator}
            renderItem={({ item, index }: { item: RefinedSchedule; index: number }) =>
              item.isEnd === false ? (
                <ScheduleView
                  onPress={() => {
                    setScheduleVisible(true);
                    setSelectedSchedule(index);
                  }}
                >
                  {index === 0 ? (
                    <ScheduleBadge>
                      <ScheduleBadgeText>{`다음\n모임`}</ScheduleBadgeText>
                    </ScheduleBadge>
                  ) : (
                    <></>
                  )}
                  <ScheduleDateView index={index}>
                    <ScheduleText>{item.year}</ScheduleText>
                    <ScheduleTitle>
                      {item.month}/{item.day} {item.dayOfWeek}
                    </ScheduleTitle>
                  </ScheduleDateView>
                  <ScheduleDetailView>
                    <ScheduleDetailItemView>
                      <Feather name="clock" size={10} color="#CCCCCC" style={{ marginRight: 5 }} />
                      <ScheduleText>
                        {`${item.ampm} ${item.hour}시`} {item.minute !== "0" ? `${item.minute} 분` : ""}
                      </ScheduleText>
                    </ScheduleDetailItemView>
                    <ScheduleDetailItemView>
                      <Feather name="map-pin" size={10} color="#CCCCCC" style={{ marginRight: 5 }} />
                      <ScheduleText>{item.location}</ScheduleText>
                    </ScheduleDetailItemView>
                    <Break sep={2} />

                    <ScheduleDetailItemView>
                      <Ionicons name="people-sharp" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                      <ScheduleText>{item.members.length}명 참석</ScheduleText>
                    </ScheduleDetailItemView>
                    <Break sep={2} />
                    <ScheduleDetailItemView style={{ justifyContent: "center" }}>
                      <ScheduleSubText>더보기</ScheduleSubText>
                    </ScheduleDetailItemView>
                  </ScheduleDetailView>
                </ScheduleView>
              ) : (
                <ScheduleAddView onPress={() => setScheduleAddVisible(true)}>
                  <Feather name="plus" size={28} color="#6E6E6E" />
                  <ScheduleText style={{ textAlign: "center", color: "#6E6E6E" }}>{`스케줄을 등록해\n멤버들과 공유해보세요.`}</ScheduleText>
                </ScheduleAddView>
              )
            }
          />
        )}
      </SectionView>
      <SectionView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <Break sep={7} />
        <TitleView>
          <Feather name="users" size={16} color="#295AF5" />
          <SectionTitle>MEMBER</SectionTitle>
        </TitleView>
        <MemberView>
          <MemberSubTitleView>
            <MemberSubTitle>Leader</MemberSubTitle>
          </MemberSubTitleView>
          {masterData ? (
            <MemberLineView>
              <CircleIcon size={MEMBER_ICON_SIZE} uri={masterData?.thumbnail} name={masterData?.name} badge={"stars"} />
            </MemberLineView>
          ) : (
            <MemberTextView>
              <MemberText>리더가 없습니다.</MemberText>
            </MemberTextView>
          )}

          <MemberSubTitleView>
            <MemberSubTitle>Manager</MemberSubTitle>
          </MemberSubTitleView>
          {managerData?.length !== 0 ? (
            managerData?.map((bundle, index) => {
              return (
                <MemberLineView key={index}>
                  {bundle.map((item, index) => {
                    return <CircleIcon key={index} size={MEMBER_ICON_SIZE} uri={item.thumbnail} name={item.name} badge={"check-circle"} />;
                  })}
                </MemberLineView>
              );
            })
          ) : (
            <MemberTextView>
              <MemberText>매니저가 없습니다.</MemberText>
            </MemberTextView>
          )}
          <MemberSubTitleView>
            <MemberSubTitle>Member</MemberSubTitle>
          </MemberSubTitleView>
          {memberData?.length !== 0 ? (
            memberData?.map((bundle, index) => {
              return (
                <MemberLineView key={index}>
                  {bundle.map((item, index) => {
                    return <CircleIcon key={index} size={MEMBER_ICON_SIZE} uri={item.thumbnail} name={item.name} kerning={MEMBER_ICON_KERNING} />;
                  })}
                </MemberLineView>
              );
            })
          ) : (
            <MemberTextView>
              <MemberText>멤버들이 클럽을 가입할 수 있게 해보세요.</MemberText>
            </MemberTextView>
          )}
        </MemberView>
      </SectionView>

      <ScheduleModal visible={scheduleVisible} scheduleData={scheduleData} selectIndex={selectedSchedule}>
        <ModalHeaderRight>
          <ModalCloseButton
            onPress={() => {
              setScheduleVisible(false);
            }}
          >
            <Ionicons name="close" size={24} color="black" />
          </ModalCloseButton>
        </ModalHeaderRight>
      </ScheduleModal>

      <ScheduleAddModal visible={scheduleAddVisible} mutation={scheduleMutation} clubId={clubData.id}>
        <ModalHeaderRight>
          <ModalCloseButton
            onPress={() => {
              setScheduleAddVisible(false);
            }}
          >
            <Ionicons name="close" size={24} color="black" />
          </ModalCloseButton>
        </ModalHeaderRight>
      </ScheduleAddModal>
    </Animated.ScrollView>
  );
};

export default ClubHome;

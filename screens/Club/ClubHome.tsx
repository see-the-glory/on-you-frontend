import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated, Text, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { Feather, Entypo, Ionicons } from "@expo/vector-icons";
import { ClubHomeScreenProps, ClubHomeParamList, RefinedSchedule } from "../../Types/Club";
import { useMutation, useQuery } from "react-query";
import { ClubApi, ClubRoleResponse, ClubSchedulesResponse, Schedule } from "../../api";
import ScheduleModal from "./ClubScheduleModal";
import CircleIcon from "../../components/CircleIcon";
import ScheduleAddModal from "./ClubScheduleAddModal";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import moment from "moment-timezone";

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
  border-bottom-color: rgba(0, 0, 0, 0.3);
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
  margin-bottom: 15px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-left: 5px;
`;

const ContentView = styled.View<{ paddingSize?: number }>`
  padding-left: ${(props) => (props.paddingSize ? props.paddingSize + 5 : 5)}px;
  padding-right: ${(props) => (props.paddingSize ? props.paddingSize + 5 : 5)}px;
`;

const ContentText = styled.Text`
  font-size: 16px;
`;

const ScheduleSeparator = styled.View`
  width: 25px;
`;

const ScheduleView = styled.TouchableOpacity`
  box-shadow: 1px 1px 2px gray;
`;

const ScheduleAddView = styled.TouchableOpacity`
  background-color: white;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 2px gray;
  elevation: 3;
  padding: 40px 15px 40px 15px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ScheduleBadge = styled.View`
  position: absolute;
  z-index: 1;
  right: -10px;
  top: -18px;
  border-radius: 50px;
  background-color: #ff714b;
  padding: 6px 8px 6px 8px;
  elevation: 3;
`;

const ScheduleBadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

const ScheduleDateView = styled.View<{ index: number }>`
  background-color: ${(props) => (props.index === 0 ? "#eaff87" : "#CCCCCC")};
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  elevation: 3;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ScheduleDetailView = styled.View`
  background-color: white;
  padding: 12px;
  elevation: 3;
`;

const ScheduleDetailItemView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
  margin-bottom: 2px;
`;

const ScheduleText = styled.Text`
  font-size: 12px;
`;

const ScheduleSubText = styled.Text`
  font-size: 10px;
  font-weight: 300;
  color: #939393;
`;

const ScheduleTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
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

const MemberSubTitle = styled.Text`
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 500;
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
  const [memberData, setMemberData] = useState([[{}]]);
  const [managerData, setManagerData] = useState([[{}]]);
  const [masterData, setMasterData] = useState({});
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
      for (let i = 0; i < res.data.length; ++i) {
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
    let master = {};
    const members: { profilePath: string; name: string; role: string }[] = [];
    const memberBundle = [];
    const manager: { profilePath: string; name: string; role: string }[] = [];
    const managerBundle = [];
    const items = [
      {
        profilePath: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
        name: "박종원",
        role: "master",
      },
      {
        profilePath: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
        name: "장준용",
        role: "manager",
      },
      {
        profilePath: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
        name: "문규빈",
        role: "member",
      },
      {
        profilePath: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
        name: "김재광",
        role: "member",
      },
      {
        profilePath: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8bGFuZHNjYXBlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        name: "김예찬",
        role: "member",
      },
      {
        profilePath: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        name: "이진규",
        role: "member",
      },
      {
        profilePath:
          "https://images.unsplash.com/photo-1620964955179-1e7041a53045?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTd8fHBvcnRyYWl0JTIwZ2lybHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        name: "유주은",
        role: "member",
      },
    ];

    items.forEach((item) => {
      if (item.role.toUpperCase() === "MASTER") {
        master = item;
      } else if (item.role.toUpperCase() === "MANAGER") {
        manager.push(item);
      } else {
        members.push(item);
      }
    });

    for (var i = 0; i < members.length; i += memberCountPerLine) {
      memberBundle.push(members.slice(i, i + memberCountPerLine));
    }

    for (var i = 0; i < manager.length; i += memberCountPerLine) {
      managerBundle.push(manager.slice(i, i + memberCountPerLine));
    }

    setMemberData(memberBundle);
    setManagerData(managerBundle);
    setMasterData(master);
  };

  const getData = async () => {
    await Promise.all([getClubMembers()]);
    setMemberLoading(false);
  };

  useEffect(() => {
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
        paddingTop: SCREEN_PADDING_SIZE,
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
        <Break sep={20} />
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
              padding: 3,
              paddingHorizontal: SCREEN_PADDING_SIZE,
              paddingTop: 20,
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
                      <Feather name="clock" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                      <ScheduleText>
                        {`${item.ampm} ${item.hour}시`} {item.minute !== "0" ? `${item.minute} 분` : ""}
                      </ScheduleText>
                    </ScheduleDetailItemView>
                    <ScheduleDetailItemView>
                      <Feather name="map-pin" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                      <ScheduleText>{item.location}</ScheduleText>
                    </ScheduleDetailItemView>
                    <Break sep={10} />
                    {index === 0 ? (
                      <>
                        <ScheduleDetailItemView>
                          <Ionicons name="people-sharp" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                          <ScheduleText>{item.members.length}명 참석</ScheduleText>
                        </ScheduleDetailItemView>
                        <Break sep={10} />
                      </>
                    ) : (
                      <></>
                    )}
                    <ScheduleDetailItemView style={{ justifyContent: "center" }}>
                      <ScheduleSubText>더보기</ScheduleSubText>
                    </ScheduleDetailItemView>
                  </ScheduleDetailView>
                </ScheduleView>
              ) : (
                <ScheduleAddView onPress={() => setScheduleAddVisible(true)}>
                  <Ionicons name="ios-add-sharp" size={42} color="#6E6E6E" />
                  <ScheduleText style={{ textAlign: "center", color: "#6E6E6E" }}>{`스케줄을 등록해\n멤버들과 공유해보세요.`}</ScheduleText>
                </ScheduleAddView>
              )
            }
          />
        )}
        {/* {isRefetchingSchedules ? (
          <Loader style={{ width: "100%" }}>
            <ActivityIndicator />
          </Loader>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              padding: 3,
              paddingHorizontal: SCREEN_PADDING_SIZE,
              paddingTop: 20,
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
                      <Feather name="clock" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                      <ScheduleText>{item.startTime}시</ScheduleText>
                    </ScheduleDetailItemView>
                    <ScheduleDetailItemView>
                      <Feather name="map-pin" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                      <ScheduleText>{item.location}</ScheduleText>
                    </ScheduleDetailItemView>
                    <Break sep={10} />
                    {index === 0 ? (
                      <>
                        <ScheduleDetailItemView>
                          <Ionicons name="people-sharp" size={12} color="#CCCCCC" style={{ marginRight: 7 }} />
                          <ScheduleText>{item.members.length}명 참석</ScheduleText>
                        </ScheduleDetailItemView>
                        <Break sep={10} />
                      </>
                    ) : (
                      <></>
                    )}
                    <ScheduleDetailItemView style={{ justifyContent: "center" }}>
                      <ScheduleSubText>더보기</ScheduleSubText>
                    </ScheduleDetailItemView>
                  </ScheduleDetailView>
                </ScheduleView>
              ) : (
                <ScheduleAddView onPress={() => setScheduleAddVisible(true)}>
                  <Ionicons name="ios-add-sharp" size={42} color="#6E6E6E" />
                  <ScheduleText style={{ textAlign: "center", color: "#6E6E6E" }}>{`스케줄을 등록해\n멤버들과 공유해보세요.`}</ScheduleText>
                </ScheduleAddView>
              )
            }
          />
        )} */}
      </SectionView>
      <SectionView style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <Break sep={20} />
        <TitleView>
          <Feather name="users" size={16} color="#295AF5" />
          <SectionTitle>MEMBER</SectionTitle>
        </TitleView>
        <MemberView>
          <MemberSubTitleView>
            <MemberSubTitle>Leader</MemberSubTitle>
          </MemberSubTitleView>
          <MemberLineView>
            <CircleIcon size={MEMBER_ICON_SIZE} uri={masterData.profilePath} name={masterData.name} badge={"stars"} />
          </MemberLineView>
          <MemberSubTitleView>
            <MemberSubTitle>Manager</MemberSubTitle>
          </MemberSubTitleView>
          {managerData.map((bundle, index) => {
            return (
              <MemberLineView key={index}>
                {bundle.map((item, index) => {
                  return <CircleIcon key={index} size={MEMBER_ICON_SIZE} uri={item.profilePath} name={item.name} badge={"check-circle"} />;
                })}
              </MemberLineView>
            );
          })}
          <MemberSubTitleView>
            <MemberSubTitle>Member</MemberSubTitle>
          </MemberSubTitleView>
          {memberData.map((bundle, index) => {
            return (
              <MemberLineView key={index}>
                {bundle.map((item, index) => {
                  return <CircleIcon key={index} size={MEMBER_ICON_SIZE} uri={item.profilePath} name={item.name} kerning={MEMBER_ICON_KERNING} />;
                })}
              </MemberLineView>
            );
          })}
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

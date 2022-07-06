import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Text,
  FlatList,
} from "react-native";
import styled from "styled-components/native";
import { Feather, Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  ClubHomeScreenProps,
  ClubHomeParamList,
  RefinedSchedule,
} from "../../types/club";
import { useQuery } from "react-query";
import { ClubApi, ClubSchedulesResponse } from "../../api";
import ScheduleModal from "./ClubScheduleModal";
import CircleIcon from "../../components/CircleIcon";

const MEMBER_ICON_KERNING = 25;
const MEMBER_ICON_SIZE = 50;
const SCREEN_PADDING_SIZE = 30;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Break = styled.View<{ sep: number }>`
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
  font-size: 18px;
  font-weight: 600;
  margin-left: 5px;
`;

const ContentView = styled.View`
  padding-left: 5px;
  padding-right: 5px;
`;

const ContentText = styled.Text`
  font-size: 16px;
`;

const ScheduleSeparator = styled.View`
  width: 20px;
`;

const ScheduleView = styled.TouchableOpacity`
  width: 150px;
  box-shadow: 1px 1px 2px gray;
  elevation: 3;
`;

const ScheduleDateView = styled.View`
  height: 50px;
  background-color: #eaff87;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const ScheduleDetailView = styled.View`
  height: 90px;
  background-color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  padding: 12px;
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

const ScheduleTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
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
  const [visible, setVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(-1);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [scheduleData, setScheduleData] = useState<Array<RefinedSchedule>>([]);
  const [memberLoading, setMemberLoading] = useState(true);
  const [memberData, setMemberData] = useState([[{}]]);
  const [managerData, setManagerData] = useState([[{}]]);
  const [masterData, setMasterData] = useState({});
  const memberCountPerLine = Math.floor(
    (SCREEN_WIDTH - SCREEN_PADDING_SIZE) /
      (MEMBER_ICON_SIZE + MEMBER_ICON_KERNING)
  );
  const {
    isLoading: scheduleLoading,
    data: schedules,
    isRefetching: isRefetchingSchedules,
  } = useQuery<ClubSchedulesResponse>(
    ["getClubSchedules", clubData.id],
    ClubApi.getClubSchedules,
    {
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
            startDate: res.data[i].startDate,
            endDate: res.data[i].endDate,
            content: res.data[i].content,
            year: res.data[i].startDate.split("-")[0],
            month: res.data[i].startDate.split("-")[1],
            day: res.data[i].startDate.split("T")[0].split("-")[2],
            dayOfWeek: dayOfWeek,
            startTime: res.data[i].startDate.split("T")[1].split(":")[0],
          };
          result.push(refined);
        }

        setScheduleData(result);
      },
    }
  );

  const getClubMembers = () => {
    let master = {};
    const members: { profilePath: string; name: string; role: string }[] = [];
    const memberBundle = [];
    const manager: { profilePath: string; name: string; role: string }[] = [];
    const managerBundle = [];
    const items = [
      {
        profilePath:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
        name: "박종원",
        role: "master",
      },
      {
        profilePath:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
        name: "장준용",
        role: "manager",
      },
      {
        profilePath:
          "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
        name: "문규빈",
        role: "member",
      },
      {
        profilePath:
          "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
        name: "김재광",
        role: "member",
      },
      {
        profilePath:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8bGFuZHNjYXBlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        name: "김예찬",
        role: "member",
      },
      {
        profilePath:
          "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
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
    console.log(clubData);
  }, []);

  const loading = memberLoading || scheduleLoading;

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Animated.ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      style={{
        flex: 1,
        paddingTop: SCREEN_PADDING_SIZE,
        paddingLeft: SCREEN_PADDING_SIZE,
        paddingRight: SCREEN_PADDING_SIZE,
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
      contentContainerStyle={{ paddingTop: headerDiff }}
    >
      <SectionView>
        <TitleView>
          <Entypo name="megaphone" size={18} color="#295AF5" />
          <SectionTitle>ABOUT</SectionTitle>
        </TitleView>
        <ContentView>
          <ContentText>{clubData.clubLongDesc}</ContentText>
        </ContentView>
      </SectionView>
      <Break sep={20} />
      <SectionView>
        <TitleView>
          <Ionicons name="calendar" size={18} color="#295AF5" />
          <SectionTitle>SCHEDULE</SectionTitle>
        </TitleView>
        {scheduleData.length === 0 ? (
          <Text>등록된 일정이 없습니다.</Text>
        ) : (
          <FlatList
            horizontal
            contentContainerStyle={{ flex: 1, padding: 3 }}
            data={scheduleData}
            keyExtractor={(item: RefinedSchedule) => item.id + ""}
            ItemSeparatorComponent={ScheduleSeparator}
            renderItem={({
              item,
              index,
            }: {
              item: RefinedSchedule;
              index: number;
            }) => (
              <ScheduleView
                onPress={() => {
                  setVisible(true);
                  setSelectedSchedule(index);
                }}
              >
                <ScheduleDateView>
                  <ScheduleText>{item.year}</ScheduleText>
                  <ScheduleTitle>
                    {item.month}/{item.day} {item.dayOfWeek}
                  </ScheduleTitle>
                </ScheduleDateView>
                <ScheduleDetailView>
                  <ScheduleDetailItemView>
                    <Feather
                      name="clock"
                      size={12}
                      color="#CCCCCC"
                      style={{ marginRight: 7 }}
                    />
                    <ScheduleText>{item.startTime}시</ScheduleText>
                  </ScheduleDetailItemView>
                  <ScheduleDetailItemView>
                    <Feather
                      name="map-pin"
                      size={12}
                      color="#CCCCCC"
                      style={{ marginRight: 7 }}
                    />
                    <ScheduleText>{item.location}</ScheduleText>
                  </ScheduleDetailItemView>
                  <Break sep={10} />
                  <ScheduleDetailItemView>
                    <Ionicons
                      name="people-sharp"
                      size={12}
                      color="#CCCCCC"
                      style={{ marginRight: 7 }}
                    />
                    <ScheduleText>7명 참석</ScheduleText>
                  </ScheduleDetailItemView>
                </ScheduleDetailView>
              </ScheduleView>
            )}
          />
        )}
      </SectionView>
      <Break sep={20} />
      <SectionView>
        <TitleView>
          <Feather name="users" size={18} color="#295AF5" />
          <SectionTitle>MEMBER</SectionTitle>
        </TitleView>
        <MemberView>
          <MemberSubTitleView>
            <MemberSubTitle>Leader</MemberSubTitle>
          </MemberSubTitleView>
          <MemberLineView>
            <CircleIcon
              size={MEMBER_ICON_SIZE}
              uri={masterData.profilePath}
              name={masterData.name}
              badge={"stars"}
            />
          </MemberLineView>
          <MemberSubTitleView>
            <MemberSubTitle>Manager</MemberSubTitle>
          </MemberSubTitleView>
          {managerData.map((bundle, index) => {
            return (
              <MemberLineView key={index}>
                {bundle.map((item, index) => {
                  return (
                    <CircleIcon
                      key={index}
                      size={MEMBER_ICON_SIZE}
                      uri={item.profilePath}
                      name={item.name}
                      badge={"check-circle"}
                    />
                  );
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
                  return (
                    <CircleIcon
                      key={index}
                      size={MEMBER_ICON_SIZE}
                      uri={item.profilePath}
                      name={item.name}
                      kerning={MEMBER_ICON_KERNING}
                    />
                  );
                })}
              </MemberLineView>
            );
          })}
        </MemberView>
      </SectionView>

      <ScheduleModal
        visible={visible}
        scheduleData={scheduleData}
        selectIndex={selectedSchedule}
      >
        <ModalHeaderRight>
          <ModalCloseButton
            onPress={() => {
              setVisible(false);
            }}
          >
            <Ionicons name="close" size={24} color="black" />
          </ModalCloseButton>
        </ModalHeaderRight>
      </ScheduleModal>
    </Animated.ScrollView>
  );
};

export default ClubHome;

import React, { useEffect, useState } from "react";
import {
  Text,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import styled from "styled-components/native";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Thumbnail = styled.Image<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`;

const IntroductionView = styled.View`
  width: 100%;
  margin-top: -40px;
  justify-content: center;
  align-items: center;
`;

const InstroductionCard = styled.View`
  width: 85%;
  height: 200px;
  border-radius: 12px;
  background-color: white;
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
  padding: 15px;
`;

const TitleView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const ContentView = styled.View``;

const ClubTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 5px;
`;

const OrginizationTitle = styled.Text`
  font-size: 12px;
  font-weight: 300;
`;

const ContentText = styled.Text`
  font-size: 16px;
`;

const SectionTitleView = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-top: 60px;
  margin-left: 32px;
`;

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: 500;
`;

const SectionSubTitle = styled.Text`
  font-size: 18px;
  margin-left: 5px;
  color: #808080;
`;

const CalendarView = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const CalendarCard = styled.View`
  flex: 1;
  width: 350px;
  background-color: white;
  border: 1px;
  border-color: #ddd;
  border-radius: 12px;
  padding: 15px;
`;

const CalendarContentScrollView = styled.ScrollView``;

const CalendarItemView = styled.View`
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;
`;

const CalendarItemDateTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const CalendarItemDetailView = styled.View`
  margin-left: 15px;
`;

const CalendarItemTitle = styled.Text`
  margin-left: 15px;
  font-weight: 600;
`;

const CalendarTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const MemberView = styled.View`
  margin-top: 30px;
  margin-bottom: 80px;
`;

const MemberLineView = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 20px;
`;

const MemberItem = styled.View`
  justify-content: center;
  align-items: center;
`;

const MemberIcon = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  margin-bottom: 8px;
`;

const MemberName = styled.Text``;

const ClubHome = ({
  navigation: { navigate },
  route: {
    params: { item },
  },
  scrollY,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageHeight = Math.floor((SCREEN_WIDTH / 16) * 9);
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState([{}]);
  const [memberData, setMemberData] = useState([[{}]]);

  const getClubSchedules = () => {
    const monthlySchedules = [];

    for (var i = 0; i < 12; ++i) {
      monthlySchedules.push({
        month: i + 1,
        schedules: [
          {
            day: 5,
            place: "시광교회 302호",
            dues: 5000,
            time: "13:00",
            title: "시편 1편 - 10편 읽기",
          },
          {
            day: 12,
            place: "시광교회 306호",
            dues: 5000,
            time: "16:00",
            title: "시편 11편 - 20편 읽기",
          },
          {
            day: 22,
            place: "시광교회 306호",
            dues: 5000,
            time: "16:00",
            title: "시편 21편 - 30편 읽기",
          },
          {
            day: 26,
            place: "시광교회 306호",
            dues: 5000,
            time: "16:00",
            title: "시편 31편 - 40편 읽기",
          },
        ],
      });
    }
    setCalendarData(monthlySchedules);
  };

  const getClubMembers = () => {
    const result = [];
    const items = [
      {
        profilePath:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
        name: "장준용",
        role: "member",
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
        role: "manager",
      },
      {
        profilePath:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
        name: "박종원",
        role: "master",
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

    for (var i = 0; i < items.length; i += 5) {
      result.push(items.slice(i, i + 5));
    }

    setMemberData(result);
  };

  const getData = async () => {
    await Promise.all([getClubSchedules(), getClubMembers()]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

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
      style={{ flex: 1 }}
    >
      <Thumbnail
        source={{ url: item.thumbnailPath }}
        resizeMode="cover"
        height={imageHeight}
      />
      <IntroductionView>
        <InstroductionCard>
          <TitleView>
            <ClubTitle>{item.clubName}</ClubTitle>
            <OrginizationTitle>{item.organizationName}</OrginizationTitle>
          </TitleView>
          <ContentView>
            <ContentText>Hello World!</ContentText>
          </ContentView>
        </InstroductionCard>
      </IntroductionView>

      <SectionTitleView>
        <SectionTitle>모임 일정</SectionTitle>
      </SectionTitleView>

      <CalendarView>
        <Carousel
          layout={"default"}
          slideStyle={{ height: 220 }}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={350}
          data={calendarData}
          renderItem={(data) => (
            <CalendarCard key={data.month}>
              <TitleView>
                <CalendarTitle>{data.item.month} 월</CalendarTitle>
              </TitleView>
              <CalendarContentScrollView>
                {data.item.schedules.map((s) => {
                  return (
                    <CalendarItemView key={s.day}>
                      <CalendarItemDateTitle>{s.day} 일</CalendarItemDateTitle>
                      <CalendarItemDetailView>
                        <Text>{s.time}</Text>
                        <Text>{s.place}</Text>
                        <Text>{s.dues} 원</Text>
                      </CalendarItemDetailView>
                      <CalendarItemTitle>{s.title}</CalendarItemTitle>
                    </CalendarItemView>
                  );
                })}
              </CalendarContentScrollView>
            </CalendarCard>
          )}
        />
      </CalendarView>

      <SectionTitleView>
        <SectionTitle>멤버</SectionTitle>
        <SectionSubTitle>({item.memberNum} 명)</SectionSubTitle>
      </SectionTitleView>

      <MemberView>
        {memberData.map((bundle, index) => {
          return (
            <MemberLineView key={index}>
              {bundle.map((item, index) => {
                return (
                  <MemberItem key={index}>
                    <MemberIcon source={{ uri: item.profilePath }} />
                    <MemberName>{item.name}</MemberName>
                  </MemberItem>
                );
              })}
            </MemberLineView>
          );
        })}
      </MemberView>
    </Animated.ScrollView>
  );
};

export default ClubHome;

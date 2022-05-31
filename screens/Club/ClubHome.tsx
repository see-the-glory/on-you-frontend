import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Break = styled.View`
  margin-bottom: 20px;
  margin-top: 20px;
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

const SectionSubTitle = styled.Text`
  font-size: 18px;
  color: #bababa;
`;

const MemberView = styled.View`
  margin-bottom: 150px;
`;

const MemberLineView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const MemberItem = styled.View`
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const MemberIcon = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  margin-bottom: 8px;
`;

const MemberName = styled.Text`
  font-weight: 600;
`;

const ClubHome = ({
  navigation: { navigate },
  route: {
    params: { item },
  },
  scrollY,
  headerDiff,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState([[{}]]);
  const longDesc =
    "안녕하세요! 앱개발 스터디 온유 프로젝트 입니다. \n모바일, 웹 기반 종사자들의 자기 개발과 커리어 성장을 위해\n 진행하는 모임입니다. \n각자 주어진 파트와 분야에서 정해진 작업을 해나가고,\n서로 돕기도하며 프로젝트를 추진해 가고 있습니다. \n\n모임시간 | 매주 화요일 20:00 PM \n\n모임방식 | 온라인 화상 모임, 숙제 검사 및 피드백, 회의 \n\n신청방법 | 박종원 010-1234-5677";

  const getClubMembers = () => {
    const result = [];
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
    await Promise.all([getClubMembers()]);
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
      style={{
        flex: 1,
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
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
          <Ionicons name="flag" size={18} color="#295AF5" />
          <SectionTitle>ABOUT</SectionTitle>
        </TitleView>
        <ContentView>
          <ContentText>{longDesc}</ContentText>
        </ContentView>
      </SectionView>
      <Break />
      <SectionView>
        <TitleView>
          <Ionicons name="ios-people-outline" size={18} color="#295AF5" />
          <SectionTitle>MEMBER</SectionTitle>
        </TitleView>
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
      </SectionView>
    </Animated.ScrollView>
  );
};

export default ClubHome;

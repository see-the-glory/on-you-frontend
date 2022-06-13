import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated } from "react-native";
import styled from "styled-components/native";
import { Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { ClubHomeScreenProps, ClubHomeParamList } from "../../types/club";

const MEMBER_ICON_KERNING = 25;
const MEMBER_ICON_SIZE = 50;
const SCREEN_PADDING_SIZE = 30;

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

const MemberItem = styled.View`
  position: relative;
  justify-content: center;
  align-items: center;
  margin-right: ${MEMBER_ICON_KERNING}px; ;
`;

const Badge = styled.View`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0%;
  background-color: white;
  border-radius: 10px;
`;

const MemberIcon = styled.TouchableOpacity`
  width: ${MEMBER_ICON_SIZE}px;
  height: ${MEMBER_ICON_SIZE}px;
  border-radius: ${Math.ceil(MEMBER_ICON_SIZE / 2)}px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-bottom: 8px;
  box-shadow: 1px 1px 1px gray;
  elevation: 3;
`;

const MemberImage = styled.Image`
  width: ${MEMBER_ICON_SIZE - 5}px;
  height: ${MEMBER_ICON_SIZE - 5}px;
  border-radius: ${Math.ceil(MEMBER_ICON_SIZE / 2)}px;
`;

const MemberName = styled.Text`
  font-weight: 600;
`;

const ClubHome: React.FC<ClubHomeScreenProps & ClubHomeParamList> = ({
  navigation: { navigate },
  route: {
    params: { clubData },
  },
  scrollY,
  headerDiff,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState([[{}]]);
  const [managerData, setManagerData] = useState([[{}]]);
  const [masterData, setMasterData] = useState({});
  const memberCountPerLine = Math.floor(
    (SCREEN_WIDTH - SCREEN_PADDING_SIZE) /
      (MEMBER_ICON_SIZE + MEMBER_ICON_KERNING)
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
    setLoading(false);
  };

  useEffect(() => {
    getData();

    console.log("----Club Home----");
    console.log(clubData);
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
      <Break />
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
            <MemberItem>
              <Badge>
                <MaterialIcons name="stars" size={18} color="#FF714B" />
              </Badge>
              <MemberIcon>
                <MemberImage source={{ uri: masterData.profilePath }} />
              </MemberIcon>
              <MemberName>{masterData.name}</MemberName>
            </MemberItem>
          </MemberLineView>
          <MemberSubTitleView>
            <MemberSubTitle>Manager</MemberSubTitle>
          </MemberSubTitleView>
          {managerData.map((bundle, index) => {
            return (
              <MemberLineView key={index}>
                {bundle.map((item, index) => {
                  return (
                    <MemberItem key={index}>
                      <Badge>
                        <MaterialIcons
                          name="check-circle"
                          size={18}
                          color="#ff714b"
                        />
                      </Badge>
                      <MemberIcon>
                        <MemberImage source={{ uri: item.profilePath }} />
                      </MemberIcon>
                      <MemberName>{item.name}</MemberName>
                    </MemberItem>
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
                    <MemberItem key={index}>
                      <MemberIcon>
                        <MemberImage source={{ uri: item.profilePath }} />
                      </MemberIcon>
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

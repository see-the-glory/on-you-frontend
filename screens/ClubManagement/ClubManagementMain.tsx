import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Animated, DeviceEventEmitter, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Feather, AntDesign, FontAwesome5, Entypo, Ionicons } from "@expo/vector-icons";
import { ClubManagementMainProps, ClubStackParamList } from "../../types/Club";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";
import { Shadow } from "react-native-shadow-2";
import { useMutation, useQuery } from "react-query";
import { Club, ClubApi, ClubResponse, ClubUpdateRequest } from "../../api";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MainView = styled.View``;

const Header = styled.View`
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  padding: 25px 0px 20px 0px;
`;

const NavigationView = styled.SafeAreaView<{ height: number }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: ${(props) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftNavigationView = styled.View`
  flex-direction: row;
  padding-left: 10px;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
  padding-right: 10px;
`;

const InformationView = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

const Title = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 18px;
  line-height: 28px;
`;

const HeaderText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 12px;
  color: #b7b7b7;
  padding-left: 5px;
  padding-right: 5px;
`;

const TagView = styled.View`
  width: 100%;
  flex-direction: row;
  margin-bottom: 3px;
`;

const Tag = styled.View<{ color: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: 0px 3px;
  border-radius: 5px;
  margin-right: 5px;
  border: 1px solid ${(props) => (props.color === "white" ? "#A5A5A5" : "#B4B4B4")};
`;

const TagText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 10px;
  line-height: 14px;
`;

const ButtonView = styled.View`
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
`;

const ToggleButton = styled.TouchableOpacity<{ isToggle: boolean }>`
  width: 35px;
  height: 20px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0px 2px;
  border-radius: 25px;
  background-color: ${(props) => (props.isToggle ? "#295AF5" : "#a5a5a5")};
`;
const Dot = styled.View`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 10px;
  background-color: white;
`;

const Content = styled.View``;
const ListView = styled.View`
  border-bottom-color: #dbdbdb;
  border-bottom-width: 1px;
`;
const ListItem = styled.TouchableOpacity`
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ItemRight = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ItemText = styled(CustomText)`
  margin-left: 10px;
  font-size: 14px;
`;

const AnimatedDot = Animated.createAnimatedComponent(Dot);

interface ClubEditItem {
  icon: React.ReactNode;
  title: string;
  screen: keyof ClubStackParamList;
}

const ClubManagementMain: React.FC<ClubManagementMainProps> = ({
  navigation: { navigate, goBack },
  route: {
    params: { clubData, refresh },
  },
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const [data, setData] = useState<Club>(clubData);
  const [isToggle, setIsToggle] = useState(false);
  const iconSize = 14;
  const items: ClubEditItem[] = [
    {
      icon: <Feather name="tool" size={iconSize} color="black" />,
      title: "모임 기본 사항 수정",
      screen: "ClubEditBasics",
    },
    {
      icon: <Feather name="edit-3" size={iconSize} color="black" />,
      title: "소개글 수정",
      screen: "ClubEditIntroduction",
    },
    {
      icon: <Feather name="users" size={iconSize} color="black" />,
      title: "관리자 / 멤버 관리",
      screen: "ClubEditMembers",
    },
    {
      icon: <Feather name="trash-2" size={iconSize} color="red" />,
      title: "모임 삭제",
      screen: "ClubDelete",
    },
  ];

  const X = useRef(new Animated.Value(0)).current;
  const { refetch: clubDataRefetch } = useQuery<ClubResponse>(["getClub", token, clubData.id], ClubApi.getClub, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        setData(res.data);
        if (res.data.recruitStatus === "OPEN") {
          setIsToggle(true);
          X.setValue(13);
        } else {
          setIsToggle(false);
        }
      } else {
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error getClub ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const mutation = useMutation(ClubApi.updateClub, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        if (res.data.recruitStatus === "OPEN") {
          setIsToggle(true);

          toast.show(`멤버 모집이 활성화되었습니다.`, {
            type: "success",
          });
        } else if (res.data.recruitStatus === "CLOSE") {
          setIsToggle(false);

          toast.show(`멤버 모집이 비활성화되었습니다.`, {
            type: "success",
          });
        }
        DeviceEventEmitter.emit("ClubRefetch");
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  useFocusEffect(
    useCallback(() => {
      console.log("ClubManagementMain useFocusEffect!");
      if (refresh) {
        clubDataRefetch();
      }
    }, [refresh])
  );
  useLayoutEffect(() => {
    if (isToggle) {
      // CLOSE -> OPEN
      Animated.timing(X, {
        toValue: 13,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      // OPEN -> CLOSE
      Animated.timing(X, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isToggle]);

  const goToScreen = (screen: keyof ClubStackParamList) => {
    return navigate(screen, { clubData: data });
  };

  const onPressToggle = () => {
    let updateData: ClubUpdateRequest = {
      data: { recruitStatus: isToggle ? "CLOSE" : "OPEN", category1Id: data.categories.length > 0 ? data.categories[0].id : -1, category2Id: data.categories.length > 1 ? data.categories[1].id : -1 },
      token,
      clubId: clubData.id,
    };

    if (data?.categories?.length === 1) {
      delete updateData.data?.category2Id;
    }

    mutation.mutate(updateData);
  };

  return (
    <Container>
      <StatusBar barStyle={"dark-content"} />
      <MainView>
        <Shadow distance={3} sides={{ top: false }} style={{ width: "100%" }}>
          <Header>
            <NavigationView height={50}>
              <LeftNavigationView>
                <TouchableOpacity onPress={goBack}>
                  <Entypo name="chevron-thin-left" size={20} color="black" />
                </TouchableOpacity>
              </LeftNavigationView>
              <RightNavigationView>
                <TouchableOpacity
                  onPress={() => {
                    clubDataRefetch();
                  }}
                >
                  <Ionicons name="refresh" size={20} color="black" />
                </TouchableOpacity>
              </RightNavigationView>
            </NavigationView>

            <InformationView>
              <TagView>
                <Tag color={"white"}>
                  <FontAwesome5 name="cross" size={6} color="#A5A5A5" />
                  <TagText style={{ color: "#A5A5A5", marginLeft: 3 }}>{data.organizationName}</TagText>
                </Tag>
                {data?.categories?.map((category, index) => (
                  <Tag key={index} color={"#B4B4B4"}>
                    <TagText style={{ color: "white" }}>{category.name}</TagText>
                  </Tag>
                ))}
              </TagView>
              <Title>{data.name}</Title>
            </InformationView>
            <CircleIcon size={70} uri={data.thumbnail} />
            <ButtonView>
              <AntDesign name="user" size={10} color="#B7B7B7" />
              <HeaderText>멤버모집</HeaderText>
              <ToggleButton onPress={onPressToggle} isToggle={isToggle} activeOpacity={1}>
                <AnimatedDot style={{ transform: [{ translateX: X }] }} />
                <AntDesign name="adduser" size={10} color="#FFFFFF" />
                <AntDesign name="deleteuser" size={10} color="#FFFFFF" />
              </ToggleButton>
            </ButtonView>
          </Header>
        </Shadow>
        <Content>
          {items?.map((item, index) => (
            <ListView key={index}>
              <ListItem
                onPress={() => {
                  goToScreen(item.screen);
                }}
              >
                <ItemLeft>
                  {item.icon}
                  <ItemText style={index === items.length - 1 ? { color: "red" } : {}}>{item.title}</ItemText>
                </ItemLeft>
                <ItemRight>
                  <Feather name="chevron-right" size={20} color="#A0A0A0" />
                </ItemRight>
              </ListItem>
            </ListView>
          ))}
        </Content>
      </MainView>
    </Container>
  );
};

export default ClubManagementMain;

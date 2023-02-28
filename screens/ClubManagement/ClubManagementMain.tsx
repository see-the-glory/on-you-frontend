import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Animated, DeviceEventEmitter, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Feather, AntDesign, FontAwesome5, Entypo, Ionicons } from "@expo/vector-icons";
import { ClubManagementMainProps, ClubStackParamList } from "../../types/Club";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";
import { Shadow } from "react-native-shadow-2";
import { useMutation, useQuery } from "react-query";
import { BaseResponse, Club, ClubApi, ClubDeletionRequest, ClubResponse, ClubUpdateRequest, ErrorResponse } from "../../api";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";
import Tag from "../../components/Tag";

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
  font-size: 14px;
  color: #a7a7a7;
  line-height: 20px;
  padding-left: 5px;
  padding-right: 5px;
`;

const TagView = styled.View`
  width: 100%;
  flex-direction: row;
  margin-bottom: 3px;
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
  screen?: keyof ClubStackParamList;
  onPress?: () => void;
  showRole?: string[];
}

const ClubManagementMain: React.FC<ClubManagementMainProps> = ({
  navigation: { navigate, goBack, popToTop },
  route: {
    params: { clubData, refresh },
  },
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const myRole = useSelector((state: RootState) => state.club.role);
  const toast = useToast();
  const [data, setData] = useState<Club>(clubData);
  const [isToggle, setIsToggle] = useState(false);
  const iconSize = 14;

  const X = useRef(new Animated.Value(0)).current;
  const { refetch: clubDataRefetch } = useQuery<ClubResponse, ErrorResponse>(["getClub", clubData.id], ClubApi.getClub, {
    onSuccess: (res) => {
      setData(res.data);
    },
    onError: (error) => {
      console.log(`API ERROR | getClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const updateClubMutation = useMutation(ClubApi.updateClub, {
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data.recruitStatus === "OPEN") {
          setIsToggle(true);
          toast.show(`멤버 모집이 활성화되었습니다.`, { type: "success" });
        } else if (res.data.recruitStatus === "CLOSE") {
          setIsToggle(false);
          toast.show(`멤버 모집이 비활성화되었습니다.`, { type: "success" });
        }
        DeviceEventEmitter.emit("ClubRefetch");
      } else {
        console.log(`updateClub mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
        toast.show(`Error Code: ${res.status}`, { type: "warning" });
      }
    },
    onError: (error) => {
      console.log("--- updateClub Error ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, { type: "warning" });
    },
  });
  const deleteClubMutation = useMutation<BaseResponse, ErrorResponse, ClubDeletionRequest>(ClubApi.deleteClub, {
    onSuccess: (res) => {
      toast.show(`모임이 삭제되었습니다.`, { type: "success" });
      DeviceEventEmitter.emit("ClubListRefetch");
      popToTop();
    },
    onError: (error) => {
      console.log(`API ERROR | deleteClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useFocusEffect(
    useCallback(() => {
      console.log("ClubManagementMain useFocusEffect!");
      if (refresh) clubDataRefetch();
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
  const deleteClub = () => {
    Alert.alert("가입 삭제", "정말로 모임을 삭제하시겠습니까?", [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          let requestData: ClubDeletionRequest = {
            clubId: clubData.id,
          };
          deleteClubMutation.mutate(requestData);
        },
      },
    ]);
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

    updateClubMutation.mutate(updateData);
  };

  const items: ClubEditItem[] = [
    {
      icon: <Feather name="tool" size={iconSize} color="black" />,
      title: "모임 기본 사항 수정",
      screen: "ClubEditBasics",
      showRole: ["MANAGER", "MASTER"],
    },
    {
      icon: <Feather name="edit-3" size={iconSize} color="black" />,
      title: "소개글 수정",
      screen: "ClubEditIntroduction",
      showRole: ["MANAGER", "MASTER"],
    },
    {
      icon: <Feather name="users" size={iconSize} color="black" />,
      title: "관리자 / 멤버 관리",
      screen: "ClubEditMembers",
      showRole: ["MASTER"],
    },
    {
      icon: <Feather name="trash-2" size={iconSize} color="red" />,
      title: "모임 삭제",
      onPress: deleteClub,
      showRole: ["MASTER"],
    },
  ];

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
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
                <Tag name={data.organizationName ?? ""} iconName="cross" backgroundColor="white" textColor="#B4B4B4" borderColor="#B4B4B4" />
                {data?.categories?.map((category, index) => (
                  <Tag key={index} name={category.name} backgroundColor="#C4C4C4" textColor="white" borderColor="#C4C4C4" />
                ))}
              </TagView>
              <Title>{data.name}</Title>
            </InformationView>
            <CircleIcon size={70} uri={data.thumbnail} />
            <ButtonView>
              <AntDesign name="user" size={12} color="#a7a7a7" style={{ marginRight: -3 }} />
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
                  if (item.showRole?.includes(myRole ?? "")) {
                    if (item.screen) goToScreen(item.screen);
                    if (item.onPress) item.onPress();
                  } else {
                    toast.show(`모임의 리더만 접근할 수 있습니다.`, { type: "warning" });
                  }
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

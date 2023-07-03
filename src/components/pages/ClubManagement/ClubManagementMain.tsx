import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Animated, BackHandler, DeviceEventEmitter, Platform, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Feather, AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import CircleIcon from "@components/atoms/CircleIcon";
import CustomText from "@components/atoms/CustomText";
import { Shadow } from "react-native-shadow-2";
import { useMutation, useQuery } from "react-query";
import { BaseResponse, Category, ClubApi, ClubDeletionRequest, ClubResponse, ClubUpdateRequest, ClubUpdateResponse, ErrorResponse } from "api";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "redux/store/reducers";
import Tag from "@components/atoms/Tag";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClubManagementStackParamList } from "@navigation/ClubManagementStack";

const Container = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
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
  padding-left: 16px;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
  padding-right: 16px;
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
  line-height: 20px;
`;

const AnimatedDot = Animated.createAnimatedComponent(Dot);

interface ClubEditItem {
  icon: React.ReactNode;
  title: string;
  screen?: keyof ClubStackParamList;
  onPress?: () => void;
  showRole?: string[];
}

const ClubManagementMain: React.FC<NativeStackScreenProps<ClubManagementStackParamList, "ClubManagementMain">> = ({
  navigation: { navigate, goBack, popToTop },
  route: {
    params: { clubId },
  },
}) => {
  const toast = useToast();
  const myRole = useSelector((state: RootState) => state.club[clubId]?.role);

  const iconSize = 14;

  const X = useRef(new Animated.Value(0)).current;

  const {
    data: clubData,
    isLoading: clubLoading,
    refetch: clubDataRefetch,
  } = useQuery<ClubResponse, ErrorResponse>(["getClub", clubId], ClubApi.getClub, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    staleTime: 10000,
    cacheTime: 15000,
  });

  const [isToggle, setIsToggle] = useState(clubData?.data?.recruitStatus === "OPEN" ? true : false);

  const updateClubMutation = useMutation<ClubUpdateResponse, ErrorResponse, ClubUpdateRequest>(ClubApi.updateClub, {
    onSuccess: (res) => {
      if (res.data.recruitStatus === "OPEN") {
        setIsToggle(true);
        toast.show(`멤버 모집이 활성화되었습니다.`, { type: "success" });
      } else if (res.data.recruitStatus === "CLOSE") {
        setIsToggle(false);
        toast.show(`멤버 모집이 비활성화되었습니다.`, { type: "success" });
      }
    },
    onError: (error) => {
      console.log(`API ERROR | updateClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

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
    return navigate(screen, { clubId, clubData: clubData?.data });
  };
  const deleteClub = () => {
    Alert.alert("가입 삭제", "정말로 모임을 삭제하시겠습니까?", [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          const requestData: ClubDeletionRequest = {
            clubId,
          };
          deleteClubMutation.mutate(requestData);
        },
      },
    ]);
  };

  const onPressToggle = () => {
    const updateData: ClubUpdateRequest = {
      data: {
        recruitStatus: isToggle ? "CLOSE" : "OPEN",
        category1Id: clubData?.data?.categories?.length > 0 ? clubData?.data?.categories[0].id : -1,
        category2Id: clubData?.data?.categories?.length > 1 ? clubData?.data?.categories[1].id : -1,
      },
      clubId,
    };

    if (clubData?.data?.categories?.length === 1) {
      delete updateData.data?.category2Id;
    }

    updateClubMutation.mutate(updateData);
  };

  const clubEditItem: ClubEditItem[] = [
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
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <MainView>
        <Shadow distance={3} sides={{ top: false }} style={{ width: "100%" }}>
          <Header>
            <NavigationView height={50}>
              <LeftNavigationView>
                <TouchableOpacity onPress={() => goBack()}>
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
                <Tag name={clubData?.data?.organizationName ?? ""} iconName="cross" backgroundColor="white" textColor="#B4B4B4" borderColor="#B4B4B4" />
                {clubData?.data?.categories?.map((category: Category, index: number) => (
                  <Tag key={index} name={category.name} backgroundColor="#C4C4C4" textColor="white" borderColor="#C4C4C4" />
                ))}
              </TagView>
              <Title>{clubData?.data?.name}</Title>
            </InformationView>
            <CircleIcon size={70} uri={clubData?.data?.thumbnail} />
            <ButtonView>
              <AntDesign name="user" size={12} color="#a7a7a7" style={{ marginRight: -3 }} />
              <HeaderText>멤버모집</HeaderText>
              <ToggleButton onPress={onPressToggle} disabled={updateClubMutation.isLoading} isToggle={isToggle} activeOpacity={1}>
                <AnimatedDot style={{ transform: [{ translateX: X }] }} />
                <AntDesign name="adduser" size={10} color="#FFFFFF" />
                <AntDesign name="deleteuser" size={10} color="#FFFFFF" />
              </ToggleButton>
            </ButtonView>
          </Header>
        </Shadow>
        <Content>
          {clubEditItem?.map((item: ClubEditItem, index: number) => (
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
                  <ItemText style={index === clubEditItem.length - 1 ? { color: "red" } : {}}>{item.title}</ItemText>
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

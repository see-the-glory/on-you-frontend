import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, TouchableOpacity, useWindowDimensions } from "react-native";
import { RefinedSchedule } from "../../Types/Club";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import Carousel from "../../components/Carousel";
import { useMutation } from "react-query";
import { ClubApi, ClubScheduleDeleteRequest, ClubScheduleJoinOrCancelRequest, Schedule } from "../../api";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import CircleIcon from "../../components/CircleIcon";
import CircleIconBundle from "../../components/CircleIconBundle";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import { useNavigation } from "@react-navigation/native";

const ModalContainer = styled.View`
  height: 480px;
  justify-content: center;
  align-items: center;
`;
const Container = styled.View<{ pageWidth: number; gap: number }>`
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: ${(props: any) => props.pageWidth}px;
  margin: 0px ${(props: any) => props.gap / 2}px;
`;
const Header = styled.View<{ index: number }>`
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${(props: any) => (props.index === 0 ? "#FF6C45" : "#CCCCCC")};
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ScheduleText = styled(CustomText)<{ index: number }>`
  font-size: 16px;
  line-height: 21px;
  color: ${(props: any) => (props.index === 0 ? "white" : "black")};
`;

const ScheduleTitle = styled(CustomText)<{ index: number }>`
  font-size: 26px;
  font-family: "NotoSansKR-Bold";
  line-height: 32px;
  color: ${(props: any) => (props.index === 0 ? "white" : "black")};
`;

const Content = styled.View`
  width: 100%;
  padding: 0px 20px;
  align-items: flex-start;
`;

const ContentItemView = styled.View`
  height: 30px;
  flex-direction: row;
  padding: 8px 8px;
  align-items: center;
  justify-content: center;
`;
const ContentCollapsibleView = styled.View`
  flex-direction: row;
  justify-content: center;
  padding-left: 10px;
`;

const ContentMemberView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const ContentText = styled(CustomText)`
  padding: 0px 10px;
  font-size: 10px;
  line-height: 15px;
  color: #6f6f6f;
`;

const ContentSubText = styled(CustomText)`
  font-size: 9px;
  line-height: 15px;
  color: #8e8e8e;
`;

const MemoScrollView = styled.ScrollView`
  width: 100%;
  height: 200px;
  padding: 0px 8px;
`;
const Memo = styled(CustomText)`
  color: #6f6f6f;
  font-size: 10px;
  line-height: 15px;
`;

const Footer = styled.View`
  align-items: center;
  width: 100%;
  margin: 20px 0px;
`;

const ApplyButton = styled.TouchableOpacity<{ participation: boolean }>`
  width: 130px;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => (props.participation ? "white" : "#ff714b")};
  padding: 5px 0px;
  border: 1px solid #ff714b;
`;

const ButtonText = styled(CustomText)<{ participation: boolean }>`
  font-size: 12px;
  line-height: 16px;
  font-family: "NotoSansKR-Medium";
  color: ${(props: any) => (props.participation ? "#ff714b" : "white")};
`;

const ModalHeaderLeft = styled.View`
  position: absolute;
  padding: 2px;
  left: 5px;
  top: 5px;
`;

const ModalHeaderRight = styled.View`
  position: absolute;
  padding: 2px;
  right: 5px;
  top: 5px;
`;

const Break = styled.View<{ sep: number }>`
  width: 100%;
  margin-bottom: ${(props: any) => props.sep}px;
  margin-top: ${(props: any) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
`;

const MenuText = styled(CustomText)<{ color: string }>`
  font-size: 12px;
  color: ${(props: any) => (props.color ? props.color : "#1b1717")};
`;

interface ScheduleModalProps {
  visible: boolean;
  clubId: number;
  scheduleData?: RefinedSchedule[];
  selectIndex: number;
  closeModal: (refresh: boolean) => void;
  children: object;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ visible, clubId, scheduleData, selectIndex, closeModal, children }) => {
  const toast = useToast();
  const token = useSelector((state: any) => state.auth.token);
  const navigation = useNavigation();
  const me = useSelector((state: any) => state.auth.user);
  const [showModal, setShowModal] = useState(visible);
  const [menuVisibleMap, setMenuVisibleMap] = useState(new Map(scheduleData?.slice(0, -1).map((schedule) => [schedule.id, false])));
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const gap = 32;
  const offset = 12;
  const pageWidth = SCREEN_WIDTH - (gap + offset) * 2;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(opacity, {
        toValue: 1,
        speed: 20,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => setShowModal(false), 200);
    }
  };

  const hideMenu = (scheduleId: number) => setMenuVisibleMap((prev) => new Map(prev).set(scheduleId, false));
  const showMenu = (scheduleId: number) => setMenuVisibleMap((prev) => new Map(prev).set(scheduleId, true));

  const joinOrCancelMutation = useMutation(ClubApi.joinOrCancelClubSchedule);
  const deleteScheduleMutation = useMutation(ClubApi.deleteClubSchedule);

  const joinOrCancel = (index: number, scheduleId?: number) => {
    if (scheduleId === undefined) {
      return toast.show(`Schedule ID Error`, {
        type: "warning",
      });
    }
    let requestData: ClubScheduleJoinOrCancelRequest = {
      token,
      clubId,
      scheduleId,
    };

    joinOrCancelMutation.mutate(requestData, {
      onSuccess: (res) => {
        if (res.status === 200) {
          if (scheduleData) {
            // 이 스케줄에 참여한 상태라면, 멤버 중 '나'를 찾고 삭제한다.
            if (scheduleData[index].participation) {
              let target = scheduleData[index].members?.findIndex((member) => member.id === me?.id);
              if (target !== undefined && target > -1) scheduleData[index].members?.splice(target, 1);
            } else {
              // 이 스케줄에 내가 참여되어 있지 않다면, '나'를 추가한다.
              if (me) scheduleData[index].members?.push(me);
            }
            scheduleData[index].participation = !scheduleData[index].participation;
          }
        } else {
          console.log("--- joinOrCancelMutation Error ---");
          console.log(res);
          toast.show(`Error Code: ${res.status}`, {
            type: "warning",
          });
        }
      },
      onError: (error) => {
        console.log("--- joinOrCancelClubSchedule Error ---");
        console.log(`error: ${error}`);
        toast.show(`Error Code: ${error}`, {
          type: "warning",
        });
      },
    });
  };

  const deleteSchedule = (scheduleId?: number) => {
    hideMenu(scheduleId ?? -1);
    if (scheduleId === undefined) {
      return toast.show(`Schedule ID Error`, {
        type: "warning",
      });
    }
    let requestData: ClubScheduleDeleteRequest = {
      token,
      clubId,
      scheduleId,
    };

    deleteScheduleMutation.mutate(requestData, {
      onSuccess: (res) => {
        console.log(res);
        if (res.status === 200) {
          toast.show(`일정을 삭제했습니다.`, {
            type: "success",
          });
        } else {
          console.log("--- deleteScheduleMutation Error ---");
          console.log(res);
          toast.show(`Error Code: ${res.status}`, {
            type: "warning",
          });
        }
      },
      onError: (error) => {
        console.log("--- deleteScheduleMutation Error ---");
        console.log(error);
        toast.show(`Error Code: ${error}`, {
          type: "warning",
        });
      },
      onSettled: () => {
        closeModal(true);
      },
    });
  };

  const goToScheduleEdit = (item: Schedule) => {
    hideMenu(item.id ?? -1);
    closeModal(false);
    return navigation.navigate("ClubStack", { screen: "ClubScheduleEdit", clubData: { id: clubId }, scheduleData: item });
  };

  return (
    <Modal transparent visible={showModal} onRequestClose={() => closeModal(true)} supportedOrientations={["landscape", "portrait"]}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          opacity: opacity,
          zIndex: 1,
        }}
      >
        <ModalContainer>
          <Carousel
            gap={gap}
            offset={offset}
            pageWidth={pageWidth}
            pages={scheduleData?.slice(0, -1)}
            keyExtractor={(item: RefinedSchedule, index: number) => String(index)}
            initialScrollIndex={selectIndex}
            renderItem={({ item, index }: { item: RefinedSchedule; index: number }) => (
              <Container key={index} pageWidth={pageWidth} gap={gap}>
                <Header index={index}>
                  <ModalHeaderLeft>
                    <TouchableOpacity onPress={() => closeModal(true)}>
                      <Ionicons name="close" size={14} color="black" />
                    </TouchableOpacity>
                  </ModalHeaderLeft>
                  <ModalHeaderRight>
                    <Menu
                      visible={menuVisibleMap.get(item.id ?? -1)}
                      style={{ marginTop: 20, borderRadius: 0, width: 55, marginLeft: -45 }}
                      anchor={
                        <TouchableOpacity onPress={() => showMenu(item.id ?? -1)}>
                          <Ionicons name="ellipsis-vertical" size={14} color="black" />
                        </TouchableOpacity>
                      }
                      onRequestClose={() => hideMenu(item.id ?? -1)}
                      animationDuration={100}
                    >
                      <MenuItem onPress={() => goToScheduleEdit(item)} style={{ margin: -8 }}>
                        <MaterialCommunityIcons name={"pencil-outline"} size={12} color="black" />
                        <MenuText>{` 수정`}</MenuText>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem onPress={() => deleteSchedule(item.id)} style={{ margin: -8 }}>
                        <Feather name="trash-2" size={12} color="#FF714B" />
                        <MenuText color={"#FF714B"}>{` 삭제`}</MenuText>
                      </MenuItem>
                    </Menu>
                  </ModalHeaderRight>
                  <ScheduleText index={index}>{item.year}</ScheduleText>
                  <ScheduleTitle index={index}>
                    {item.month}/{item.day} {item.dayOfWeek}
                  </ScheduleTitle>
                </Header>
                <Content>
                  <ContentItemView>
                    <Feather name="clock" size={13} color="black" />
                    <ContentText>
                      {`${item.ampm} ${item.hour}시`}
                      {item.minute !== "0" ? ` ${item.minute}분` : ""}
                    </ContentText>
                  </ContentItemView>
                  <Break sep={0} />
                  <ContentItemView>
                    <Feather name="map-pin" size={13} color="black" />
                    <ContentText>{item.location}</ContentText>
                  </ContentItemView>
                  <Break sep={0} />
                  <ContentItemView>
                    <Feather name="users" size={13} color="black" />
                    {item.participation || item.members?.length ? (
                      <ContentCollapsibleView>
                        {item.participation ? <CircleIcon size={18} uri={me?.thumbnail} kerning={5} /> : <></>}
                        <CircleIconBundle size={18} kerning={-8} uris={item.members?.filter((member) => member.id != me?.id).map((member) => member.thumbnail)} />
                      </ContentCollapsibleView>
                    ) : (
                      <ContentText>{`참여 멤버가 없습니다.`}</ContentText>
                    )}
                  </ContentItemView>
                  <Break sep={0} />
                  <ContentItemView>
                    <Ionicons name="checkmark-sharp" size={13} color="black" />
                    <ContentText>{`메모`}</ContentText>
                  </ContentItemView>
                  <MemoScrollView>
                    <Memo>{item.content}</Memo>
                  </MemoScrollView>
                </Content>
                <Footer>
                  <ApplyButton participation={item.participation} onPress={() => joinOrCancel(index, item.id)}>
                    {item.participation ? <ButtonText participation={item.participation}>참석 취소</ButtonText> : <ButtonText participation={item.participation}>참석</ButtonText>}
                  </ApplyButton>
                </Footer>
              </Container>
            )}
          />
        </ModalContainer>
      </Animated.View>
    </Modal>
  );
};

export default ScheduleModal;

import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, BackHandler, DeviceEventEmitter, FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components/native";
import { BaseResponse, ClubApi, CommonApi, ErrorResponse, Notification, NotificationsResponse, ReadActionRequest } from "../../api";
import CustomText from "../../components/CustomText";
import NotificationItem from "../../components/NotificationItem";

const SCREEN_PADDING_SIZE = 20;

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.SafeAreaView`
  flex: 1;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #acacac;
  justify-content: center;
  align-items: center;
`;

const ClubNotification = ({
  navigation: { navigate, goBack, setOptions },
  route: {
    params: { clubData, clubRole },
  },
}) => {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: notifications,
    isLoading: notiLoading,
    refetch: notiRefetch,
  } = useQuery<NotificationsResponse, ErrorResponse>(["getClubNotifications", clubData.id], ClubApi.getClubNotifications, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getClubNotifications ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const readActionMutation = useMutation<BaseResponse, ErrorResponse, ReadActionRequest>(CommonApi.readAction, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | readAction ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await notiRefetch();
    setRefreshing(false);
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    let clubNotiSubs = DeviceEventEmitter.addListener("ClubNotificationRefresh", () => {
      console.log("ClubNotification - Refresh Event");
      onRefresh();
    });
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => {
      clubNotiSubs.remove();
      backHandler.remove();
      DeviceEventEmitter.emit("ClubRefetch");
    };
  }, []);

  const handlingActions = ["APPLY", "APPROVE", "REJECT", "FEED_CREATE", "SCHEDULE_CREATE"];

  const readAction = (item: Notification) => {
    if (item.read || item.done) return;
    const requestData: ReadActionRequest = { actionId: item.actionId };
    readActionMutation.mutate(requestData, {
      onSuccess: (res) => {
        item.read = true;
      },
    });
  };

  const onPressItem = (item: Notification) => {
    if (item.actionType === "APPLY") {
      if (clubRole && ["MASTER", "MANAGER"].includes(clubRole?.role)) {
        const clubApplicationProps = {
          clubData,
          actionId: item.actionId,
          actionerName: item.actionerName,
          actionerId: item.actionerId,
          message: item.message,
          createdTime: item.created,
          processDone: item.done || item.processDone,
        };
        return navigate("ClubApplication", clubApplicationProps);
      } else {
        return toast.show("가입신청서를 볼 수 있는 권한이 없습니다.", { type: "warning" });
      }
    } else if (item.actionType === "FEED_CREATE") {
      readAction(item);
      // const targetIndex = feeds.findIndex((feed => feed.id === id)); 현재 feed redux에서 찾아보기
      if (item.actionFeedId === undefined) {
        const clubFeedDetailProps = {
          clubData,
          targetIndex: 0,
        };
        return navigate("ClubStack", { screen: "ClubFeedDetail", params: clubFeedDetailProps });
      } else {
        const feedSelectionProps = { selectFeedId: item.actionFeedId };
        return navigate("FeedStack", { screen: "FeedSelection", params: feedSelectionProps });
      }
    } else if (item.actionType === "SCHEDULE_CREATE") {
      readAction(item);
      goBack();
    }
  };

  return notiLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10, paddingHorizontal: SCREEN_PADDING_SIZE }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={notifications && Array.isArray(notifications?.data) ? [...notifications?.data].filter((item) => handlingActions.includes(item.actionType ?? "")).reverse() : []}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        keyExtractor={(item: Notification, index: number) => String(index)}
        renderItem={({ item, index }: { item: Notification; index: number }) => (
          <TouchableOpacity onPress={() => onPressItem(item)}>
            <NotificationItem notificationData={item} notificationType={"CLUB"} clubData={clubData} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <EmptyView>
            <EmptyText>{`아직 도착한 소식이 없습니다.`}</EmptyText>
          </EmptyView>
        )}
      />
    </Container>
  );
};

export default ClubNotification;

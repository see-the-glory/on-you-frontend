import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components/native";
import { BaseResponse, CommonApi, ErrorResponse, Notification, NotificationsResponse, ReadActionRequest, UserApi } from "../../api";
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

const UserNotification = ({ navigation: { navigate, goBack, setOptions } }) => {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: notifications,
    isLoading: notiLoading,
    refetch: notiRefetch,
  } = useQuery<NotificationsResponse, ErrorResponse>(["getUserNotifications"], UserApi.getUserNotifications, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getUserNotifications ${error.code} ${error.status}`);
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
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    let userNotifSubs = DeviceEventEmitter.addListener("UserNotificationRefresh", () => {
      console.log("UserNotification - Refresh Event");
      onRefresh();
    });
    return () => {
      DeviceEventEmitter.emit("HomeNotiRefetch");
      userNotifSubs.remove();
    };
  }, []);

  const handlingActions = ["APPLY", "APPROVE", "REJECT", "FEED_COMMENT", "SCHEDULE_CREATE", "COMMENT_REPLY"];

  const readAction = (item: Notification) => {
    if (item.read || item.done) return;
    const requestData: ReadActionRequest = { actionId: item.actionId };
    readActionMutation.mutate(requestData, {
      onSuccess: (res) => {
        item.read = true;
      },
    });
  };

  const onPressItem = async (item: Notification) => {
    if (item.actionType === "APPLY") {
      const clubApplicationProps = {
        clubData: {
          id: item.actionClubId,
          name: item.actionClubName,
        },
        actionId: item.actionId,
        actionerName: item.actionerName,
        actionerId: item.actionerId,
        message: item.message,
        createdTime: item.created,
        processDone: item.done || item.processDone,
      };
      return navigate("ClubStack", {
        screen: "ClubApplication",
        params: clubApplicationProps,
      });
    } else if (item.actionType === "APPROVE") {
      readAction(item);
      const clubTopTabsProps = { clubData: { id: item.actionClubId } };
      return navigate("ClubStack", { screen: "ClubTopTabs", params: clubTopTabsProps });
    } else if (item.actionType === "REJECT") {
      readAction(item);
      const clubJoinRejectMessageProps = {
        clubName: item.actionClubName,
        message: item.message,
        createdTime: item.created,
      };
      return navigate("ClubStack", { screen: "ClubJoinRejectMessage", params: clubJoinRejectMessageProps });
    } else if (item.actionType === "FEED_COMMENT") {
      readAction(item);
      const feedSelectionProps = { selectFeedId: item.actionFeedId };
      return navigate("FeedStack", { screen: "FeedSelection", params: feedSelectionProps });
    } else if (item.actionType === "SCHEDULE_CREATE") {
      readAction(item);
      const clubTopTabsProps = { clubData: { id: item.actionClubId } };
      return navigate("ClubStack", { screen: "ClubTopTabs", params: clubTopTabsProps });
    } else if (item.actionType === "COMMENT_REPLY") {
      readAction(item);
      const feedSelectionProps = { selectFeedId: item.actionFeedId };
      return navigate("FeedStack", { screen: "FeedSelection", params: feedSelectionProps });
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
            <NotificationItem notificationData={item} notificationType={"USER"} clubData={{ id: item.actionClubId, name: item.actionClubName }} />
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

export default UserNotification;

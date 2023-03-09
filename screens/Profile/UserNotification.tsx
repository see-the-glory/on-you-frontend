import React, { useEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { ErrorResponse, Notification, NotificationsResponse, UserApi } from "../../api";
import CustomText from "../../components/CustomText";
import NotificationItem from "../../components/NotificationItem";
import notifee from "@notifee/react-native";

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

const EmptyText = styled(CustomText)`
  font-size: 14px;
  color: #bdbdbd;
  justify-content: center;
  align-items: center;
`;

const UserNotification = ({ navigation: { navigate } }) => {
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

  const onRefresh = async () => {
    setRefreshing(true);
    await notiRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    let userNotifSubs = DeviceEventEmitter.addListener("UserNotificationRefresh", () => {
      console.log("UserNotification - Refresh Event");
      onRefresh();
    });
    return () => userNotifSubs.remove();
  }, []);

  const onPressItem = async (item: Notification) => {
    if (item.actionType === "APPLY") {
      return navigate("ClubStack", {
        screen: "ClubApplication",
        clubData: {
          id: item.actionClubId,
          name: item.actionClubName,
        },
        actionId: item.actionId,
        actionerName: item.actionerName,
        actionerId: item.actionerId,
        message: item.message,
        createdTime: item.created,
        processDone: item.processDone,
      });
    } else if (item.actionType === "APPROVE") {
      return navigate("ClubStack", { screen: "ClubTopTabs", clubData: { id: item.actionClubId } });
    } else if (item.actionType === "REJECT") {
      // 거절 메시지 보여주기
      await notifee.displayNotification({
        title: "TITLE TEST",
        body: "body test",
        android: {
          channelId: "club",
          pressAction: {
            id: "action!",
          },
        },
      });
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
        data={notifications && Array.isArray(notifications?.data) ? [...notifications?.data].reverse() : []}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        keyExtractor={(item: Notification, index: number) => String(index)}
        renderItem={({ item, index }: { item: Notification; index: number }) => (
          <TouchableOpacity onPress={() => onPressItem(item)}>
            <NotificationItem notificationData={item} clubData={{ id: item.actionClubId, name: item.actionClubName }} />
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

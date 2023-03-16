import React, { useEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components/native";
import { BaseResponse, CommonApi, ErrorResponse, Notification, NotificationsResponse, ReadActionRequest, UserApi } from "../../api";
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

const EmptyText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
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

  const handlingActions = ["APPLY", "APPROVE", "REJECT", "FEED_COMMENT"];

  const onPressItem = async (item: Notification) => {
    const requestData: ReadActionRequest = {
      actionId: item.actionId,
    };
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
        processDone: item.processDone,
      };
      return navigate("ClubStack", {
        screen: "ClubApplication",
        params: clubApplicationProps,
      });
    } else if (item.actionType === "APPROVE") {
      if (!item.processDone) {
        readActionMutation.mutate(requestData, {
          onSuccess: (res) => {
            item.processDone = true;
          },
        });
      }
      return navigate("ClubStack", { screen: "ClubTopTabs", clubData: { id: item.actionClubId } });
    } else if (item.actionType === "REJECT") {
      if (!item.processDone) {
        readActionMutation.mutate(requestData, {
          onSuccess: (res) => {
            item.processDone = true;
          },
        });
      }
      const clubJoinRejectMessageProps = {
        clubName: item.actionClubName,
        message: item.message,
        createdTime: item.created,
      };
      return navigate("ClubStack", { screen: "ClubJoinRejectMessage", params: clubJoinRejectMessageProps });
    } else if (item.actionType === "FEED_COMMENT") {
      if (!item.processDone) {
        readActionMutation.mutate(requestData, {
          onSuccess: (res) => {
            item.processDone = true;
          },
        });
      }
      toast.show(`곧 구현됩니다!`, { type: "success" });
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

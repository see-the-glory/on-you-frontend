import React, { useEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { ClubApi, Notification } from "../../api";
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
  color: #bdbdbd;
  justify-content: center;
  align-items: center;
`;

const ClubNotification = ({
  navigation: { navigate },
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
  } = useQuery(["getClubNotifications", clubData.id], ClubApi.getClubNotifications, {
    onSuccess: (res) => {
      if (res.status !== 200 || res.resultCode !== "OK") {
        console.log(`--- getClubNotifications Error ---`);
        console.log(`getClubNotifications status: ${res.status}`);
        console.log(res);
        toast.show("모임 소식정보를 불러오지 못했습니다.", {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log(`--- getClubNotifications Error ---`);
      console.log(error);
      toast.show(`모임 소식 정보를 불러오지 못했습니다. ${error}`, {
        type: "warning",
      });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await notiRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    let subscription = DeviceEventEmitter.addListener("NotificationRefresh", () => {
      console.log("Notification - Refresh Event");
      onRefresh();
    });
    return () => subscription.remove();
  }, []);

  const onPressItem = (item: Notification) => {
    if (clubRole && ["MASTER", "MANAGER"].includes(clubRole?.role)) {
      if (item.actionType === "APPLY") {
        return navigate("ClubApplication", {
          clubData,
          actionId: item.actionId,
          actionerName: item.actionerName,
          actionerId: item.actionerId,
          applyMessage: item.applyMessage,
        });
      }
    } else {
      toast.show("가입신청서를 볼 수 있는 권한이 없습니다.", {
        type: "warning",
      });
    }
  };

  return notiLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <StatusBar barStyle={"dark-content"} />
      <FlatList
        contentContainerStyle={{ flexGrow: 1, marginVertical: 10, paddingHorizontal: SCREEN_PADDING_SIZE }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={[...notifications?.data].reverse()}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        keyExtractor={(item: Notification, index: number) => String(index)}
        renderItem={({ item, index }: { item: Notification; index: number }) => (
          <TouchableOpacity onPress={() => onPressItem(item)} disabled={item?.processDone ?? false}>
            <NotificationItem notificationData={item} clubData={clubData} />
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

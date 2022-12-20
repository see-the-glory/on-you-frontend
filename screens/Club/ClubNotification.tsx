import React, { useState } from "react";
import { ActivityIndicator, FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Item } from "react-native-picker-select";
import { useToast } from "react-native-toast-notifications";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { Club, ClubApi, Notification } from "../../api";
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
  navigation: { navigate, goback },
  route: {
    params: { clubData },
  },
}) => {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    isLoading: notiLoading,
    data: notifications,
    refetch: notiRefetch,
    isRefetching: isRefetchingNoti,
  } = useQuery(["getClubNotifications", clubData.id], ClubApi.getClubNotifications, {
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (error) => {
      toast.show(`모임 소식 정보를 불러오지 못했습니다. ${error}`, {
        type: "error",
      });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await notiRefetch();
    setRefreshing(false);
  };

  const onPressItem = (item: Notification) => {
    if (item.actionType === "APPLY") {
      return navigate("ClubApplication", {
        clubData,
        actionerName: item.actionerName,
        applyMessage: item.applyMessage,
      });
    }
  };

  return notiLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <StatusBar barStyle={"default"} />
      <FlatList
        contentContainerStyle={{ flexGrow: 1, marginVertical: 10, paddingHorizontal: SCREEN_PADDING_SIZE }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={notifications.data}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        keyExtractor={(item: Notification, index: number) => String(index)}
        renderItem={({ item, index }: { item: Notification; index: number }) => (
          <TouchableOpacity onPress={() => onPressItem(item)}>
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

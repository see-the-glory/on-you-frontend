import React, { useCallback, useLayoutEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, Platform, StatusBar, TouchableOpacity } from "react-native";
import { useMutation, useQuery } from "react-query";
import { UserApi, Club, MyClubsResponse, ErrorResponse, BaseResponse, ClubWithdrawRequest, ClubApi } from "api";
import CircleIcon from "@components/atoms/CircleIcon";
import { useToast } from "react-native-toast-notifications";
import { Entypo } from "@expo/vector-icons";
import Tag from "@components/atoms/Tag";
import { ProfileStackParamList } from "@navigation/ProfileStack";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
  background-color: white;
`;

const Break = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
`;

const Item = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 8px 20px;
`;

const ItemInfo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ItemInfoDetail = styled.View``;

const WithdrawButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.accentColor};
  border-radius: 8px;
`;

const WithdrawText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  padding: 6px 12px;
  color: white;
`;

const ClubNameView = styled.View``;
const CategoryView = styled.View`
  flex-direction: row;
  margin-top: 2px;
`;

const ItemTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  color: #2b2b2b;
  font-size: 16px;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const EmptyText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #acacac;
  justify-content: center;
  align-items: center;
`;

const MyClubs: React.FC<NativeStackScreenProps<ProfileStackParamList, "MyClubs">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();
  const {
    isLoading: myClubInfoLoading,
    data: myClubs,
    refetch: myClubRefetch,
  } = useQuery<MyClubsResponse, ErrorResponse>(["getMyClubs"], UserApi.getMyClubs, {
    onSuccess: (res) => {
      onRefresh();
    },
    onError: (error) => {
      console.log(`API ERROR | getMyClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const withdrawClubMutation = useMutation<BaseResponse, ErrorResponse, ClubWithdrawRequest>(ClubApi.withdrawClub, {
    onSuccess: (res) => {
      toast.show(`모임에서 탈퇴하셨습니다.`, { type: "success" });
      DeviceEventEmitter.emit("ClubRefetch");
    },
    onError: (error) => {
      console.log(`API ERROR | withdrawClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    myClubRefetch();
    setRefreshing(false);
  };

  const goToClub = (clubId: number) => {
    const clubTopTabsProps = {
      clubId,
    };
    return navigate("ClubStack", {
      screen: "ClubTopTabs",
      params: clubTopTabsProps,
    });
  };

  const withdrawClub = (clubId: number) => {
    const requestData = { clubId };
    Alert.alert("모임 탈퇴", "정말로 모임에서 탈퇴하시겠습니까?", [
      { text: "아니요" },
      {
        text: "예",
        onPress: () => {
          withdrawClubMutation.mutate(requestData);
        },
      },
    ]);
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

  const itemSeparatorComponent = useCallback(() => <Break />, []);
  const renderItem = useCallback(
    ({ item, index }: { item: Club; index: number }) => (
      <Item key={index}>
        <ItemInfo onPress={() => goToClub(item.id)}>
          <CircleIcon size={35} uri={item.thumbnail} kerning={10} />
          <ItemInfoDetail>
            <ClubNameView>
              <ItemTitle>{item.name}</ItemTitle>
            </ClubNameView>
            <CategoryView>
              {item.categories?.map((category, index) => (
                <Tag
                  key={`Category_${index}`}
                  textColor="white"
                  backgroundColor="#C4C4C4"
                  name={category.name}
                  textStyle={{ fontSize: 10 }}
                  contentContainerStyle={{ paddingTop: 1, paddingBottom: 1 }}
                />
              ))}
            </CategoryView>
          </ItemInfoDetail>
        </ItemInfo>
        <WithdrawButton onPress={() => withdrawClub(item.id)}>
          <WithdrawText>{`탈퇴`}</WithdrawText>
        </WithdrawButton>
      </Item>
    ),
    []
  );
  const listEmptyComponent = useCallback(
    () => (
      <EmptyView>
        <EmptyText>{`가입한 모임이 없습니다.`}</EmptyText>
      </EmptyView>
    ),
    []
  );

  return myClubInfoLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      keyExtractor={(item: Club, index: number) => String(index)}
      data={myClubs?.data.filter((item) => item.applyStatus === "APPROVED")}
      ItemSeparatorComponent={itemSeparatorComponent}
      ListFooterComponent={myClubs?.data?.length ? itemSeparatorComponent : null}
      ListEmptyComponent={listEmptyComponent}
      stickyHeaderIndices={[0]}
      renderItem={renderItem}
    />
  );
};

export default MyClubs;

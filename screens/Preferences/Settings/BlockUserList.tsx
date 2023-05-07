import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Platform, StatusBar, TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components/native";
import { BaseResponse, BlockUser, BlockUserListResponse, ErrorResponse, UserApi, UserBlockRequest } from "../../../api";
import CircleIcon from "../../../components/CircleIcon";
import CustomText from "../../../components/CustomText";

const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Item = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 8px 20px;
`;

const ItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ItemRight = styled.View``;

const ItemLeftDetail = styled.View`
  padding-left: 10px;
`;

const ItemText = styled(CustomText)`
  font-size: 16px;
  line-height: 21px;
  font-family: "NotoSansKR-Medium";
  /* margin-bottom: 2px; */
`;

const UnblockButton = styled.TouchableOpacity`
  background-color: #ff6534;
  border-radius: 8px;
`;

const UnBlockButtonText = styled(CustomText)`
  padding: 5px 12px;
  color: white;
`;

const Break = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
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

const BlockUserList: React.FC<NativeStackScreenProps<any, "BlockUserList">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {
    data: blockUserList,
    isLoading: blockUserListLoading,
    refetch: blockUserListRefetch,
  } = useQuery<BlockUserListResponse, ErrorResponse>(["blockUserList"], UserApi.getBlockUserList, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getBlockUserList ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const unblockMutation = useMutation<BaseResponse, ErrorResponse, UserBlockRequest>(UserApi.blockUser, {
    onSuccess: (res) => {
      toast.show(`차단을 해제했습니다.`, { type: "success" });
      blockUserListRefetch();
    },
    onError: (error) => {
      console.log(`API ERROR | blockUser ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    blockUserListRefetch();
    setRefreshing(false);
  };

  const unblock = (userName: string, userId: number) => {
    console.log(userId);
    const requestData: UserBlockRequest = { userId };
    Alert.alert(`${userName}님을 차단 해제하시겠어요?`, `이제 홈화면에서 ${userName}님의 게시글을 볼 수 있게 됩니다. ${userName}님에게는 차단을 해제했다는 정보를 알리지 않습니다.`, [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          unblockMutation.mutate(requestData);
        },
      },
    ]);
  };

  useEffect(() => {
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
    ({ item, index }: { item: BlockUser; index: number }) => (
      <Item key={index}>
        <ItemLeft>
          <CircleIcon size={46} uri={item.thumbnail} />
          <ItemLeftDetail>
            <ItemText>{item.userName}</ItemText>
          </ItemLeftDetail>
        </ItemLeft>
        <ItemRight>
          <UnblockButton onPress={() => unblock(item.userName, item.userId)}>
            <UnBlockButtonText>{`차단 해제`}</UnBlockButtonText>
          </UnblockButton>
        </ItemRight>
      </Item>
    ),
    []
  );

  const listEmptyComponent = useCallback(
    () => (
      <EmptyView>
        <EmptyText>{`차단된 계정이 없습니다.`}</EmptyText>
      </EmptyView>
    ),
    []
  );

  return blockUserListLoading ? (
    <Container>
      <ActivityIndicator />
    </Container>
  ) : (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 5 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      keyExtractor={(item: BlockUser, index: number) => String(index)}
      data={blockUserList?.data}
      ItemSeparatorComponent={itemSeparatorComponent}
      ListFooterComponent={blockUserList?.data?.length ? itemSeparatorComponent : null}
      renderItem={renderItem}
      ListEmptyComponent={listEmptyComponent}
    />
  );
};

export default BlockUserList;

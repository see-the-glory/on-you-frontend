import React, { useCallback, useLayoutEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { ActivityIndicator, FlatList, Platform, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import { useQuery } from "react-query";
import { UserApi, Club, MyClubsResponse, ErrorResponse, MyClub } from "../../api";
import CircleIcon from "../../components/CircleIcon";
import { useToast } from "react-native-toast-notifications";
import { Entypo } from "@expo/vector-icons";
import Tag from "../../components/Tag";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Header = styled.View`
  background-color: white;
  padding: 10px 20px;
`;

const Title = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #b0b0b0;
`;

const Break = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
`;

const Item = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  align-items: center;
  background-color: white;
  padding: 8px 20px;
`;

const ItemInfo = styled.View`
  padding-left: 10px;
  justify-content: space-around;
`;

const ClubNameView = styled.View``;
const CategoryView = styled.View`
  flex-direction: row;
  margin-top: 2px;
`;

const ItemTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 14px;
  line-height: 20px;
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

const ClubSelection: React.FC<NativeStackScreenProps<any, "ClubSelection">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();
  const {
    isLoading: myClubInfoLoading,
    data: myClubs,
    refetch: myClubRefetch,
  } = useQuery<MyClubsResponse, ErrorResponse>(["getMyClubs"], UserApi.getMyClubs, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getMyClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    myClubRefetch();
    setRefreshing(false);
  };

  const goToImageSelection = (clubData: Club) => {
    const imageSelectionProps = {
      clubId: clubData.id,
    };
    return navigate("FeedStack", {
      screen: "ImageSelection",
      params: imageSelectionProps,
    });
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

  const listHeaderComponent = useCallback(
    () => (
      <Header>
        <Title>게시물을 업로드할 모임을 선택하세요.</Title>
      </Header>
    ),
    []
  );
  const itemSeparatorComponent = useCallback(() => <Break />, []);
  const renderItem = useCallback(
    ({ item, index }: { item: MyClub; index: number }) => (
      <Item key={index} onPress={() => goToImageSelection(item)}>
        <CircleIcon size={36} uri={item.thumbnail} />
        <ItemInfo>
          <ClubNameView>
            <ItemTitle>{item.name}</ItemTitle>
          </ClubNameView>
          <CategoryView>
            {item.categories?.map((category, index) => (
              <Tag
                key={`Category_${index}`}
                backgroundColor="#B4B4B4"
                textColor="white"
                borderColor="rgba(0,0,0,0)"
                name={category.name}
                contentContainerStyle={{ paddingTop: 1, paddingBottom: 1, paddingRight: 3, paddingLeft: 3 }}
                textStyle={{ fontSize: 10, lineHeight: 13 }}
              />
            ))}
          </CategoryView>
        </ItemInfo>
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
      contentContainerStyle={{ flexGrow: 1 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      keyExtractor={(item: MyClub, index: number) => String(index)}
      data={myClubs?.data.filter((item) => item.applyStatus === "APPROVED")}
      ItemSeparatorComponent={itemSeparatorComponent}
      ListFooterComponent={myClubs?.data?.length ? itemSeparatorComponent : null}
      ListHeaderComponent={listHeaderComponent}
      ListEmptyComponent={listEmptyComponent}
      stickyHeaderIndices={[0]}
      renderItem={renderItem}
    />
  );
};

export default ClubSelection;

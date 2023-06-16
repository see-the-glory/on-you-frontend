import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StatusBar, TextInput, TouchableOpacity, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components/native";
import { Club, ClubsParams, ClubsResponse, ErrorResponse } from "../../../api";
import { RootStackParamList } from "../../../navigation/Root";
import ClubList from "../../organisms/ClubList";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View``;

const SearchSection = styled.View`
  height: 40px;
  padding: 0px 10px;
`;

const InfoSection = styled.View`
  padding: 10px;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 1px;
`;

const SearchWrapper = styled.View`
  flex-direction: row;
  background-color: #f8f8f8;
  border-radius: 10px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
`;

const SearchInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  width: 95%;
  height: 100%;
`;

const Content = styled.View`
  flex: 1;
`;

const ListHeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
`;

const SearchText = styled(ListHeaderText)`
  color: ${(props: any) => props.theme.primaryColor};
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

const Search: React.FC<NativeStackScreenProps<RootStackParamList, "Search">> = ({ route, navigation: { setOptions, goBack, push } }) => {
  const toast = useToast();
  const searchInputRef = useRef<TextInput>(null);
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>(undefined);
  const [params, setParams] = useState<ClubsParams>({
    keyword: undefined,
  });

  const {
    isLoading: clubsLoading,
    data: clubs,
    isRefetching: isRefetchingClubs,
    hasNextPage,
    refetch: clubsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<ClubsResponse, ErrorResponse>(["searchClubs", params], ClubApi.getClubs, {
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return lastPage.hasData === true ? lastPage.responses?.content[lastPage.responses?.content.length - 1].customCursor : null;
      }
    },
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (error) => {
      console.log(`API ERROR | getClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    enabled: params.keyword ? true : false,
  });

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const goToClub = (clubId: number) => {
    push("ClubStack", { screen: "ClubTopTabs", params: { clubId } });
  };

  const onSearch = () => {
    if (searchKeyword?.trim() === undefined || "") return toast.show(`검색어를 입력하세요.`, { type: "warning" });
    if (searchKeyword?.trim().length < 2) return toast.show(`2자 이상만 입력할 수 있습니다.`, { type: "warning" });
    const newParams = { keyword: searchKeyword?.trim() };
    setParams(newParams);
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
    setTimeout(() => {
      searchInputRef?.current.focus();
    }, 600);
  }, []);

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Header>
        <SearchSection>
          <SearchWrapper>
            <SearchInput
              ref={searchInputRef}
              placeholder="모임 이름을 검색하세요. (2자 이상, 공백불가)"
              placeholderTextColor="#C4C4C4"
              value={searchKeyword}
              maxLength={8}
              onChangeText={(value: string) => setSearchKeyword(value.trim())}
              onSubmitEditing={onSearch}
              includeFontPadding={false}
              clearButtonMode={"always"}
            />
            <Iconify icon="ion:search" size={18} color={"#8E8E8E"} onPress={onSearch} />
          </SearchWrapper>
        </SearchSection>

        {params?.keyword ? (
          <InfoSection>
            <ListHeaderText>
              {`'`}
              <SearchText>{`${params.keyword}`}</SearchText>
              {`' 에 대한 검색결과`}
            </ListHeaderText>
          </InfoSection>
        ) : null}
      </Header>
      <Content>
        {params.keyword ? (
          clubsLoading ? (
            <Loader>
              <ActivityIndicator />
            </Loader>
          ) : (
            <FlatList
              // refreshing={refreshing}
              // onRefresh={onRefresh}
              onEndReached={loadMore}
              onEndReachedThreshold={0.7}
              data={clubs?.pages?.flatMap((page: ClubsResponse) => page.responses.content) ?? []}
              contentContainerStyle={{ flexGrow: 1 }}
              ListFooterComponent={() => <View />}
              ListFooterComponentStyle={{ marginBottom: 60 }}
              keyExtractor={(item: Club, index: number) => String(index)}
              renderItem={({ item, index }: { item: Club; index: number }) => <ClubList clubData={item} onPress={() => goToClub(item.id)} />}
              ListEmptyComponent={() => (
                <EmptyView>
                  <EmptyText>{`조건에 해당하는 모임이 없습니다.`}</EmptyText>
                </EmptyView>
              )}
            />
          )
        ) : null}
      </Content>
    </Container>
  );
};

export default Search;

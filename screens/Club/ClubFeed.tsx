import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated, TouchableOpacity, DeviceEventEmitter } from "react-native";
import FastImage from "react-native-fast-image";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Feed, FeedApi, FeedsResponse } from "../../api";
import CustomText from "../../components/CustomText";
import clubSlice from "../../redux/slices/club";
import { useAppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store/reducers";
import { ClubFeedParamList, ClubFeedScreenProps } from "../../Types/Club";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FeedImage = styled(FastImage)<{ size: number }>`
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
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

const ClubFeed: React.FC<ClubFeedScreenProps & ClubFeedParamList> = ({
  navigation: { navigate },
  route: {
    params: { clubData },
  },
  scrollY,
  offsetY,
  headerDiff,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const feeds = useSelector((state: RootState) => state.club.feeds);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const numColumn = 3;
  const feedSize = Math.round(SCREEN_WIDTH / 3) - 1;
  const {
    isLoading: feedsLoading,
    data: queryFeedData,
    isRefetching: isRefetchingFeeds,
    hasNextPage,
    refetch: feedsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedsResponse>(["getClubFeeds", { token, clubId: clubData.id }], FeedApi.getClubFeeds, {
    getNextPageParam: (currentPage) => {
      if (currentPage) {
        return currentPage.hasNext === false ? null : currentPage.responses?.content[currentPage.responses?.content.length - 1].customCursor;
      }
    },
    onSuccess: (res) => {
      dispatch(clubSlice.actions.addFeed(res.pages[res.pages.length - 1].responses.content));
    },
    onError: (err) => {},
  });

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await feedsRefetch();
    dispatch(clubSlice.actions.refreshFeed(result?.data?.pages?.map((page) => page?.responses?.content).flat() ?? []));
    setRefreshing(false);
  };

  useEffect(() => {
    console.log("ClubFeed - add listner");
    let clubFeedRefetchSub = DeviceEventEmitter.addListener("ClubFeedRefetch", () => {
      console.log("ClubFeed - Club Feed Refetch Event");
      onRefresh();
    });
    let ClubFeedLoadmoreSub = DeviceEventEmitter.addListener("ClubFeedLoadmore", () => {
      console.log("ClubFeed - Load more!");
      loadMore();
    });

    return () => {
      console.log("ClubFeed - remove listner");
      clubFeedRefetchSub.remove();
      ClubFeedLoadmoreSub.remove();
      queryClient.removeQueries({ queryKey: ["getClubFeeds"] });
    };
  }, []);

  const goToClubFeedDetail = (index: number) => {
    return navigate("ClubStack", { screen: "ClubFeedDetail", clubData, targetIndex: index });
  };

  return feedsLoading || refreshing ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Animated.FlatList
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      contentOffset={{ x: 0, y: offsetY ?? 0 }}
      style={{
        flex: 1,
        paddingTop: headerDiff,
        backgroundColor: "white",
        transform: [
          {
            translateY: scrollY.interpolate({
              inputRange: [0, headerDiff],
              outputRange: [-headerDiff, 0],
              extrapolate: "clamp",
            }),
          },
        ],
      }}
      onEndReached={loadMore}
      contentContainerStyle={{
        backgroundColor: "white",
        flexGrow: 1,
      }}
      data={feeds}
      keyExtractor={(item: Feed, index: number) => String(index)}
      numColumns={numColumn}
      columnWrapperStyle={{ paddingBottom: 1 }}
      ListEmptyComponent={() => (
        <EmptyView>
          <EmptyText>{`작성된 게시글이 없습니다.`}</EmptyText>
        </EmptyView>
      )}
      renderItem={({ item, index }: { item: Feed; index: number }) => (
        <TouchableOpacity key={String(index)} onPress={() => goToClubFeedDetail(index)} style={index % 3 === 1 ? { marginHorizontal: 1 } : {}}>
          <FeedImage size={feedSize} source={item?.imageUrls[0] ? { uri: item.imageUrls[0] } : require("../../assets/basic.jpg")} />
        </TouchableOpacity>
      )}
    />
  );
};

export default ClubFeed;

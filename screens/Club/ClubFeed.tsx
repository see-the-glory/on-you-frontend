import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated, TouchableOpacity, DeviceEventEmitter } from "react-native";
import FastImage from "react-native-fast-image";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { ErrorResponse, Feed, FeedApi, FeedsResponse } from "../../api";
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
  justify-content: flex-start;
  align-items: center;
  padding-top: 200px;
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

const ClubFeed: React.FC<ClubFeedScreenProps & ClubFeedParamList> = ({
  navigation: { navigate },
  route: {
    name: screenName,
    params: { clubData },
  },
  scrollY,
  offsetY,
  headerDiff,
  syncScrollOffset,
  screenScrollRefs,
}) => {
  const feeds = useSelector((state: RootState) => state.club.feeds);
  const myRole = useSelector((state: RootState) => state.club.role);
  const toast = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const numColumn = 3;
  const feedSize = Math.round(SCREEN_WIDTH / 3) - 1;
  const {
    isLoading: feedsLoading,
    data: queryFeedData,
    isRefetching: isRefetchingFeeds,
    hasNextPage,
    refetch: feedsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedsResponse, ErrorResponse>(["getClubFeeds", clubData.id], FeedApi.getClubFeeds, {
    getNextPageParam: (currentPage) => {
      if (currentPage) {
        return currentPage.hasData === true ? currentPage.responses?.content[currentPage.responses?.content.length - 1].customCursor : null;
      }
    },
    onSuccess: (res) => {
      if (res.pages[res.pages.length - 1].responses) dispatch(clubSlice.actions.addFeed(res.pages[res.pages.length - 1].responses.content));
    },
    onError: (error) => {
      console.log(`API ERROR | getClubFeeds ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
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
    const clubFeedDetailProps = {
      clubData,
      targetIndex: index,
    };
    return navigate("ClubFeedDetail", clubFeedDetailProps);
  };

  return feedsLoading || refreshing ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Animated.FlatList
      ref={(ref) => {
        screenScrollRefs.current[screenName] = ref;
      }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      contentOffset={{ x: 0, y: offsetY ?? 0 }}
      onMomentumScrollEnd={(event) => {
        dispatch(clubSlice.actions.updateClubHomeScrollY({ scrollY: event.nativeEvent.contentOffset.y }));
        syncScrollOffset(screenName);
      }}
      onScrollEndDrag={() => syncScrollOffset(screenName)}
      style={{
        flex: 1,
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
      contentContainerStyle={{
        paddingTop: headerDiff,
        backgroundColor: "white",
        minHeight: SCREEN_HEIGHT + headerDiff,
        flexGrow: 1,
      }}
      onEndReached={loadMore}
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
          <FeedImage size={feedSize} source={item?.imageUrls && item?.imageUrls[0] ? { uri: item.imageUrls[0] } : require("../../assets/basic.jpg")} />
        </TouchableOpacity>
      )}
    />
  );
};

export default ClubFeed;

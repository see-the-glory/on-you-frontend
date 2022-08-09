import React from "react";
import { ActivityIndicator, FlatList, useWindowDimensions, Animated } from "react-native";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Feed, FeedApi, FeedsResponse } from "../../api";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FeedBox = styled.TouchableOpacity`
  flex: 1;
`;

const FeedImage = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const ClubFeed = ({ navigation: { navigate }, scrollY, headerDiff }) => {
  const token = useSelector((state: any) => state.AuthReducers.authToken);
  const { isLoading: feedsLoading, data: feeds } = useQuery<FeedsResponse>(["getFeeds", token], FeedApi.getFeeds);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const numColumn = 3;
  const feedSize = Math.round(SCREEN_WIDTH / 3) - 1;

  return feedsLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Animated.FlatList
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
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
      }}
      data={feeds?.data}
      numColumns={numColumn}
      columnWrapperStyle={{ paddingBottom: 1 }}
      keyExtractor={(item: Feed, index: number) => String(index)}
      renderItem={({ item, index }: { item: Feed; index: number }) => (
        <FeedBox>
          <FeedImage size={feedSize} source={item.imageUrls[0] === undefined ? require("../../assets/basic.jpg") : { uri: item.imageUrls[0] }} />
        </FeedBox>
      )}
    />
  );
};

export default ClubFeed;

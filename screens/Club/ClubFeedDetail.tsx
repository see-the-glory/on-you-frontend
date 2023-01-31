import React, { useCallback, useLayoutEffect } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { Feed } from "../../api";
import CustomText from "../../components/CustomText";
import FeedDetail from "../../components/FeedDetail";
import { ClubFeedDetailScreenProps } from "../../Types/Club";

const HeaderTitleView = styled.View`
  justify-content: center;
  align-items: center;
`;
const HeaderClubName = styled(CustomText)`
  font-size: 14px;
  font-family: "NotoSansKR-Medium";
  color: #8e8e8e;
  line-height: 20px;
`;
const HeaderText = styled(CustomText)`
  font-size: 16px;
  font-family: "NotoSansKR-Medium";
  color: #2b2b2b;
  line-height: 20px;
`;

const ClubFeedDetail: React.FC<ClubFeedDetailScreenProps> = ({
  navigation: { setOptions, navigate },
  route: {
    params: { clubData, feedData, targetIndex },
  },
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const feedDetailHeaderHeight = 50;
  const feedDetailInfoHeight = 30;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 30;
  const itemLength = SCREEN_WIDTH + feedDetailHeaderHeight + feedDetailInfoHeight + feedDetailContentHeight + itemSeparatorGap;

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HeaderTitleView>
          <HeaderClubName>{clubData.name}</HeaderClubName>
          <HeaderText>게시글</HeaderText>
        </HeaderTitleView>
      ),
    });
  }, []);

  const keyExtractor = useCallback((item: Feed, index: number) => String(index), []);
  const renderItem = useCallback(
    ({ item, index }: { item: Feed; index: number }) => (
      <FeedDetail feedData={item} feedSize={SCREEN_WIDTH} headerHeight={feedDetailHeaderHeight} infoHeight={feedDetailInfoHeight} contentHeight={feedDetailContentHeight} />
    ),
    []
  );
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: itemSeparatorGap }} />, []);
  const ListFooterComponent = useCallback(() => <View style={{ height: 100 }} />, []);
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: itemLength,
      offset: itemLength * index,
      index,
    }),
    []
  );
  return (
    <FlatList
      // refreshing={refreshing}
      // onRefresh={onRefresh}
      // onEndReached={loadMore}
      data={feedData}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListFooterComponent={ListFooterComponent}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialScrollIndex={targetIndex}
      removeClippedSubviews={true}
    />
  );
};

export default ClubFeedDetail;

import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useLayoutEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { LikeUser } from "../../../api";
import { FeedStackParamList } from "../../../navigation/FeedStack";
import CircleIcon from "../../atoms/CircleIcon";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const NameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 14px;
  line-height: 16px;
  color: #2b2b2b;
`;

const FeedLikes: React.FC<NativeStackScreenProps<FeedStackParamList, "FeedLikes">> = ({
  navigation: { setOptions, navigate, goBack, push },
  route: {
    params: { likeUsers },
  },
}) => {
  const keyExtractor = useCallback((item: LikeUser, index: number) => String(index), []);
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: 10 }} />, []);
  const renderItem = useCallback(
    ({ item, index }: { item: LikeUser; index: number }) => (
      <Container activeOpacity={1} onPress={() => goToProfile(item.userId)}>
        <CircleIcon size={36} uri={item.thumbnail} kerning={8} onPress={() => goToProfile(item.userId)} />
        <NameText>{item.userName}</NameText>
      </Container>
    ),
    []
  );

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const goToProfile = (userId: number) => push("ProfileStack", { screen: "Profile", params: { userId } });

  return (
    <FlatList
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}
      data={likeUsers}
      ItemSeparatorComponent={ItemSeparatorComponent}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      removeClippedSubviews={true}
    />
  );
};

export default FeedLikes;

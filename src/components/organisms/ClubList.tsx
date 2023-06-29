import React, { useRef } from "react";
import styled from "styled-components/native";
import { Club } from "api";
import FastImage from "react-native-fast-image";
import Tag from "@components/atoms/Tag";
import { Animated } from "react-native";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const Content = styled.View``;

const ContentHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CategoryBundle = styled.View`
  flex-direction: row;
  margin-left: 10px;
`;

const Title = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 14px;
  color: #2b2b2b;
`;

const Description = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #6f6f6f;
`;

interface ClubListProps {
  clubData: Club;
  onPress: Function;
}

const ClubList: React.FC<ClubListProps> = ({ clubData, onPress }) => {
  const opacity = useRef(new Animated.Value(0));

  const onLoadImage = () => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 150,
      delay: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity: opacity.current, borderBottomColor: "#e9e9e9", borderBottomWidth: 1 }}>
      <Container onPress={() => onPress()}>
        <FastImage style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }} source={{ uri: clubData?.thumbnail ?? undefined }} onLoadEnd={onLoadImage} />
        <Content>
          <ContentHeader>
            <Title>{clubData?.name}</Title>
            <CategoryBundle>
              {clubData?.categories?.map((category, index) => (
                <Tag
                  key={`Category_${index}`}
                  name={category?.name ?? ""}
                  backgroundColor="#C4C4C4"
                  textColor="white"
                  borderColor="rgba(0,0,0,0)"
                  contentContainerStyle={{ paddingTop: 1, paddingBottom: 1, paddingRight: 3, paddingLeft: 3 }}
                  textStyle={{ fontSize: 9, lineHeight: 11 }}
                />
              ))}
            </CategoryBundle>
          </ContentHeader>
          <Description>{clubData?.clubShortDesc}</Description>
        </Content>
      </Container>
    </Animated.View>
  );
};

export default React.memo(ClubList);

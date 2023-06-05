import React, { useRef } from "react";
import { Animated, StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";
import styled from "styled-components/native";

const Container = styled.TouchableOpacity`
  background-color: #e3e3e3;
`;
interface FadeFastImageProps {
  uri?: string;
  touchableOpacityStyle?: StyleProp<ViewStyle>;
  onPress?: Function;
  onLongPress?: Function;
  activeOpacity?: number;
}

const FadeFastImage: React.FC<FadeFastImageProps & FastImageProps> = ({ uri, touchableOpacityStyle, onPress, onLongPress, activeOpacity, ...props }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const onLoadImage = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      delay: 5,
      useNativeDriver: true,
    }).start();
  };

  return onPress ? (
    <Container activeOpacity={activeOpacity} onPress={() => onPress()} onLongPress={onLongPress ? () => onLongPress() : undefined} style={touchableOpacityStyle}>
      <Animated.View style={{ opacity }}>
        <FastImage source={{ uri }} onLoad={onLoadImage} {...props} />
      </Animated.View>
    </Container>
  ) : (
    <Animated.View style={{ opacity }}>
      <FastImage source={{ uri }} onLoad={onLoadImage} {...props} />
    </Animated.View>
  );
};

export default React.memo(FadeFastImage);

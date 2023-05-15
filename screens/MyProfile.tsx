import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { View, Text, Button, Animated, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";

const MyProfile = ({ navigation }) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [headerHeight] = useState(new Animated.Value(56)); // 헤더 높이 초기화

  const toggleHeader = () => {
    // 헤더 높이를 토글하는 애니메이션 설정
    Animated.timing(headerHeight, {
      toValue: headerHeight._value === 0 ? 56 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScrollView>
      <View style={{ height: SCREEN_HEIGHT * 1.5, justifyContent: "center", alignItems: "center" }}>
        <Text>TEST</Text>
      </View>
    </ScrollView>
  );
};

export default MyProfile;

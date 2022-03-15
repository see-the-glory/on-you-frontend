import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import styled from 'styled-components/native';


const NativeStack = createNativeStackNavigator();

function Login() {

  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();

    setResult(JSON.stringify(token));
  };

  const signOutWithKakao = async (): Promise<void> => {
    const message = await logout();

    setResult(message);
  };

  const getKakaoProfile = async (): Promise<void> => {
    const profile: KakaoProfile = await getProfile();

    setResult(JSON.stringify(profile));
  };

  const unlinkKakao = async (): Promise<void> => {
    const message = await unlink();

    setResult(message);
  };

  const onPress = () => signInWithKakao();

  return(

  <View style={styles.container}>
    <ImageBackground 
      style={styles.bgImage}
      source={require("../navigation/img/logo.png")}  //이미지경로
      resizeMode="center" // 'cover', 'contain', 'stretch', 'repeat', 'center' 중 선택 
      >
    </ImageBackground>
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
      >
      <Image
        style={styles.kakaoImage}
        source={require("../navigation/img/kakao_logo.png")}
        resizeMode="cover"
      />
      <Text style={styles.title}>카카오로 시작하기</Text>
    </TouchableOpacity>
  </View>
  )
  
};

const LoginStack = () => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name='Login' component={Login} />
  </NativeStack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  bgImage:{width: '100%', height: '50%'},
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    width: 200,
    height: 50,
    backgroundColor: "#FEE500",
  },
  kakaoImage:{width: 30, height: 30, marginRight:5},
  title:{
    color: '#191919',
    fontSize: 16,
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});

export default LoginStack;

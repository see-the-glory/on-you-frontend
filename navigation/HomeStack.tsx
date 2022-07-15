import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Profile from "../screens/Profile"
import CreateHomePeed from '../screens/HomeRelevant/CreateHomePeed'
import Accusation from '../screens/HomeRelevant/Accusation'
import ModifiyPeed from "../screens/HomeRelevant/ModifiyPeed";
import ImageSelecter from '../screens/HomeRelevant/ImageSelecter'
import ReportComplete from '../screens/HomeRelevant/ReportComplete'
import ReplyPage from '../screens/HomeRelevant/ReplyPage'
import {Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const NativeStack = createNativeStackNavigator();

const HomeStack = ({ navigation: { navigate } }) => {
    return (
        <NativeStack.Navigator
            screenOptions={{
                presentation: "card",
                contentStyle: { backgroundColor: "white" },
            }}
        >
            <NativeStack.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: "내 정보",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "Home" })}
                        >
                            <Ionicons name="chevron-back" size={20} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <NativeStack.Screen
                name="ImageSelecter"
                component={ImageSelecter}
                options={{
                    title: "이미지 선택!",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "Home" })}
                        >
                            <Ionicons name="chevron-back" size={20} color="black" />
                        </TouchableOpacity>
                    ),
                    headerShown:true
                }}
            />
            <NativeStack.Screen
                name="CreateHomePeed"
                component={CreateHomePeed}
                options={{
                    title: "새 게시물",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "ImageSelecter" })}
                        >
                            <Ionicons name="chevron-back" size={20} color="black" title="이미지선택"/>
                        </TouchableOpacity>
                    ),
                    headerShown:true
                }}
            />
            <NativeStack.Screen
                name="ReplyPage"
                component={ReplyPage}
                options={{
                    title: "새 게시물",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "Home" })}
                        >
                            <Ionicons name="chevron-back" size={20} color="black"/>
                        </TouchableOpacity>
                    ),
                    headerShown:true
                }}
            />
            <NativeStack.Screen
                name="ModifiyPeed"
                component={ModifiyPeed}
                options={{
                    title: "수정",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "Home" })}
                        >
                            <Ionicons name="chevron-back" size={20} color="black" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "Home" })}
                        >
                            <Text>완료</Text>
                        </TouchableOpacity>
                    ),
                }}
            />

            <NativeStack.Screen
                name="Accusation"
                component={Accusation}
                options={{
                    title: "신고",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "Home" })}
                        >
                            <Ionicons name="chevron-back" size={20} color="black" />
                        </TouchableOpacity>
                    ),
                    headerShown:true
                }}
            />

            <NativeStack.Screen
                name="ReportComplete"
                component={ReportComplete}
                options={{
                    title: "신고완료",
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigate("Tabs", { screen: "Home" })}
                        >
                            <Text>완료</Text>
                        </TouchableOpacity>
                    ),
                    headerShown:true
                }}
            />
        </NativeStack.Navigator>
    );
}

export default HomeStack;

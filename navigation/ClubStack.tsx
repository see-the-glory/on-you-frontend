import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ClubTopTabs from "../screens/Club/ClubTopTabs";

const NativeStack = createNativeStackNavigator();

const ClubStack = ({
  route: {
    params: { clubData },
  },
  navigation,
}) => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="ClubTopTabs"
        component={ClubTopTabs}
        initialParams={{ clubData }}
        options={{
          headerShown: false,
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ClubStack;

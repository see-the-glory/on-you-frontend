import React from "react";
import { Text, StyleSheet, Platform, TextProps } from "react-native";

export default class CustomText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Text style={[styles.defaultStyle, this.props.style]}>{this.props.children}</Text>;
  }
}

const styles = StyleSheet.create({
  // ... add your default style here
  defaultStyle: {
    fontFamily: "NotoSansKR-Regular",
    lineHeight: 19,
    fontSize: 12,
  },
});

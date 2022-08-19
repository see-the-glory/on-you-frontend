import React from "react";
import { StyleSheet, TextInput } from "react-native";

export default class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextInput style={[styles.defaultStyle, this.props.style]} {...this.props} allowFontScaling={false}>
        {this.props.children}
      </TextInput>
    );
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

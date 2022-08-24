// import React from "react";
// import { Text, StyleSheet, Platform, TextProps } from "react-native";
import styled from "styled-components/native";

const CustomText = styled.Text`
  font-family: "NotoSansKR-Regular";
  line-height: 19px;
  font-size: 12px;
`;

export default CustomText;

// export default class CustomText extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <Text style={[styles.defaultStyle, this.props.style]} {...this.props} allowFontScaling={false}>
//         {this.props.children}
//       </Text>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   // ... add your default style here
//   defaultStyle: {
//     fontFamily: "NotoSansKR-Regular",
//     lineHeight: 19,
//     fontSize: 12,
//   },
// });

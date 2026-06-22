import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import styles from "./styles";

// Applies the row style (flexDirection: "row") to a View.
// Keeps the JSX in App clean when building the nested layout.
export default function Row({ children }) {
  return <View style={styles.row}>{children}</View>;
}

Row.propTypes = {
  children: PropTypes.node.isRequired,
};

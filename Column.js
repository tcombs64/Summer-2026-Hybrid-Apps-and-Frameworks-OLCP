import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import styles from "./styles";

// Applies the column style (flexDirection: "column") to a View.
// Same idea as Row, just a different style — enables simpler JSX markup.
export default function Column({ children }) {
  return <View style={styles.column}>{children}</View>;
}

Column.propTypes = {
  children: PropTypes.node.isRequired,
};

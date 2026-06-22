import React from "react";
import { SafeAreaView, StatusBar, Platform, View } from "react-native";
import Row from "./Row";
import Column from "./Column";
import Box from "./Box";
import styles from "./styles";

// Recreates Figure 17.11 – Flexible rows and columns
//
// The layout is built by nesting Column Flexboxes inside Row Flexboxes.
// Each "row" begins again below the previous one (flexWrap), and within a
// column the boxes stack vertically. This is the same nested approach the
// chapter demonstrates with the Row and Column helper components.
export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* First row: two columns side by side */}
        <Row>
          <Column>
            <Box>#1</Box>
            <Box>#3</Box>
          </Column>
          <Column>
            <Box>#2</Box>
            <Box>#4</Box>
          </Column>
        </Row>

        {/* Second row: two more columns */}
        <Row>
          <Column>
            <Box>#5</Box>
            <Box>#7</Box>
          </Column>
          <Column>
            <Box>#6</Box>
            <Box>#8</Box>
          </Column>
        </Row>

        {/* Third row: the wider boxes from the figure (#10 and #12) */}
        <Row>
          <Column>
            <Box>#9</Box>
            <Box>#10</Box>
          </Column>
          <Column>
            <Box>#11</Box>
            <Box>#12</Box>
          </Column>
        </Row>
      </View>
    </SafeAreaView>
  );
}

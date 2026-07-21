import React, { useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";

// A list row that can be swiped to the left (Chapter 24, "Swipeable and
// cancellable"). It's a horizontal ScrollView with paging enabled: page 1 is
// the visible row, page 2 is blank. When the user swipes the row a full page
// to the left, onSwipe() fires and the row springs back to the start.
//
// New for this module (Chapter 25, layout animations): when the fetched data
// arrives and the rows mount, each row slides in from the left with a spring,
// staggered by its position in the list (`index`).
export default function SwipeableRow({ label, onSwipe, index = 0 }) {
  const scrollViewRef = useRef(null);
  const firedRef = useRef(false);

  // Width of one "page" of the swipeable row. The list has 16px of padding
  // on each side, so the row fills the rest of the screen width.
  const rowWidth = useWindowDimensions().width - 32;

  function onScroll(e) {
    const offsetX = e.nativeEvent.contentOffset.x;

    if (offsetX >= rowWidth && !firedRef.current) {
      // Swiped a full page: fire once, then snap the row back into place.
      firedRef.current = true;
      onSwipe();
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else if (offsetX === 0) {
      // Back at the start — allow the next swipe to fire again.
      firedRef.current = false;
    }
  }

  return (
    // Chapter 25 entering animation: slide in from the left with a spring,
    // delayed by 80ms per row so the list cascades in.
    <Animated.View
      entering={SlideInLeft.delay(index * 80).springify().damping(18)}
      style={[styles.swipeContainer, { width: rowWidth }]}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={10}
        onScroll={onScroll}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <View style={[styles.row, { width: rowWidth }]}>
            <Text style={styles.rowText}>{label}</Text>
            <Text style={styles.rowHint}>‹ swipe</Text>
          </View>
        </TouchableOpacity>
        {/* Blank second page — swiping onto it is what triggers the action. */}
        <View style={{ width: rowWidth }} />
      </ScrollView>
    </Animated.View>
  );
}

const YELLOW = "#FFE81F";

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowText: {
    color: YELLOW,
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
  },
  rowHint: {
    color: "#666",
    fontSize: 12,
    marginLeft: 8,
  },
});

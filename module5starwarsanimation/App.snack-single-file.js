// Module 5 — Star Wars app: Animation (single-file Snack version)
//
// Everything from the multi-file app combined into one file so it can be
// pasted straight into https://snack.expo.dev
// (Snack will prompt to add the react-native-reanimated dependency.)
//
// - NEW (Chapter 25): when the fetched data arrives, each list row slides in
//   from the left with a spring, staggered 80ms per row, using
//   react-native-reanimated's `entering={SlideInLeft}` layout animation.
// - Lists for Planets / Films / Spaceships are fetched from swapi.tech and
//   rendered inside a vertical ScrollView (Chapter 24).
// - Each item is swipeable (Chapter 24 "swipeable and cancellable" pattern):
//   a horizontal ScrollView with pagingEnabled. Swiping an item a full page
//   to the left opens a modal dialog (Chapter 23) showing the item's text.

import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { SlideInLeft } from "react-native-reanimated";

const YELLOW = "#FFE81F"; // Star Wars logo yellow

// ---- Swipeable list row (Chapter 24) + entering animation (Chapter 25) ----
function SwipeableRow({ label, onSwipe, index = 0 }) {
  const scrollViewRef = useRef(null);
  const firedRef = useRef(false);

  // Width of one "page" of the swipeable row (screen minus list padding).
  const rowWidth = useWindowDimensions().width - 32;

  function onScroll(e) {
    const offsetX = e.nativeEvent.contentOffset.x;

    if (offsetX >= rowWidth && !firedRef.current) {
      firedRef.current = true;
      onSwipe();
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else if (offsetX === 0) {
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
        {/* Blank second page — swiping onto it triggers the action. */}
        <View style={{ width: rowWidth }} />
      </ScrollView>
    </Animated.View>
  );
}

// ---- Modal dialog showing the swiped item's text (Chapter 23) ----
function ItemModal({ visible, text, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalInner}>
          <Text style={styles.modalLabel}>You swiped:</Text>
          <Text style={styles.modalText}>{text}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ---- Fetch + ScrollView list (Chapters 23/24) ----
function SwapiList({ url, parse }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiped, setSwiped] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        const json = await response.json();
        if (active) {
          setItems(parse(json));
        }
      } catch (e) {
        if (active) {
          setError("Could not load data. Check your connection and try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [url]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={YELLOW} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {items.map((item, index) => (
          <SwipeableRow
            key={item.id}
            label={item.label}
            index={index}
            onSwipe={() => setSwiped(item.label)}
          />
        ))}
      </ScrollView>

      <ItemModal
        visible={swiped !== null}
        text={swiped}
        onClose={() => setSwiped(null)}
      />
    </View>
  );
}

// ---- Screens ----
function PlanetsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/planets"
      parse={(json) =>
        json.results.map((planet) => ({ id: planet.uid, label: planet.name }))
      }
    />
  );
}

function FilmsScreen() {
  // NOTE: films use `result` (singular) and `properties.title`.
  return (
    <SwapiList
      url="https://www.swapi.tech/api/films"
      parse={(json) =>
        json.result.map((film) => ({
          id: film.uid,
          label: film.properties.title,
        }))
      }
    />
  );
}

function SpaceshipsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/starships"
      parse={(json) =>
        json.results.map((ship) => ({ id: ship.uid, label: ship.name }))
      }
    />
  );
}

const SCREENS = [
  { name: "Planets", component: PlanetsScreen },
  { name: "Films", component: FilmsScreen },
  { name: "Spaceships", component: SpaceshipsScreen },
];

// ---- App shell: iOS bottom tabs / Android drawer ----
export default function App() {
  const [active, setActive] = useState("Planets");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAndroid = Platform.OS === "android";

  const ActiveScreen =
    SCREENS.find((s) => s.name === active)?.component || PlanetsScreen;

  function go(name) {
    setActive(name);
    setDrawerOpen(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.header}>
        {isAndroid && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDrawerOpen((open) => !open)}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{active}</Text>
      </View>

      <View style={styles.content}>
        <ActiveScreen />
      </View>

      {!isAndroid && (
        <View style={styles.tabBar}>
          {SCREENS.map((screen) => {
            const focused = active === screen.name;
            return (
              <TouchableOpacity
                key={screen.name}
                style={styles.tab}
                onPress={() => go(screen.name)}
              >
                <Text style={[styles.tabText, focused && styles.tabTextActive]}>
                  {screen.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {isAndroid && drawerOpen && (
        <View style={styles.drawerOverlay}>
          <View style={styles.drawer}>
            <Text style={styles.drawerHeader}>Star Wars</Text>
            {SCREENS.map((screen) => {
              const focused = active === screen.name;
              return (
                <TouchableOpacity
                  key={screen.name}
                  style={styles.drawerItem}
                  onPress={() => go(screen.name)}
                >
                  <Text
                    style={[
                      styles.drawerItemText,
                      focused && styles.drawerItemTextActive,
                    ]}
                  >
                    {screen.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.drawerBackdrop}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#000",
    borderBottomWidth: 2,
    borderBottomColor: YELLOW,
  },
  menuButton: {
    marginRight: 16,
  },
  menuIcon: {
    color: YELLOW,
    fontSize: 26,
  },
  headerTitle: {
    color: YELLOW,
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderTopWidth: 2,
    borderTopColor: YELLOW,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  tabText: {
    color: "#888",
    fontSize: 14,
  },
  tabTextActive: {
    color: YELLOW,
    fontWeight: "bold",
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  drawer: {
    width: "70%",
    backgroundColor: "#111",
    paddingTop: 50,
    paddingHorizontal: 24,
    borderRightWidth: 2,
    borderRightColor: YELLOW,
  },
  drawerHeader: {
    color: YELLOW,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  drawerItem: {
    paddingVertical: 16,
  },
  drawerItemText: {
    color: "#ccc",
    fontSize: 18,
  },
  drawerItemTextActive: {
    color: YELLOW,
    fontWeight: "bold",
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  // ---- List (ScrollView) ----
  listContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    alignItems: "center",
  },

  // ---- Swipeable row ----
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

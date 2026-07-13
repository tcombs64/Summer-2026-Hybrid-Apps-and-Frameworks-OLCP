// Star Wars app: Lazy-loaded header images (single-file Snack version)
//
// Everything from the multi-file app combined into one file so it can be
// pasted straight into https://snack.expo.dev
// (Snack will prompt to add the react-native-reanimated dependency.)
//
// - NEW (Chapter 26): each screen has a theme-appropriate header image at
//   the top, lazy-loaded with the book's LazyImage pattern — a placeholder
//   (inlined below as a data URI, since Snack gets no assets folder) shows
//   until the remote image's onLoad fires.
// - Chapter 25: list rows slide in from the left, staggered, on data load.
// - Chapter 24: lists render in a vertical ScrollView; each row is swipeable.
// - Chapter 23: swiping a row opens a modal with the item's text.

import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  View,
  Text,
  Image,
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

// Placeholder shown while a header image downloads (a black frame with
// yellow border and "loading image..." text), inlined as a data URI.
const PLACEHOLDER = { uri: "data:image/png;base64,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" };

// ---- Lazy-loaded image (Chapter 26) ----
// The placeholder renders until the real image's onLoad fires.
function LazyImage({ style, resizeMode, source }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={style}>
      <Image
        style={style}
        resizeMode={resizeMode}
        source={source}
        onLoad={() => {
          setLoaded(true);
        }}
      />
      {!loaded && (
        <Image style={[style, { position: "absolute" }]} source={PLACEHOLDER} />
      )}
    </View>
  );
}

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

// ---- Fetch + ScrollView list (Chapters 23/24) + lazy header (Ch 26) ----
function SwapiList({ url, parse, image }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiped, setSwiped] = useState(null);
  const imageWidth = useWindowDimensions().width;

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

  // The part below the header image: spinner, error, or the list.
  let body;
  if (loading) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={YELLOW} />
      </View>
    );
  } else if (error) {
    body = (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  } else {
    body = (
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
    );
  }

  return (
    <View style={styles.listContainer}>
      {/* Themed header image, lazy-loaded (Chapter 26). */}
      <LazyImage
        style={{ width: imageWidth, height: 160 }}
        resizeMode="cover"
        source={{ uri: image }}
      />

      {body}

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
      image="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/960px-The_Earth_seen_from_Apollo_17.jpg"
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
      image="https://upload.wikimedia.org/wikipedia/commons/0/04/Le_Voyage_dans_la_lune.jpg"
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
      image="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Space_Shuttle_Columbia_launching.jpg/960px-Space_Shuttle_Columbia_launching.jpg"
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

// ============================================================
// SNACK-READY SINGLE FILE VERSION
// Paste this whole thing into App.js in Expo Snack to test quickly.
// For GitHub, use the multi-file version (App.js + screens/ + components/).
//
// Module 04 Assignment 2 - Star Wars Search
// - Search box at the top of each screen (Chapter 22)
// - Submitting the search shows the term in a modal dialog (Chapter 23)
// ============================================================

import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

// ---- Modal that displays the submitted search term (Chapter 23) ----
function SearchModal({ visible, term, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalInner}>
          <Text style={styles.modalLabel}>You searched for:</Text>
          <Text style={styles.modalTerm}>{term ? term : "(nothing)"}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ---- Reusable screen: search box on top (Chapter 22) + modal ----
function SearchScreen({ title }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  function onSubmit() {
    setSubmitted(text);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={text}
          onChangeText={setText}
          onSubmitEditing={onSubmit}
          placeholder={`Search ${title}`}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSubmit}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <SearchModal
        visible={modalVisible}
        term={submitted}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

// ---- Screens ----
function PlanetsScreen() {
  return <SearchScreen title="Planets" />;
}
function FilmsScreen() {
  return <SearchScreen title="Films" />;
}
function SpaceshipsScreen() {
  return <SearchScreen title="Spaceships" />;
}

// ---- Navigators ----
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  // iOS -> bottom tabs, Android -> drawer
  return (
    <NavigationContainer>
      {Platform.OS === "ios" ? <TabNavigator /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "ghostwhite",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#FFE81F",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c9b400",
  },
  searchButtonText: {
    fontWeight: "700",
    color: "#222",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalInner: {
    width: "80%",
    backgroundColor: "azure",
    padding: 24,
    borderWidth: 1,
    borderColor: "lightsteelblue",
    borderRadius: 8,
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 16,
    color: "slategrey",
    marginBottom: 6,
  },
  modalTerm: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: "royalblue",
    borderRadius: 6,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import SearchModal from "./SearchModal";
import styles from "../styles";

// A reusable screen that shows a search box at the top (Chapter 22) and,
// when the user submits a term, displays it in a modal dialog (Chapter 23).
// Every Star Wars screen (Planets, Films, Spaceships) uses this.
export default function SearchScreen({ title }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  function onSubmit() {
    setSubmitted(text);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      {/* Search box on top of the screen */}
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

      {/* Screen name */}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Modal that displays the submitted search term */}
      <SearchModal
        visible={modalVisible}
        term={submitted}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

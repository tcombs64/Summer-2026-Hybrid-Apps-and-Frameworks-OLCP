import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

// A modal dialog that shows the text of the list item the user swiped
// (Chapter 23, "Confirmation modals").
export default function ItemModal({ visible, text, onClose }) {
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

const YELLOW = "#FFE81F";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalInner: {
    width: "80%",
    backgroundColor: "#111",
    padding: 24,
    borderWidth: 2,
    borderColor: YELLOW,
    borderRadius: 8,
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 6,
  },
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    color: YELLOW,
    marginBottom: 16,
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: YELLOW,
    borderRadius: 6,
  },
  modalButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});

import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import styles from "../styles";

// A modal dialog that shows the text the user searched for.
// Based on the confirmation modal from Chapter 23.
export default function SearchModal({ visible, term, onClose }) {
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

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useConnected from "./useConnected";

// Banner shown at the top of the app whenever the device has no network
// connection (Module 6, "Going Offline"). Renders nothing while online.
export default function OfflineNotice() {
  const connected = useConnected();

  if (connected) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        No network connection — you are offline
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#B00020",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

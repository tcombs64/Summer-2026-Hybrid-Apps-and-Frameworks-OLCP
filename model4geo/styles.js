import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "ghostwhite",
  },
  mapView: {
    alignSelf: "stretch",
    flex: 1,
  },
  banner: {
    alignSelf: "stretch",
    padding: 12,
    paddingTop: 48,
    backgroundColor: "ghostwhite",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "royalblue",
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

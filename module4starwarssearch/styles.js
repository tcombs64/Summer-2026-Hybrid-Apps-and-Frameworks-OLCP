import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // ---- Search box (Chapter 22, "Collecting text input") ----
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

  // ---- Body of each screen ----
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // ---- Modal (Chapter 23, "Confirmation modals") ----
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

import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

// Hook that reports whether the device currently has a network connection
// (Module 6, "Going Offline"). NetInfo pushes a new state object every time
// connectivity changes, so components using this hook re-render immediately
// when the network drops or comes back.
export default function useConnected() {
  // Start optimistic (true) so the offline UI doesn't flash while NetInfo
  // figures out the real state on startup.
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    // The listener fires once right away with the current state, then again
    // on every change. isConnected can be null while unknown — only treat an
    // explicit `false` as offline.
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected !== false);
    });
    return unsubscribe;
  }, []);

  return connected;
}

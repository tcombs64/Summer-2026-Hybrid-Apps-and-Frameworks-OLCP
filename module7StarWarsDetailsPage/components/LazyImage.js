import React, { useState } from "react";
import { View, Image } from "react-native";

// Bundled placeholder shown while the real image downloads.
const placeholder = require("../assets/placeholder.png");

// Lazy-loaded image (Chapter 26, "Lazy image loading"). The placeholder
// image renders immediately; the real (remote) image is stacked in the same
// spot and only replaces the placeholder once its onLoad event fires, so the
// user never stares at an empty box while the download happens.
function Placeholder({ loaded, style }) {
  if (loaded) {
    return null;
  }
  return <Image style={[style, { position: "absolute" }]} source={placeholder} />;
}

export default function LazyImage({ style, resizeMode, source }) {
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
      <Placeholder loaded={loaded} style={style} />
    </View>
  );
}

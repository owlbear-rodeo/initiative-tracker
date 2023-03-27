import { useEffect, useState } from "react";

import OBR from "@owlbear-rodeo/sdk";
import { InitiativeHeader } from "./InitiativeHeader";
import { InitiativeTracker } from "./InitiativeTracker";

export function App() {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (sceneReady) {
    return <InitiativeTracker />;
  } else {
    // Show a basic header when the scene isn't ready
    return (
      <InitiativeHeader subtitle="Open a scene to use the initiative tracker" />
    );
  }
}

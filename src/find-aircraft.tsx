import Component from "./component";
import { parseAircraftDesignation } from "./aircraft";

// --- UI Component ---

export default function Command() {
  return <Component cb={parseAircraftDesignation} />;
}

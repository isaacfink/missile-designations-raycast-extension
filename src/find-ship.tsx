import Component from "./component";
import { parseShipDesignation } from "./ships";

// --- UI Component ---

export default function Command() {
  return <Component cb={parseShipDesignation} />;
}

import { parseMissileDesignation } from "./missiles";
import Component from "./component";

// --- UI Component ---

export default function Command() {
  return <Component cb={parseMissileDesignation} />;
}

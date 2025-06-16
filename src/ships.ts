import { ParseError } from "./error";

export interface Field {
  title: string;
  value: string;
}

export function parseShipDesignation(code: string): Field[] {
  const typeMap: Record<string, string> = {
    CVN: "Aircraft Carrier (Nuclear-powered)",
    CV: "Aircraft Carrier",
    DDG: "Destroyer (Guided Missile)",
    DD: "Destroyer",
    FFG: "Frigate (Guided Missile)",
    SSBN: "Ballistic Missile Submarine (Nuclear-powered)",
    SSN: "Attack Submarine (Nuclear-powered)",
    SS: "Submarine (Diesel)",
    LHD: "Amphibious Assault Ship",
    LHA: "Amphibious Assault Ship",
    LPD: "Amphibious Transport Dock",
    LSD: "Dock Landing Ship",
    CG: "Cruiser (Guided Missile)",
    TAO: "Fleet Oiler",
    TAKE: "Cargo and Ammunition Ship",
  };

  const cleaned = code.replace(/-/g, "").toUpperCase();

  // Sort typeMap keys longest first for proper prefix matching
  const sortedPrefixes = Object.keys(typeMap).sort((a, b) => b.length - a.length);

  let matchedPrefix: string | undefined;
  for (const prefix of sortedPrefixes) {
    if (cleaned.startsWith(prefix)) {
      matchedPrefix = prefix;
      break;
    }
  }

  if (!matchedPrefix) {
    throw new ParseError("Unknown ship classification code");
  }

  const typeDescription = typeMap[matchedPrefix];
  const hullNumber = cleaned.slice(matchedPrefix.length);

  if (!hullNumber.match(/^\d+$/)) {
    throw new ParseError("Invalid or missing hull number");
  }

  return [
    { title: "Type", value: typeDescription },
    { title: "Hull Number", value: hullNumber },
  ];
}

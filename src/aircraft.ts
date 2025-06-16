import { ParseError } from "./error";

export interface Field {
  title: string;
  value: string;
}

export function parseAircraftDesignation(code: string): Field[] {
  const statusPrefixMap: Record<string, string> = {
    X: "Experimental",
    Y: "Prototype",
    A: "Special test, temporary",
    J: "Special test, permanent",
  };

  const missionMap: Record<string, string> = {
    A: "Attack",
    B: "Bomber",
    C: "Cargo/Transport",
    E: "Electronic Warfare",
    F: "Fighter",
    H: "Search and Rescue (helicopter)",
    K: "Tanker",
    M: "Multi-mission",
    O: "Observation",
    P: "Patrol",
    Q: "Drone/Unmanned",
    R: "Reconnaissance",
    S: "Anti-submarine",
    T: "Trainer",
    U: "Utility",
    X: "Research",
    Z: "Lighter-than-air",
  };

  const vehicleTypeMap: Record<string, string> = {
    G: "Glider",
    H: "Helicopter",
    S: "Spaceplane",
    V: "VTOL/STOL",
  };

  const cleaned = code.replace(/[-\s]/g, "").toUpperCase();
  if (!cleaned) throw new ParseError("Empty input");

  let i = 0;

  let statusPrefix: string | undefined;
  if (statusPrefixMap[cleaned[i]]) {
    statusPrefix = cleaned[i];
    i++;
  }

  let modifiedMission: string | undefined;
  if (missionMap[cleaned[i]] && i + 1 < cleaned.length && missionMap[cleaned[i + 1]]) {
    modifiedMission = cleaned[i];
    i++;
  }

  const basicMissionCode = cleaned[i];
  if (!missionMap[basicMissionCode]) {
    throw new ParseError(`Invalid basic mission code: '${basicMissionCode}'`);
  }
  i++;

  let vehicleType: string | undefined;
  if (vehicleTypeMap[cleaned[i]]) {
    vehicleType = cleaned[i];
    i++;
  }

  const rest = cleaned.slice(i);
  const match = rest.match(/^(\d+)([A-Z]?)$/);
  if (!match) {
    throw new ParseError("Invalid design number or series format");
  }

  const [, designNumber, seriesLetter] = match;

  const fields: Field[] = [
    { title: "Status Prefix", value: statusPrefix ? statusPrefixMap[statusPrefix] : "N/A" },
    { title: "Modified Mission", value: modifiedMission ? missionMap[modifiedMission] : "N/A" },
    { title: "Basic Mission", value: missionMap[basicMissionCode] },
    { title: "Vehicle Type", value: vehicleType ? vehicleTypeMap[vehicleType] : "Standard Aircraft" },
    { title: "Design Number", value: designNumber },
    { title: "Series Letter", value: seriesLetter || "Base Version" },
  ];

  return fields;
}

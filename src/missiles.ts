import { ParseError } from "./error";

export interface Field {
  title: string;
  value: string;
}

export function parseMissileDesignation(code: string): Field[] {
  const launchMap: Record<string, string> = {
    A: "Air-launched",
    B: "Multiple launch environments",
    C: "Coffin/silo",
    G: "Ground-launched",
    L: "Silo-launched (submarine)",
    M: "Mobile-launched",
    R: "Ship-launched",
    S: "Space-launched",
  };

  const missionMap: Record<string, string> = {
    D: "Decoy",
    G: "Surface Attack",
    I: "Intercept",
    N: "Navigation",
    Q: "Drone",
    S: "Space support",
    U: "Underwater attack",
    W: "Weather",
  };

  const typeMap: Record<string, string> = {
    M: "Guided missile",
  };

  const cleaned = code.replace(/-/g, "").toUpperCase();
  if (cleaned.length < 4) {
    throw new ParseError("Input too short to be a valid designation");
  }

  const [launchCode, missionCode, typeCode, ...rest] = cleaned;

  if (!launchMap[launchCode]) {
    throw new ParseError(`Invalid launch platform code: '${launchCode}'`);
  }

  if (!missionMap[missionCode]) {
    throw new ParseError(`Invalid mission code: '${missionCode}'`);
  }

  if (!typeMap[typeCode]) {
    throw new ParseError(`Invalid type code: '${typeCode}'`);
  }

  const restStr = rest.join("");
  const match = restStr.match(/^(\d+)([A-Z]?)$/);
  if (!match) {
    throw new ParseError("Invalid design number or version format");
  }

  const [, designNumber, version] = match;

  return [
    { title: "Launch Platform", value: launchMap[launchCode] },
    { title: "Mission", value: missionMap[missionCode] },
    { title: "Type", value: typeMap[typeCode] },
    { title: "Design Number", value: designNumber },
    { title: "Version", value: version || "Base version" },
  ];
}

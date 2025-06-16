interface MissileBreakdown {
  launch: string;
  mission: string;
  type: string;
  designNumber: string;
  version: string;
}

export function parseMissileDesignation(code: string): MissileBreakdown | null {
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

  // normalize input
  const cleaned = code.replace(/-/g, "").toUpperCase();
  if (cleaned.length < 4) return null;

  const [launchCode, missionCode, typeCode, ...rest] = cleaned;
  const restStr = rest.join("");

  const match = restStr.match(/^(\d+)([A-Z]?)$/);
  if (!match) return null;

  const [, designNumber, version] = match;

  return {
    launch: launchMap[launchCode] || `Unknown (${launchCode})`,
    mission: missionMap[missionCode] || `Unknown (${missionCode})`,
    type: typeMap[typeCode] || `Unknown (${typeCode})`,
    designNumber,
    version: version || "Base version",
  };
}

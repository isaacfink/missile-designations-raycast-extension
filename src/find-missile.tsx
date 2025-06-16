import { Action, ActionPanel, Detail, Form, useNavigation } from "@raycast/api";
import { useState } from "react";
import { parseMissileDesignation } from "./designations";

export default function Command() {
  const { push } = useNavigation();
  const [designation, setDesignation] = useState("");

  return (
    <Form
      navigationTitle="Missile Designation Parser"
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Parse"
            onSubmit={() => {
              push(<Result designation={designation} />);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="designation" title="Designation" value={designation} onChange={setDesignation} />
    </Form>
  );
}

function Result({ designation }: { designation: string }) {
  const breakdown = parseMissileDesignation(designation);

  if (!breakdown) {
    return <Detail markdown={`❌ Unable to parse designation: ${designation}`} />;
  }

  return (
    <Detail
      markdown={`
**${designation.toUpperCase()}**

- **Launch Platform:** ${breakdown.launch}
- **Mission:** ${breakdown.mission}
- **Type:** ${breakdown.type}
- **Design Number:** ${breakdown.designNumber}
- **Version:** ${breakdown.version}
    `}
    />
  );
}

// Same parseMissileDesignation function here (copy from above)

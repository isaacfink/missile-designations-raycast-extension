import { useState } from "react";
import { ParseError } from "./error";
import { List, showToast, Toast } from "@raycast/api";

export default function Component({ cb }: { cb: (q: string) => { title: string; value: string }[] }) {
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<{ title: string; value: string }[] | null>(null);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (!text) {
      setResult(null);
      return;
    }
    try {
      const breakdown = cb(text);
      setResult(breakdown);
    } catch (err) {
      if (err instanceof ParseError) {
        await showToast(Toast.Style.Failure, "Parsing Error", err.message);
      } else {
        await showToast(Toast.Style.Failure, "Unknown Error");
      }
      setResult(null);
    }
  };

  return (
    <List
      searchText={searchText}
      onSearchTextChange={handleSearch}
      throttle
      isShowingDetail={false}
      navigationTitle="Aircraft Designation Parser"
    >
      {result ? (
        <>
          {result.map((item, index) => (
            <List.Item key={index} title={item.title} subtitle={item.value} />
          ))}
        </>
      ) : (
        <List.Item title="Awaiting input..." subtitle="Enter a designation above" />
      )}
    </List>
  );
}

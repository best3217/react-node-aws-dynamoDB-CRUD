import React from "react";

export function ConnectionState({ isConnected }) {
  return (
    <p className="text-2xl font-bold py-2">
      Socket Connected: {"" + isConnected}
    </p>
  );
}

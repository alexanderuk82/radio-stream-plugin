import { useCallback } from "react";

type PluginMessage = {
  type: string;
  key?: string;
  value?: unknown;
  [k: string]: unknown;
};

function postToPlugin(msg: PluginMessage) {
  parent.postMessage({ pluginMessage: msg }, "*");
}

export function useStorage() {
  const save = useCallback((key: string, value: unknown) => {
    postToPlugin({ type: "storage-set", key, value });
  }, []);

  return { save, postToPlugin };
}

export function sendResize(width: number, height: number) {
  parent.postMessage(
    { pluginMessage: { type: "resize", width, height } },
    "*"
  );
}

import { useLocalStorage } from "@mantine/hooks";
import { v4 } from "uuid";

export function useDeviceId() {
  const [deviceId] = useLocalStorage({
    key: "deviceId",
    defaultValue: v4(),
  });

  return { deviceId };
}

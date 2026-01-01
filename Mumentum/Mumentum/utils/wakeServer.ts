import axios from "axios";

let hasWoken = false;

export const wakeBackend = async () => {
  if (hasWoken) return;

  hasWoken = true;

  try {
    await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_OTP}/`,
      { timeout: 20000 }
    );
  } catch {
    // ignore error — server waking is enough
  }
};
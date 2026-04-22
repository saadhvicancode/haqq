"use client";

import { useCallback } from "react";

export type GeoResult =
  | { available: true; lat: number; lng: number }
  | { available: false; reason: "denied" | "unavailable" | "timeout" | "unsupported" };

export function useGeolocation() {
  const getPosition = useCallback((): Promise<GeoResult> => {
    return new Promise((resolve) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        resolve({ available: false, reason: "unsupported" });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            available: true,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => {
          resolve({
            available: false,
            reason: err.code === 1 ? "denied" : err.code === 3 ? "timeout" : "unavailable",
          });
        },
        { timeout: 10000, maximumAge: 60_000, enableHighAccuracy: false }
      );
    });
  }, []);

  return { getPosition };
}

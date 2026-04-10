"use client";

import type { MouseEvent } from "react";

const APP_DOMAIN = "https://app.riffle.studio";

export function useAppLink() {
  function navigate(baseUrl: string) {
    const url = new URL(baseUrl);

    // Forward all current page params
    new URLSearchParams(window.location.search).forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // localStorage theme overrides anything
    const theme = localStorage.getItem("theme");
    if (theme) {
      url.searchParams.set("theme", theme);
    }

    window.location.href = url.toString();
  }

  function onClick(baseUrl: string) {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate(baseUrl);
    };
  }

  return { onClick };
}

export { APP_DOMAIN };

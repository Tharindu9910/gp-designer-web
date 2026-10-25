"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<{ current: Lenis | null }>({ current: null });

/** Returns a ref-like holder for the shared Lenis instance (null when disabled). */
export const useLenis = () => useContext(LenisContext);

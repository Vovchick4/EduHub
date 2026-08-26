// src/store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type{ TypedUseSelectorHook,} from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Використовуємо типізований dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Використовуємо типізований selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
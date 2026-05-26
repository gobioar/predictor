import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMonth(anio: number, mes: number) {
  return new Intl.DateTimeFormat("es-AR", {
    month: "short",
    year: "numeric",
  }).format(new Date(anio, mes - 1, 1));
}

export function nextMonth(anio: number, mes: number, offset = 1) {
  const date = new Date(anio, mes - 1 + offset, 1);
  return { anio: date.getFullYear(), mes: date.getMonth() + 1 };
}

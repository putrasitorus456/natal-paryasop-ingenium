import { closesAt } from "../config";

export function getCloseTime(): Date {
  return new Date(closesAt);
}

export function isFormOpen(now = new Date()): boolean {
  return now.getTime() < getCloseTime().getTime();
}

export function msUntilClose(now = new Date()): number {
  return getCloseTime().getTime() - now.getTime();
}

import { randomUUID } from "crypto";

let currentQR = {
  uuid: randomUUID(),
  generatedAt: Date.now(),
};

setInterval(() => {
  currentQR = {
    uuid: randomUUID(),
    generatedAt: Date.now(),
  };
}, 10_000);

export const getCurrentQR = () => currentQR;

import { getCurrentQR } from "../services/qrService.js";

export const getCurrentQRUuid = (_req, res) => {
  return res.status(200).json({
    message: "success",
    data: getCurrentQR(),
  });
};


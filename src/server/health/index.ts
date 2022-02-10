import { Request, Response } from "express";

export default function (_: Request, res: Response) {
  res.status(200).json({ message: "Everything's good!" });
}

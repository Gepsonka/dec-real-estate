import { realEstateCollection } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || id === "") {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (req.method === "GET") {
    try {
      const realEstate = await realEstateCollection.fetchOneById(id as string);
      if (!realEstate) {
        return res.status(404).json({ error: "Real Estate not found" });
      }

      return res.status(200).json(realEstate);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

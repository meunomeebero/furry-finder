import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../_prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch(req.method) {
    case 'GET':
      const { id } = req.query as { id: string };

      const me = await prismaClient.users.findFirst({
        where: {
          id: +id,
        }
      });

      return res.json(me);
    default:
      res.status(405).json({ error: 'Method not allowed' });
        break;
  }
}

export default handler

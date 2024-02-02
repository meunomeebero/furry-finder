import { Users, Users_role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../../services/api";
import { prismaClient } from "../../_prisma";

export const getFFUsers = async (token?: string) => {
  const myMatchs: number[] = [];
  if (token) {
    const me = await api.getMe(token) as Users;
    const ids = await prismaClient.matchs.findMany({
      select: {
        match: true,
      },
      where: {
        me: me.id,
      }
    }).then(res => res.map(r => r.match));

    myMatchs.push(...ids, me.id);
  }
  console.log('myMatchs', myMatchs)
  const ff = await prismaClient.users.findFirst({
    where: {
      AND: {
        role: Users_role.FURRY_FINDER_USER,
        NOT: {
          id: {
            in: myMatchs
          }
        }
      }
    },
  })

  return ff;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch(req.method) {
    case 'GET':
      const result = await getFFUsers(req.query.token as string)
      return res.json(result);
    case 'PATCH':
      const { token, gender, profileName } = req.body;
      const me = await api.getMe(token);
      if (me.role != Users_role.FURRY_FINDER_USER) {
        await prismaClient.users.update({
          where: {
            id: me.id,
          },
          data: {
            role: Users_role.FURRY_FINDER_USER,
            gender,
            profileName,
          }
        })
      }

      return res.json({ ok: true, })
    default:
      res.status(405).json({ error: 'Method not allowed' });
        break;
  }
}

export default handler

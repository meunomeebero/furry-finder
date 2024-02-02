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

  return prismaClient.users.findMany({
    where: {
      role: Users_role.FURRY_FINDER_USER,
      id: {
        notIn: myMatchs,
      }
    },
  })
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch(req.method) {
    case 'GET':
      return res.json(getFFUsers(req.body.token));
    case 'PATCH':
      const { token, gender } = req.body;
      const me = await api.getMe(token);
      if (me.role != Users_role.FURRY_FINDER_USER) {
        await prismaClient.users.update({
          where: {
            id: me.id,
          },
          data: {
            role: Users_role.FURRY_FINDER_USER,
            gender,
          }
        })
      }

      return res.json({ ok: true, })
  }
}

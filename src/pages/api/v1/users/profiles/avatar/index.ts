import { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../../../../services/api";
import { handleApiError } from "../../../../_error";
import { prismaClient } from "../../../../_prisma";
import { UploadToBucketService } from "../../../../_utils/upload-to-bucket";
import { writeFile } from "../../../../_utils/write-file";

const uploadToBucketService = new UploadToBucketService();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'PATCH':
        const token = req.headers.authorization?.replace('Bearer ', '');
        const me = await api.getMe(token);

        if (!me) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const path = await writeFile(req, `${me.id}.png`);
        const url = await uploadToBucketService.execute(path, `${me.id}-${Date.now()}.png`);

        await prismaClient.users.update({
          where: {
            id: me.id,
          },
          data: {
            image: url,
          }
        });

        return res.status(200).json({ avatar: url });
      default:
        res.status(405).json({ error: 'Method not allowed' });
        break;
    }
  } catch (err) {
    handleApiError(err, res);
  }
}

export default handler;

export const config = {
  api: {
    bodyParser: false,
  }
}

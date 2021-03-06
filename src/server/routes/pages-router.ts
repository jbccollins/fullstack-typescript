import { Router } from 'express';
import { getManifest } from '@server/routes/manifest-manager';

export function pagesRouter(): Router {
  const router = Router();

  router.get(`/**`, async (_, res) => {
    const manifest = await getManifest();
    res.render('page.ejs', { manifest });
  });

  return router;
}

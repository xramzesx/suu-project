import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { existsSync } from 'fs';
import { authenticateToken } from './middlewares/auth.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT || 4000;
const apiServerUrl = process.env.API_SERVER || 'http://localhost:3000';

const assetsDirPath = path.join(__dirname, 'assets');
const uploadsDirPath = path.join(assetsDirPath, 'uploads');

app.use(express.json());

const storage = multer.diskStorage({
  destination: uploadsDirPath,
  filename: function (req, file, cb) {
    const imageName = `${Date.now()}${file.originalname}`;
    cb(null, imageName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
});

app.post(
  '/assets/upload',
  authenticateToken,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload.single('file') as any,
  (req, res) => {
    const { file } = req;
    if (!file) {
      res.status(400).send('Invalid request');
      return;
    }

    res.status(201).json({
      url: `${apiServerUrl}/assets?file=uploads/${file.filename}`,
    });
  },
);

app.get('/assets', authenticateToken, (req: Request, res: Response) => {
  const filePath = req.query.file?.toString();
  if (!filePath) {
    res.status(400).send('Invalid request');
    return;
  }

  const assetPath = `${assetsDirPath}${filePath[0] === '/' ? '' : '/'}${filePath}`;
  if (!existsSync(assetPath)) {
    res.status(404).send('File not found');
    return;
  }

  res.status(201).sendFile(assetPath);
});

app.get('/', (req: Request, res: Response) => {
  res.send('gymU asset service');
});

app.listen(port, () => {
  console.log(`[asset service]: Server is running at http://localhost:${port}`);
});

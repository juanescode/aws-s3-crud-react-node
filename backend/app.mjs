import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import { deleteFromS3, getUserPresignedUrls, uploadToS3 } from "./s3.mjs";

const app = express();

const PORT = process.env.PORT || 4000;

const storage = memoryStorage();
const upload = multer({ storage });

app.use(
  cors({
    origin: "*",
  })
);
app.use(json());

app.post("/images", upload.single("image"), (req, res) => {
  const { file } = req;
  const userId = req.headers["x-user-id"];

  if (!file || !userId) return res.status(400).json({ message: "Bad request" });

  const { error, key } = uploadToS3({ file, userId });
  if (error) return res.status(500).json({ message: error.message });

  return res.status(201).json({ key });
});

app.get("/images", async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) return res.status(400).json({ message: "Bad request" });

  const { error, presignedUrls } = await getUserPresignedUrls(userId);
  if (error) return res.status(400).json({ message: error.message });

  return res.json(presignedUrls);
});
app.delete("/images/:key", async (req, res) => {
  let { key } = req.params;
  key = decodeURIComponent(key);
  
  console.log("Intentando eliminar con key:", key);

  if (!key) return res.status(400).json({ message: "Image key is required" });

  try {
    const { error } = await deleteFromS3(key);
    if (error) {
      console.error("Error de AWS al eliminar:", error);
      throw error;
    }
    
    console.log("Eliminación exitosa de S3 para key:", key);
    return res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error eliminando imagen:", error);
    return res.status(500).json({ message: "Error deleting image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connectMongoDB } from "./config/db";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/usersRoutes";
import postRouter from "./routes/postsRoutes";
import commentRouter from "./routes/commentsRoutes";

const PORT = process.env.PORT || 8000;

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectMongoDB();

app.get("/test", (req: Request, res: Response) => {
  res.json("Your express app with typescript!!");
});

app.get("/", (req: Request, res: Response) => {
  const message = `
    <h2>Welcome to maadhyam-server-app ${PORT}</h2>
    <br />
    <h2>Checkout the API documentation <a href="https://github.com/Dev-Bilaspure/Blogging-App-Express-Typescript-Server">here</a></h2>
  `;
  res.send(message);
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}... \nStart using: http://localhost:8000/`
  );
});

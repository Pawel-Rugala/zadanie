import Express, { Request, Response } from "express";
import { errorLogger, errorResponder } from "./ErrorController";
const app = Express();

app.get("/", (req: Request, res: Response) => {
  res.send("Allo Allo!");
});

app.get("/error", (req: Request, res: Response) => {
  throw new Error("Something went wrong!");
});

app.use(errorLogger);
app.use(errorResponder);

export default app;

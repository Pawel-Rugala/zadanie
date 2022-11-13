import Express, { Request, Response } from "express";
import { errorLogger, errorResponder } from "./ErrorController";
import { getMovies } from "./MovieController";
const app = Express();

app
  .route("/")
  .get(getMovies)
  .post((req, res) => {
    throw new Error("Not implemented");
  });

app.get("/test", (req: Request, res: Response) => {
  res.send("Allo Allo!");
});

app.get("/error", (req: Request, res: Response) => {
  throw new Error("Something went wrong!");
});

app.use(errorLogger);
app.use(errorResponder);

export default app;

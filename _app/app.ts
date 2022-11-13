import Express, { Request, Response, urlencoded } from "express";
import { errorLogger, errorResponder } from "./ErrorController";
import { getMovies, addMovie } from "./MovieController";
const app = Express();

app.use(urlencoded({ extended: true }));
app.use(Express.json());

app.route("/").get(getMovies).post(addMovie);

app.get("/test", (req: Request, res: Response) => {
  res.send("Allo Allo!");
});

app.get("/error", (req: Request, res: Response) => {
  throw new Error("Something went wrong!");
});

app.use(errorLogger);
app.use(errorResponder);

export default app;

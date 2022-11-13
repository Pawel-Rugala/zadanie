import dotenv from "dotenv";
import app from "./_app/app";
dotenv.config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
  console.log(`http://localhost:${port}`);
});

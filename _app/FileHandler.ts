import path from "path";
import fs from "fs";

export const filePath = path.resolve(__dirname, "../db/data.json");

export const readJson = (filePath: string) => {
  console.log(filePath);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject("File not found");
      } else {
        resolve(JSON.parse(data.toString()) as TMovies);
      }
    });
  });
};

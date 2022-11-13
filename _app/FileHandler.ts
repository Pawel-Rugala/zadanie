import path from "path";
import fs from "fs";

export const filePath = path.resolve(__dirname, "../data/db.json");

export const readJson = (filePath: string): Promise<TMovies> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject("File not found");
      } else {
        resolve(JSON.parse(data.toString()));
      }
    });
  });
};

export const writeJson = (filePath: string, data: TMovies) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) {
        reject("File not found");
      } else {
        resolve("File written");
      }
    });
  });
};

const xlsx = require("node-xlsx");

import path from "path";
import fs from "fs";

// const sheets = xlsx.parse(path.join(__dirname, "./src/excel/国际化.xlsx"));
const sheets = xlsx.parse("./public/xlsx/国际化.xlsx");

const sheetsData = sheets[0].data;

let files: { [key: string]: any } = {};
let headers: string[] = [];
sheetsData.forEach((item: string[], index: Number) => {
  if (index === 0) {
    headers = item;

    const fileList = [...item];
    fileList.shift();
    fileList.forEach((fileName: string) => {
      files[fileName] = {};
    });
  } else {
    let key: string;
    item.forEach((name: string, index: number) => {
      if (index === 0) {
        key = name;
      } else {
        files[headers[index]][key] = name;
      }
    });
  }
});

for (const filename of Object.keys(files)) {
  // 导出json文件
  fs.writeFileSync(
    path.join(__dirname, `./public/json/${filename}.json`),
    JSON.stringify(files[filename], null, "\t")
  );
}

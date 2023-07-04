import XLSX from "xlsx";

import fs from "fs";
import path from "path";

const workbook = XLSX.readFile(
  path.join(__dirname, "../public/xlsx/国际化.xlsx")
);

const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// 将工作表转换为JSON对象
const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

let files: { [key: string]: any } = {};
let headers: string[] = [];

jsonData.forEach((item: string[], index: Number) => {
  // 文件列表
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
    path.join(__dirname, `../public/json/${filename}.json`),
    JSON.stringify(files[filename], null, "\t")
  );
}

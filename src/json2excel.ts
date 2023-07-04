const XLSX = require("xlsx");

import path from "path";
import fs from "fs";
const getPathInfo = (p: string) => path.parse(p);
/**
 * @description // 递归读取文件，类似于webpack的require.context()
 * @param {String} directory 文件目录
 * @param {Boolean} useSubdirectories 是否查询子目录，默认false
 * @param {array} extList 查询文件后缀，默认 ['.js']
 *
 */
function autoLoadFile(
  directory: string,
  useSubdirectories = false,
  extList = [".js"]
) {
  const filesList: string[] = [];
  // 递归读取文件
  function readFileList(
    directory: string,
    useSubdirectories: boolean,
    extList: string[]
  ) {
    const files = fs.readdirSync(directory);
    files.forEach((item: string) => {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && useSubdirectories) {
        readFileList(path.join(directory, item), useSubdirectories, extList);
      } else {
        const info = getPathInfo(fullPath);
        extList.includes(info.ext) && filesList.push(fullPath);
      }
    });
  }
  readFileList(directory, useSubdirectories, extList);
  // 生成需要的对象
  const res = filesList.map((item: string) => ({
    path: item,
    data: require(item),
    ...getPathInfo(item),
  }));

  return res;
}
// 自动获取同目录下的json文件夹下的json文件
const fileList = autoLoadFile(path.join(__dirname, "./i18n"), true, [".json"]);

let data: any = []; // 需要的数据格式: [{zh: "我是中文", en: "i am chinese"}]
fileList.forEach((_, i) => {
  // _.data = {Kxxxx:'语言'}
  for (const [key, val] of Object.entries(_.data)) {
    if (i === 0) {
      // 首次遍历新建对应键名
      data.push({ 键名: key, [_.name]: val });
    } else {
      // 非首次遍历匹配对应键名新增数据
      data.forEach((e: any) => {
        if (e["键名"] === key) {
          e[_.name] = val;
        }
      });
    }
  }
});

// 将JSON对象转换为工作簿
const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

// 将工作簿写入Excel文件
XLSX.writeFile(workbook, path.join(__dirname, "../public/xlsx/国际化.xlsx"));

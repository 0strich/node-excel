const express = require("express");
const router = express.Router();
const multiparty = require("multiparty");
const xlsx = require("xlsx");

const fmAnswer = (object) => {
  return {
    title: object?.title,
    diary: object?.diary,
    diarySummary: object?.diarySummary,
    expression: object?.expression,
    matchTypeDiary: object?.matchTypeDiary,
    matchTypeExpression: object?.matchTypeExpression,
    keyword: [
      object?.keyword1,
      object?.keyword2,
      object?.keyword3,
      object?.keyword4,
    ],
    typeKeyword: [
      object?.typeKeyword1,
      object?.typeKeyword2,
      object?.typeKeyword3,
      object?.typeKeyword4,
    ],
    group: object?.group,
    matchGroup: object?.matchGroup,
    summary: object?.summary,
    description: object?.description,
    part1: { key: 0, body: object?.part1Body, value: object?.part1Value },
    part2: { key: 1, body: object?.part2Body, value: object?.part2Value },
    part3: { key: 2, body: object?.part3Body, value: object?.part3Value },
    part4: { key: 3, body: object?.part4Body, value: object?.part4Value },
    partnerIndex: object?.partnerIndex,
    smtiMeCategory: object?.smtiMeCategory,
  };
};

/* GET xlsx listing. */
router.get("/", function (req, res, next) {
  const contents = `
  <html><body>
    <form action="/xlsx" method="POST" enctype="multipart/form-data">
      <input type="file" name="xlsx" />
      <input type="submit" />
    </form>
  </body></html>
  `;

  res.send(contents);
});

/* POST xlsx */
router.post("/", async (req, res, next) => {
  try {
    const resData = {};

    const form = new multiparty.Form({ authFile: true });

    form.on("file", (name, file) => {
      const workbook = xlsx.readFile(file.path);
      const sheetNames = Object.keys(workbook.Sheets);
      console.log("sheetNames: ", sheetNames);

      let i = sheetNames.length;

      while (i--) {
        const sheetName = sheetNames[i];
        if (sheetName === "결과") {
          // console.log(
          //   "sheetName: ",
          //   xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])
          // );
          resData[sheetName] = xlsx.utils
            .sheet_to_json(workbook.Sheets[sheetName])
            .map((el) => fmAnswer(el));
        }
      }
    });

    form.on("close", () => {
      res.send(resData);
    });

    form.parse(req);
  } catch (error) {
    console.log("error: ", error);
  }
});

module.exports = router;

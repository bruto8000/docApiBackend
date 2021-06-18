const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dpApi = require("./db.api");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

function validateDoc(req, res, next) {
  console.log(req.body);
  let doc = req.body;
  if (!doc || !doc.docName || !doc.elems || !doc.elems.length) {
    sendValidateError(res);
    return;
  }

  let passedValidate = true;

  doc.elems.forEach((element) => {
    if (!element.type || !element.value) {
      passedValidate = false;
    }
  });

  if (!passedValidate) {
    sendValidateError(res);
    return;
  }
  next();
}
function validateOldName(req, res, next) {
  if (!req.body.oldName) {
    req.body.oldName = req.body.docName;
  }
  next();
}
function sendValidateError(res) {
  res.status(400).json({
    message: "Некорректный документ.",
  });
}
function validateName(req, res, next) {
  if (!req.body.docName) {
    sendValidateError(res);
    return;
  }
  next();
}
async function checkIfNameAlreadyExist(req, res, next) {
  let founded = await dpApi.getDocByName(req.body.docName);
  if (founded) {
    res.status(400).json({
      message: "Документ с таким названием уже существует.",
    });
    return;
  } else {
    next();
  }
}
async function checkIfOldNameDoesntExist(req, res, next) {
  let founded = await dpApi.getDocByName(req.body.oldName);
  if (!founded) {
    res.status(400).json({
      message: "Документ с таким названием не существует.",
    });
    return;
  } else {
    next();
  }
}
async function checkIfNameDoesntExist(req, res, next) {
  let founded = await dpApi.getDocByName(req.body.docName);
  if (!founded) {
    res.status(400).json({
      message: "Документ с таким названием не существует.",
    });
    return;
  } else {
    next();
  }
}

app.get("/", (req, res) => {
  res.json("Сервер работает нормально");
});

app.get("/docs", async (req, res, next) => {
  let founded = await dpApi.getDocs();
  console.log(founded);
  res.json(founded);
});

app.post(
  "/docs",
  validateDoc,
  checkIfNameAlreadyExist,
  async (req, res, next) => {
    let doc = req.body;
    let added = await dpApi.addDoc(doc);
    if (!added) {
      res.status(500).json({
        message: "Не удалось добавить документ.",
      });
      return;
    }
    res.status(200).json({
      message: "Документ добавлен.",
    });
  }
);

app.put(
  "/docs",
  validateDoc,
  validateOldName,
  checkIfOldNameDoesntExist,
  async (req, res, next) => {
    let doc = req.body;
    let replaced = await dpApi.replaceDoc(doc.oldName, doc);
    if (!replaced) {
      res.status(500).json({
        message: "Не удалось изменить документ.",
      });
      return;
    }
    res.status(200).json({
      message: "Документ изменен.",
    });
  }
);

app.delete(
  "/docs",
  validateName,
  checkIfNameDoesntExist,
  async (req, res, next) => {
    let docName = req.body.docName;
    let replaced = await dpApi.deleteDoc(docName);
    if (!replaced) {
      res.status(500).json({
        message: "Не удалось удалить документ.",
      });
      return;
    }
    res.status(200).json({
      message: "Документ удален.",
    });
  }
);
module.exports = { app };

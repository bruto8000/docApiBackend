const { app } = require("./services/server");
const express = require("express");
const PORT = 3003;

app.use(express.static("./public"));
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});

console.log(`

   
      Documentation API BACKEND

`);

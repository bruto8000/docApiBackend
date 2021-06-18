const { db } = require("./connect");
const { apiDocSchema } = require("../schemas/apiDocSchema");
const apiDocModel = db.model("apidoc", apiDocSchema);

async function getDocs(limit) {
  let docs = await apiDocModel.find({}).lean().limit(limit);
  return docs;
}
async function addDoc(doc) {
  let newDoc = new apiDocModel(doc);
  let added = await newDoc.save();
  return added;
}
async function getDocByName(docName) {
  if (!docName) {
    return null;
  }
  let founded = await apiDocModel.findOne({ docName });

  return founded;
}
async function deleteDoc(docName) {
  let deleted = await apiDocModel.deleteOne({ docName });
  console.log(`deleted ${deleted}`);
  return deleted;
}
async function replaceDoc(oldName, newDoc) {
  let replaced = await apiDocModel.updateOne(
    { docName: oldName },
    { ...newDoc }
  );
  console.log(replaced);
  return replaced;
}
module.exports = {
  getDocs,
  addDoc,
  getDocByName,
  deleteDoc,
  replaceDoc,
};

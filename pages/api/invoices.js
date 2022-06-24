const { connectToDatabase } = require("../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default function handler(req, res) {
  switch (req.method) {
    case "POST": {
      return addInvoice(req, res);
    }
  }
}

async function addInvoice(req, res) {
  try {
    let { db } = await connectToDatabase();
    let result = await db.collection("posts").insertOne(JSON.parse(req.body));
    return res.json({
      RequestId: result.insertedId,
      Amount: JSON.parse(req.body).amount,
      success: true,
    });
  } catch (e) {
    return res.json({
      message: new Error(e).message,
      success: false,
    });
  }
}

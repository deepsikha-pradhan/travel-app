const { connectToDatabase } = require("./db.js");
const { Types } = require("mongoose");
const ObjectId = Types.ObjectId;

class DBCRUD {
  collection = null;
  collectionName = "";

  constructor(collectionName) {
    if (collectionName) this.collectionName = collectionName;
    else throw new Error("Database collection construction failed");
  }

  async initialize() {
    const db = await connectToDatabase();
    this.collection = await db.collection(this.collectionName);
  }

  async findById(_id, projection = {}) {
    return await this.collection.findOne(
      { _id: ObjectId.createFromHexString(_id.toString()) },
      { projection }
    );
  }

  async findOne(query, projection = {}) {
    return await this.collection.findOne(query, { projection });
  }

  async findOneOrCreateOne(query, projection = {}, insertingObject) {
    let findResult = await this.findOne(query, projection);
    if (!findResult) {
      const { insertedId, acknowledged = false } = await this.insertOne(
        insertingObject
      );
      return {
        inserted: true,
        data: { _id: insertedId, ...insertingObject },
      };
    } else {
      return {
        inserted: false,
        data: findResult,
      };
    }
  }

  async findAll(query, projection = {}, sort = { _id: -1 }) {
    const rows = await this.collection
      .find(query, { projection })
      ?.sort(sort)
      ?.toArray();
    return rows;
  }

  async findAndCountAll(
    query = {},
    projection = null,
    skip = 0,
    limit = 10,
    sort = { _id: -1 }
  ) {
    const totalCountPipe = [{ $count: "total" }];
    let matchedDocumentsPipe = [];
    Object.keys(query || {})?.length
      ? totalCountPipe.unshift({ $match: query })
      : totalCountPipe.unshift({ $match: {} });

    Object.keys(query || {})?.length
      ? matchedDocumentsPipe.unshift({ $match: query })
      : matchedDocumentsPipe.unshift({ $match: {} });

    Object.values(projection || {})?.length
      ? matchedDocumentsPipe.push({ $project: { ...projection } })
      : matchedDocumentsPipe.push({ $project: { noPrOjEcTiOn: 0 } });

    matchedDocumentsPipe = matchedDocumentsPipe.concat([
      { $sort: sort ?? { _id: -1 } },
      { $skip: +skip ?? 0 },
      { $limit: +limit ?? 10 },
    ]);
    const pipeline = [
      {
        $facet: {
          totalCountPipe,
          matchedDocumentsPipe,
        },
      },
    ];
    const result = await this.collection.aggregate(pipeline).toArray();
    let totalCount = result?.[0]?.totalCountPipe?.[0]?.total || 0;
    const rows = result?.[0]?.matchedDocumentsPipe || [];
    return { rows, totalCount };
  }

  async findWithPipeline(pipeline) {
    const result = await this.collection.aggregate(pipeline)?.toArray();
    return result;
  }

  async insertOne(data = null) {
    const createdAt = new Date();
    const updatedAt = new Date();
    return await this.collection.insertOne({ ...data, createdAt, updatedAt });
  }

  async insertMany(documents = []) {
    const createdAt = new Date();
    const updatedAt = new Date();
    return await this.collection.insertMany(
      documents?.map((d) => ({ ...d, createdAt, updatedAt }))
    );
  }

  async updateById(_id, document) {
    const updatedAt = new Date();
    delete document?._id;
    return await this.updateByQuery(
      { _id: ObjectId.createFromHexString(_id) },
      { ...document, updatedAt }
    );
  }

  async updateByQuery(query, document, options = {}) {
    const updatedAt = new Date();
    delete document?._id;
    return await this.collection.updateMany(
      query,
      {
        $set: { ...document, updatedAt },
      },
      options
    );
  }

  async incrDecrById(_id, countDetails) {
    delete countDetails?._id;
    return await this.collection.updateOne(
      { _id: ObjectId.createFromHexString(_id) },
      {
        $inc: countDetails,
      }
    );
  }

  async updateBulk(documentArrayWithQueryAndDocument = []) {
    const updatedAt = new Date();
    const docsToUpdate = documentArrayWithQueryAndDocument?.map((doc) => {
      const { query: filter = null, document: update = {} } = doc;
      delete doc?.update?._id;
      return {
        updateMany: {
          filter,
          update: { $set: { ...update, updatedAt } },
        },
      };
    });
    return await this.collection.bulkWrite(docsToUpdate);
  }

  async deleteById(_id) {
    return await this.collection.deleteOne({
      _id: ObjectId.createFromHexString(_id),
    });
  }

  async deleteByQuery(query) {
    return await this.collection.deleteMany(query);
  }
}

module.exports = { DBCRUD };

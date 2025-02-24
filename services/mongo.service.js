const { UserSPT } = require("../models/user.model");
const {ProductSPT} = require("../models/product.model");
const { error } = require("./response.service");

const models = {
  UserSPT,
  ProductSPT
};
module.exports = {
  findOne(opts = { model: "", query: {}, sort: {}, attributes: [] }) {
    return new Promise(async (resolve) => {
      try {
        if (!opts.attributes || opts.attributes.length === 0) {
          error(
            `::DATABASE ERROR :: Attributes is required in (findOne) method. ${opts.model}`
          );
        }
        let query =
          opts.query && Object.entries(opts.query).length >= 1
            ? opts.query
            : {};

        let getData;
        if (opts.attributes) {
          getData = await models[opts.model]
            .findOne(query)
            .sort(opts.sort)
            .select(opts.attributes)
            .lean()
            .exec();
        } else {
          getData = await models[opts.model]
            .findOne(query)
            .sort(opts.sort)
            .lean()
            .exec();
        }
        return resolve(getData);
      } catch (e) {
        error(`::DATABASE ERROR :: catch error in (findOne) method. ${e}`);
        return resolve(false);
      }
    });
  },

  updateOne(opts = { model: "", query: {}, data: {} }) {
    return new Promise(async (resolve) => {
      try {
        let query =
          opts.query && Object.entries(opts.query).length >= 1
            ? opts.query
            : {};
        let data = opts.data ? opts.data : {};
        return resolve(await models[opts.model].updateOne(query, data));
      } catch (e) {
        error(`::DATABASE ERROR :: catch error in (updateOne) method. ${e}`);
        return resolve(false);
      }
    });
  },

  create(opts = { model: "", data: {} }) {
    return new Promise(async (resolve) => {
      try {
        return opts.data
          ? resolve(await models[opts.model].create(opts.data))
          : false;
      } catch (e) {
        console.log(e);
        error(`::DATABASE ERROR :: catch error in (create) method. ${e}`);
        return resolve(false);
      }
    });
  },
  deleteOne(opts = { model: "", query: {}}) {
    return new Promise(async (resolve) => {
      try {
        if (!opts.attributes || opts.attributes.length === 0) {
          error(
            `::DATABASE ERROR :: Attributes is required in (delete) method. ${opts.model}`
          );
        }
        let query =
          opts.query && Object.entries(opts.query).length >= 1
            ? opts.query
            : {};

        let getData = await models[opts.model]
        .deleteOne(query)
        return resolve(getData);
      } catch (e) {
        error(`::DATABASE ERROR :: catch error in (delete) method. ${e}`);
        return resolve(false);
      }
    });
  },

  pagination(
    opts = {
      model: "",
      query: {},
      sort: [],
      searchFields: [],
      searchText: "",
      defaultSort: [],
      page: 1,
      limit: 10,
      attributes: [],
      excludeAttribute: [],
    }
  ) {
    return new Promise(async (resolve) => {
      try {
        if (!opts.attributes || opts.attributes.length === 0) {
          error(
            `::DATABASE ERROR :: Attributes is required in (pagination) method. ${opts.model}`
          );
        }
        opts.limit = parseInt(opts.limit);
        opts.page = parseInt(opts.page);
        let query =
          opts.query && Object.entries(opts.query).length >= 1
            ? opts.query
            : {};
        let sort = {};
        if (
          opts.sort &&
          opts.sort.length > 0 &&
          opts.sort[0] &&
          opts.sort[1] &&
          opts.sort[0] != "" &&
          opts.sort[1] != ""
        ) {
          sort = {
            [opts.sort[0]]:
              opts.sort[1] == "ASC" || opts.sort[1] == "asc" ? 1 : -1,
          };
        } else {
          sort =
            opts.defaultSort && opts.defaultSort.length > 0
              ? {
                  [opts.defaultSort[0]]:
                    opts.defaultSort[1] == "ASC" || opts.defaultSort[1] == "asc"
                      ? 1
                      : -1,
                }
              : {};
        }
        let selectFiled = {};
        if (opts.attributes && opts.attributes.length > 0) {
          opts.attributes.forEach(function (element) {
            selectFiled[element] = 1;
          });
        }
        let excludeField = {};
        if (opts.excludeAttribute && opts.excludeAttribute.length > 0) {
          opts.excludeAttribute.forEach(function (element) {
            excludeField[element] = 0;
          });
        }
        let limit = opts && opts.limit ? opts.limit : 10;
        const offset = (opts.page - 1) * opts.limit;
        if (
          opts.searchFields &&
          opts.searchFields.length > 0 &&
          opts.searchText &&
          opts.searchText != undefined
        ) {
          const searchQuery = {
            $or: opts.searchFields.map((field) => {
              const searchCondition = {};
              searchCondition["$expr"] = {
                $or: [
                  {
                    $regexMatch: {
                      input: { $toString: `$${field}` },
                      regex: new RegExp(opts.searchText, "i"),
                    },
                  },
                ],
              };
              return searchCondition;
            }),
          };
          query = { ...query, ...searchQuery };
        } else {
          query = { ...query };
        }
        let aggregationPipeline = [
          { $match: query },
          { $project: { ...selectFiled, ...excludeField } },
          { $sort: sort },
          {
            $project: selectFiled,
          },
          {
            $facet: {
              paginatedResults: [{ $skip: offset }, { $limit: limit }],
              totalCount: [{ $count: "total" }],
            },
          },
        ];
        let result = await models[opts.model].aggregate(aggregationPipeline);
        return resolve({
          draw: opts.page,
          recordsTotal: result[0].totalCount[0]
            ? result[0].totalCount[0].total
            : 0,
          recordsFiltered: offset,
          data: result[0].paginatedResults,
        });
      } catch (e) {
        console.log(e);
        error(`::DATABASE ERROR :: catch error in (pagination) method. ${e}`);
        return resolve(false);
      }
    });
  },
};

const Product = require('../models/productModel');

// hardcoded query search
const getAllProductsStatic = async (req, res) => {
  const search = 'ab';
  const products = await Product.find({}).select('name price');
  res.status(200).json({ nbHits: products.length, products });
};

// dynamic query searching options
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEX = /\b(<|>|>=|=|<=)\b/g;
    let filters = numericFilters.replace(regEX, (match) => {
      `-${operatorMap[match]}-`;
    });

    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, op, value] = item.split('-');

      if (options.includes(field)) {
        queryObject[field] = { [op]: Number(value) };
      }
    });
  }

  console.log(queryObject);

  let results = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(',').join(' ');
    results = results.sort(sortList);
  } else {
    results = results.sort('createdAt');
  }

  if (fields) {
    const fieldList = fields.split(',').join(' ');
    results = results.select(fieldList);
  }

  // Calc
  /* 
    No of items - 23
    Total pages - (3) 10 10 3 {since default limit is 10} 
  */

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const products = await results;
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };

const product = require("../models/product")
const Products = require("../models/product")

const getAllProductsStatic = async (req,res) => {
    
    const products = await Products.find({price:{$gt:30}})
    .sort("price")
    .select("name price")
    .limit(10)
    .skip(1)
    res.status(200).json({products, nbHits:products.length})
}

const getAllProducts = async (req,res) =>{
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}
    if (featured){
        queryObject.featured = featured === "true" ? true : false
    }
    if (company){
        queryObject.company = company
    }
    if (name){
        queryObject.name = {$regex: name, $options:"i"}
    }

    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        };

        const regex = /\b(<|>|>=|=|<=)\b/g;
        let filters = numericFilters.replace(regex, (match) => `-${operatorMap[match]}-`);
        const options = ["price", "rating"];

        filters.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-");
            const numericField = options.find(option => field.includes(option));

            if (numericField) {
                queryObject[numericField] = { [operator]: Number(value) };
            }
        });
    }

    console.log(queryObject);
    let result = product.find(queryObject)
    //sort
    if (sort){
        const sortList = sort.split(",").join("")
        result = result.sort(sortList)
    }
    else{
        result = result.sort("createdAt")
    }

    if (fields) {
        const fieldstList = fields.split(",").map(field => field.trim()); 
        result = result.select(fieldstList.join(" ")); 
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)
    
    const products = await result
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}
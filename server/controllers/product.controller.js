import Product from "../models/product.model.js";
import extend from "lodash/extend.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import formidable from "formidable";
import fs from "fs";
const create = (req, res, next) => {
    let form = formidable({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                message: "Image could not be uploaded",
            });
        }
        Object.keys(fields).forEach((key) => (fields[key] = fields[key][0]));
        Object.keys(files).forEach((key) => (files[key] = files[key][0]));
        let product = new Product(fields);
        product.shop = req.shop;
        if (files.image) {
            product.image.data = fs.readFileSync(files.image.filepath);
            product.image.contentType = files.image.mimetype;
        }
        try {
            let result = await product.save();
            res.json(result);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err),
            });
        }
    });
};
const productByID = async (req, res, next, id) => {
    try {
        let product = await Product.findById(id)
            .populate("shop", "_id name")
            .exec();
        if (!product)
            return res.status("400").json({
                error: "Product not found",
            });
        req.product = product;
        next();
    } catch (err) {
        return res.status("400").json({
            error: "Could not retrieve product",
        });
    }
};
const photo = (req, res, next) => {
    if (req.product.image.data) {
        res.set("Content-Type", req.product.image.contentType);
        return res.send(req.product.image.data);
    }
    next();
};
const defaultPhoto = (req, res) => {
    return null;
};
const read = (req, res) => {
    req.product.image = undefined;
    return res.json(req.product);
};
const update = (req, res) => {
    let form = formidable({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                message: "Photo could not be uploaded",
            });
        }
        Object.keys(fields).forEach((key) => (fields[key] = fields[key][0]));
        Object.keys(files).forEach((key) => (files[key] = files[key][0]));
        let product = req.product;
        product = extend(product, fields);
        product.updated = Date.now();
        if (files.image) {
            product.image.data = fs.readFileSync(files.image.filepath);
            product.image.contentType = files.image.mimetype;
        }
        try {
            let result = await product.save();
            res.json(result);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err),
            });
        }
    });
};
const remove = async (req, res) => {
    try {
        let product = req.product;
        let deletedProduct = await product.deleteOne({ _id: product._id });
        res.json(deletedProduct);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
const listByShop = async (req, res) => {
    try {
        let products = await Product.find({ shop: req.shop._id })
            .populate("shop", "_id name")
            .select("-image");
        res.json(products);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
export default {
    create,
    productByID,
    photo,
    defaultPhoto,
    read,
    update,
    remove,
    listByShop,
};


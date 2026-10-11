import Product from '../models/product.model.js';
export async function listProducts(req){const {search='',category='all',stock='all'}=req.query;const filter={};if(search)filter.name={$regex:String(search),$options:'i'};if(category!=='all')filter.category=category;if(stock==='low')filter.$expr={$lte:['$stock','$lowStockAt']};return Product.find(filter).sort({category:1,name:1}).lean();}
export async function createProduct(data){return Product.create(data)}
export async function updateProduct(id,data){const item=await Product.findByIdAndUpdate(id,data,{new:true,runValidators:true});if(!item)throw Object.assign(new Error('Product not found'),{status:404});return item}
export async function deleteProduct(id){const item=await Product.findByIdAndDelete(id);if(!item)throw Object.assign(new Error('Product not found'),{status:404});return item}

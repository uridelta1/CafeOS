import * as service from '../services/product.service.js';
export async function list(req,res,next){try{res.json(await service.listProducts(req))}catch(e){next(e)}}
export async function create(req,res,next){try{if(!req.body.name?.trim())return res.status(400).json({message:'Product name is required'});if(!Number.isFinite(Number(req.body.price))||Number(req.body.price)<0)return res.status(400).json({message:'Price must be a non-negative number'});res.status(201).json(await service.createProduct({...req.body,price:Number(req.body.price),stock:Number(req.body.stock||0)}))}catch(e){next(e)}}
export async function update(req,res,next){try{res.json(await service.updateProduct(req.params.id,req.body))}catch(e){next(e)}}
export async function remove(req,res,next){try{await service.deleteProduct(req.params.id);res.status(204).end()}catch(e){next(e)}}

import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, category:{type:String,default:'Coffee'}, description:{type:String,default:''},
  price:{type:Number,required:true,min:0}, stock:{type:Number,default:0,min:0}, lowStockAt:{type:Number,default:8,min:0},
  unit:{type:String,default:'pcs'}, image:{type:String,default:''}, available:{type:Boolean,default:true}
},{timestamps:true});
productSchema.index({name:1,category:1});
export default mongoose.model('Product',productSchema);

import Product from '../models/product.model.js';import Settings from '../models/settings.model.js';
export async function seedDemoData(){if(process.env.SEED_DEMO_DATA!=='true')return;const count=await Product.countDocuments();if(count===0){await Product.insertMany([
{name:'Flat White',category:'Coffee',description:'Double espresso with silky steamed milk',price:160,stock:42,lowStockAt:10},
{name:'Cappuccino',category:'Coffee',description:'Espresso, steamed milk and foam',price:180,stock:35,lowStockAt:10},
{name:'Iced Spanish Latte',category:'Cold Drinks',description:'Espresso, milk and condensed milk over ice',price:220,stock:24,lowStockAt:8},
{name:'Matcha Cloud',category:'Cold Drinks',description:'Ceremonial matcha with a creamy cold foam',price:245,stock:5,lowStockAt:8},
{name:'Butter Croissant',category:'Bakery',description:'Flaky, all-butter French pastry',price:130,stock:18,lowStockAt:6},
{name:'Blueberry Muffin',category:'Bakery',description:'Baked in-house with fresh blueberries',price:145,stock:3,lowStockAt:6},
{name:'Avocado Toast',category:'Food',description:'Sourdough, smashed avocado and chilli flakes',price:290,stock:12,lowStockAt:5},
{name:'Chocolate Brownie',category:'Desserts',description:'Fudgy dark chocolate brownie',price:155,stock:15,lowStockAt:5}
]);console.log('Demo menu items created.');}await Settings.findOneAndUpdate({key:'main'},{$setOnInsert:{key:'main'}},{upsert:true,new:true,setDefaultsOnInsert:true});}

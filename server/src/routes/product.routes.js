import {Router} from 'express';import * as c from '../controllers/product.controller.js';
const router=Router();router.get('/',c.list);router.post('/',c.create);router.patch('/:id',c.update);router.delete('/:id',c.remove);export default router;

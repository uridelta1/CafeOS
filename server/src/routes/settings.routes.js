import {Router} from 'express';import {get,update} from '../controllers/settings.controller.js';const router=Router();router.get('/',get);router.put('/',update);export default router;

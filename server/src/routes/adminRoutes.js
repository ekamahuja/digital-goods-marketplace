import express from 'express';
const adminRoutes = express();
import { adminApiOnly } from "../middlewares/apiRouteProtection.js"
import { updateConfig } from '../controllers/adminController.js'
import { createBlog, editBlog } from '../controllers/blogController.js';



adminRoutes.post('/config', adminApiOnly, updateConfig)
adminRoutes.post('/blog', adminApiOnly, createBlog)
adminRoutes.put('/blog/:blogId', adminApiOnly, editBlog)


export default adminRoutes
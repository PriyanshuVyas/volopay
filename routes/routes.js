import express from 'express';
import {  totalItems ,nTotalItem, percDeptWise, monthySales } from '../controller/controller.js';
const router = express.Router();

router.get('/total_items',totalItems);
router.get('/nth_most_total_item',nTotalItem);
router.get('/percentage_of_department_wise_sold_items',percDeptWise);
router.get('/monthy_sales',monthySales);

export default router;
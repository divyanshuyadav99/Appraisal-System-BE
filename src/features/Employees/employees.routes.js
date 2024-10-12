import express from 'express';
import { getAllEmployees, mapEmployeeToSupervisor } from './employees-controller.js';

const router  = express.Router();

router.get("/", getAllEmployees)
router.post("/", mapEmployeeToSupervisor)

export default router
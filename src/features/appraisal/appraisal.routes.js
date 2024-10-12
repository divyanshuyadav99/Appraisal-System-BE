import express from 'express';
import {
  createAppraisal,
  getAllAppraisals,
  getAppraisalById,
  updateAppraisal,
  deleteAppraisal,
  getEvaluatorAppraisal
} from './appraisal-controller.js';

const router = express.Router();

router.post('/evaluator',getEvaluatorAppraisal)
router.post('/', createAppraisal);
router.get('/', getAllAppraisals);
router.get('/:id', getAppraisalById);
router.put('/:id', updateAppraisal);
router.delete('/:id', deleteAppraisal);

export default router;

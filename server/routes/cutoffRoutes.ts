import express from 'express';
import {
  getCutoffsByJobId,
  getCutoffById,
  createCutoff,
  updateCutoff,
  deleteCutoff,
  getCutoffsByYear
} from '../controllers/cutoffController';

const router = express.Router();

// Get cutoffs by job ID
router.get('/job/:jobId', getCutoffsByJobId);

// Get cutoffs by year
router.get('/year/:year', getCutoffsByYear);

// Get single cutoff
router.get('/:id', getCutoffById);

// Create cutoff
router.post('/', createCutoff);

// Update cutoff
router.put('/:id', updateCutoff);

// Delete cutoff
router.delete('/:id', deleteCutoff);

export default router;

import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintById
} from '../controllers/complaintController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student actions
router.post('/', authMiddleware, createComplaint);          // create complaint
router.get('/my', authMiddleware, getMyComplaints);         // get student's own complaints
router.get('/:id', authMiddleware, getComplaintById);

// Admin/Warden actions - require role check on frontend/backed if needed
router.get('/', authMiddleware, getAllComplaints);          // all complaints (warden/admin)
router.put('/:id', authMiddleware, updateComplaintStatus);  // update status (warden/admin)

export default router;

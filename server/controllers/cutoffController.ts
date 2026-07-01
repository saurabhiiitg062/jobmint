import { Request, Response } from 'express';
import { Cutoff } from '../models/Cutoff';

// Get cutoffs by job ID
export const getCutoffsByJobId = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const cutoffs = await Cutoff.find({ jobId }).sort({ year: -1, examType: 1 });
    res.json(cutoffs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get cutoff by ID
export const getCutoffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cutoff = await Cutoff.findById(id);
    if (!cutoff) {
      return res.status(404).json({ message: 'Cutoff not found' });
    }
    res.json(cutoff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create cutoff
export const createCutoff = async (req: Request, res: Response) => {
  try {
    const cutoffData = req.body;
    const cutoff = new Cutoff(cutoffData);
    await cutoff.save();
    res.status(201).json(cutoff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update cutoff
export const updateCutoff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cutoffData = req.body;
    const cutoff = await Cutoff.findByIdAndUpdate(id, cutoffData, { new: true });
    if (!cutoff) {
      return res.status(404).json({ message: 'Cutoff not found' });
    }
    res.json(cutoff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete cutoff
export const deleteCutoff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cutoff = await Cutoff.findByIdAndDelete(id);
    if (!cutoff) {
      return res.status(404).json({ message: 'Cutoff not found' });
    }
    res.json({ message: 'Cutoff deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get cutoffs by year
export const getCutoffsByYear = async (req: Request, res: Response) => {
  try {
    const { year } = req.params;
    const cutoffs = await Cutoff.find({ year }).sort({ examType: 1, category: 1 });
    res.json(cutoffs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

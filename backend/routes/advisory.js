import express from 'express';
import { generateEnvironmentAdvisory } from '../utils/agent.js';

const router = express.Router();

router.post('/', (req, res) => {
    try {
        const { environmentData, analysisResult } = req.body;
        if (!environmentData || !analysisResult) {
            return res.status(400).json({ error: 'environmentData and analysisResult are required' });
        }

        const advisories = generateEnvironmentAdvisory(analysisResult, environmentData);
        res.json({ advisories });
    } catch (error) {
        console.error("Error generating advisory:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const authMiddleware = require('../middleware/authMiddleware');

// GET all open trades
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET trades for current user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new trade offer
router.post('/create', async (req, res) => {
  try {
    const newTrade = new Trade({
      ...req.body,
      status: 'open',
    });
    const saved = await newTrade.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT accept a trade (changes status to pending)
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    if (trade.status !== 'open') return res.status(400).json({ message: 'Trade is no longer available' });

    trade.status = 'pending';
    trade.acceptedBy = req.user.id;
    await trade.save();

    res.json({ message: 'Trade accepted', trade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT complete a trade (release funds)
router.put('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.json({ message: 'Trade completed', trade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE cancel/remove a trade offer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Trade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trade removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
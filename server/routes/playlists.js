const express = require('express');
const jwt = require('jsonwebtoken');
const Playlist = require('../models/Playlist');

const router = express.Router();

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const playlists = await Playlist.find({ userId: req.user.id });
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  })
  .post(protect, async (req, res) => {
    const { name } = req.body;
    try {
      const playlist = await Playlist.create({
        userId: req.user.id,
        name,
        tracks: []
      });
      res.status(201).json(playlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.id);
      if (playlist.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  })
  .put(protect, async (req, res) => {
    const { name, tracks } = req.body;
    try {
      const playlist = await Playlist.findById(req.params.id);
      if (playlist.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      if (name) playlist.name = name;
      if (tracks) playlist.tracks = tracks;
      await playlist.save();
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.id);
      if (playlist.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await playlist.deleteOne();
      res.json({ message: 'Playlist removed' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;

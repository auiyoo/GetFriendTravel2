const jwt = require('jsonwebtoken');
const { checkDB } = require('../config/db');
const { UserMock } = require('../data/mockStore');

let User;
try { User = require('../models/User'); } catch (_) {}

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

      if (checkDB()) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ message: 'User not found' });
      } else {
        // Mock mode — look up user from in-memory store
        const mockUser = UserMock.findById(decoded.id);
        if (!mockUser) return res.status(401).json({ message: 'User not found' });
        req.user = mockUser; // plain object, no .save() needed
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

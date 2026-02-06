const { body } = require('express-validator');

exports.createMood = [
  body('moodLevel')
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood level must be between 1 and 10'),
  body('emotion')
    .optional()
    .isIn(['happy', 'sad', 'anxious', 'angry', 'calm', 'tired', 'energetic', 'neutral'])
    .withMessage('Invalid emotion'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Note must be less than 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

exports.updateMood = [
  body('moodLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood level must be between 1 and 10'),
  body('emotion')
    .optional()
    .isIn(['happy', 'sad', 'anxious', 'angry', 'calm', 'tired', 'energetic', 'neutral'])
    .withMessage('Invalid emotion'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Note must be less than 500 characters')
];



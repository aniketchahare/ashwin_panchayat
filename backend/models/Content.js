const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
});

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['EVENT', 'ACHIEVEMENT', 'WORK'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  media: {
    type: [mediaSchema],
    default: [],
  },
  // Date fields for events
  startDate: {
    type: Date,
    required: function() {
      return this.type === 'EVENT';
    },
  },
  endDate: {
    type: Date,
    required: function() {
      return this.type === 'EVENT';
    },
    validate: {
      validator: function(value) {
        if (this.type === 'EVENT' && this.startDate) {
          return value >= this.startDate;
        }
        return true;
      },
      message: 'End date must be after or equal to start date',
    },
  },
  // Active/Inactive status for all content types
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
contentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', contentSchema);


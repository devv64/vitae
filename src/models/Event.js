import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  username: { type: String },
  reschedulable: { type: Boolean, required: true },
  title: { type: String, required: true },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true,
  },
  intensity: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  type: {
    type: String,
    enum: ['work', 'personal', 'family', 'social', 'health', 'other'],
    required: false
  },
  repeat: {
    type: String,
    enum: ['never', 'daily', 'weekly', 'monthly', 'yearly'],
    required: false
  },
}, {
  collection: 'events',
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;

import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Quiz',
    },
    answers: {
      type: [Number], // Storing indices of chosen options (0 to 3)
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;

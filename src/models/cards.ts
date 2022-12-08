import mongoose, { model, Schema } from 'mongoose';

interface ICard {
  name: string,
  link: string,
  owner: mongoose.ObjectId,
  likes: mongoose.ObjectId[],
  createdAt: Date,
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [mongoose.Schema.Types.ObjectId],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);

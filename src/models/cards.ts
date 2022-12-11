import mongoose, { model, Schema } from 'mongoose';
import { httpRegex } from '../constants';

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
    validate: {
      validator(v: string) {
        return (!v || !v.trim().length) || httpRegex.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);

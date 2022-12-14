import { model, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { httpRegex } from '../constants';

interface IUser {
  name?: string,
  about?: string,
  avatar?: string,
  email: string,
  password: string
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    dafault: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    dafault: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(v: string) {
        return (!v || !v.trim().length) || httpRegex.test(v);
      },
    },
    dafault: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v: string) {
        return isEmail(v);
      },
    },
  },
  password: {
    type: String,
  },
});

export default model<IUser>('user', userSchema);

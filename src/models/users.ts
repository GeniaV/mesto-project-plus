import {
  model,
  Schema,
  Model,
  Document,
} from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';
import { httpRegex } from '../constants';
import UnauthorizedError from '../errors/unauthorized_error';

interface IUser {
  name?: string,
  about?: string,
  avatar?: string,
  email: string,
  password: string
}

interface IUserModel extends Model<IUser> {
  findUserByCredentials: (
    // eslint-disable-next-line no-unused-vars
    email: string,
    // eslint-disable-next-line no-unused-vars
    password: string
  ) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, IUserModel>({
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

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
});

export default model<IUser, IUserModel>('user', userSchema);

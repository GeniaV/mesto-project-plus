import { celebrate, Joi } from 'celebrate';
import { httpRegex } from './constants';

export const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(200).default('Исследователь'),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').regex(httpRegex),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  }).unknown(true),
});

export const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
  }).unknown(true),
});

export const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

export const validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }).unknown(true),
});

export const validateUpdateUserAvatarBody = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(httpRegex),
  }).unknown(true),
});

export const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().regex(httpRegex),
  }).unknown(true),
});

export const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

export const validateLikesCardParams = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

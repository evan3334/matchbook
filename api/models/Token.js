module.exports = {
  attributes: {
    uuid: {
      type: 'string',
      required: true,
      isUUID: true,
      unique: true,
      description: "The actual token. Tokens take the form of a UUID.",
    },
    user: {
      model: 'user',
      description: "The user associated with this token. For example, if this is a password reset token, this attribute would be the user whose password is to be reset.",
      required: true
    },
    type: {
      type: 'string',
      description: 'The type of token this is. Can be \'password-reset\' or \'verify-email\'.',
      required: true,
      isIn: [
        'password-reset',
        'verify-email'
      ]
    },
    expires: {
      type: 'number',
      description: 'The date, in milliseconds since 1/1/1970, when this token should become invalid',
      required: false
    }

  }
};
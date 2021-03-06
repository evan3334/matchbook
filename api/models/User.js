module.exports = {
  attributes: {
    uuid: {
      type: 'string',
      required: true,
      isUUID: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      unique: true
    },
    password:{
      type: 'string',
      required: true
    },
    verified:{
      type: 'boolean',
      defaultsTo: false
    },
    admin: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
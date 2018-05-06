const uuid = require('uuid');

module.exports = {
  friendlyName: 'Register',

  description: 'Creates a user account with the given credentials',

  inputs: {
    email: {
      description: 'The email address for the new account',
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      description: 'The un-hashed password for the new account',
      type: 'string',
      required: true
    },
    name: {
      description: 'The full name of the new account',
      type: 'string',
      required: true
    }//,
    /*redirect: {
      description: 'The page to redirect to after success. Used when the user is trying to access something that requires login, so the user can start where they left off.',
      required: false,
      type: 'string'
    }*/
  },

  exits: {
    success: {
      responseType: 'redirect'
    },
    failure: {
      responseType: 'view',
      viewTemplatePath: 'pages/register'
    },
    error: {
      description: 'Something went wrong on our end.',
      statusCode: 500
    }
  },

  fn: async function (inputs, exits) {
    try {
      var user = await User.findOne({email: inputs.email});
      if (user) {
        return exits.failure({taken:true});
      }
      else{
        user = await User.create({
          email:inputs.email,
          password: await sails.helpers.passwords.hashPassword(inputs.password),
          uuid: uuid.v4(),
          name: inputs.name
        }).fetch();

        this.req.session.me = user;
        return exits.success('/');
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};
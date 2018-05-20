module.exports = {
  friendlyName: 'Login',

  description: 'Attempts to log in to a user account with the given credentials',

  inputs: {
    email: {
      description: 'The email address for login',
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      description: 'The un-hashed password for login',
      type: 'string',
      required: true
    },
    redirect: {
      description: 'The page to redirect to after success. Used when the user is trying to access something that requires login, so the user can start where they left off.',
      required: false,
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    },
    failure: {
      responseType: 'view',
      viewTemplatePath: 'pages/login'
    },
    error: {
      description: 'Something went wrong on our end.',
      statusCode: 500
    }
  },

  fn: async function (inputs, exits) {
    try {
      var user = await User.findOne({email: inputs.email});
      if (!user) {
        return exits.failure({failure:true});

      }
    }
    catch (e) {
      return exits.error(e);
    }
    var pwResult = await checkPassword(inputs.password, user.password);
    if(pwResult===true){
      //if we got here, the password was right
      this.req.session.me = user;
      let redirectPage = '/';
      if(inputs.redirect){
        redirectPage = decodeURIComponent(inputs.redirect);
      }else{
        if(!user.verified){
          return this.res.needsVerification(false);
        }
      }
      return exits.success(redirectPage);
    }
    else{
      return exits.failure({failure: true});
    }

  }
};


async function checkPassword(password, hash){
  try {
    await sails.helpers.passwords.checkPassword(password, hash);
    return true;
  }
  catch(e){
    return false;
  }
}
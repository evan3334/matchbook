const uuid = require('uuid');
module.exports = {
  friendlyName: 'Generate Verification Token',

  description: 'Generate a new verification token for a user',

  inputs: {
    userUUID: {
      type: 'string',
      description: 'the UUID of the user you would like to generate a token for',
      required: true,
      isUUID: true
    }
  },

  exits:{
    userDoesNotExist: {
      description: 'The specified UUID does not point to an existing user.'
    }
  },

  fn: async function (inputs, exits) {
    let newToken = uuid.v4();
    sails.log.debug(inputs.userUUID);
    let user = await User.findOne({uuid: inputs.userUUID});
    let expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 2); //token will expire in 2 hours from now
    if (user) {
      //let's get rid of any of the user's existing email verification tokens first.
      await Token.destroy({user:user.id, type: 'verify-email'});

      let token = Token.create({
        uuid: newToken,
        user: user.id,
        type: 'verify-email',
        expires: expiryDate.getTime()
      }).fetch();
      return exits.success(token);
    }
    else {
      return exits.userDoesNotExist();
    }
  }
};
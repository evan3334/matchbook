var mailgun = require('mailgun-js');
module.exports = {
  friendlyName: 'Send Verification Email',

  description: 'Sends an email to the specified user containing a link to activate their account.',

  inputs:{
    userUUID:{
      type:'string',
      description:'The UUID of the user whose account is to be activated',
      required: true,
      isUUID: true
    }
  },

  exits:{
    userDoesNotExist: {
      description: 'The specified user does not exist.'
    },
    noToken: {
      description: 'No token exists for the specified user.'
    },
    emailError: {
      description: 'Some error occurred sending an email'
    }
  },

  fn: async function(inputs, exits){
    //first let's look up the user, to make sure they exist:
    let user = await User.findOne({uuid: inputs.userUUID});
    if(user){
      //okay, the user is valid.
      //now, let's look up a token for them.
      let token = await Token.findOne({user:user.id, type:'verify-email'})
        .populate('user');
      if(token){
        //great, we have found a token.
        //one last check in case it has expired but hasn't been cleared out by the TTL settings in Mongo yet.
        let now = new Date().getTime();
        if(token.expires > now) {
          //perfect. the token is completely valid. Now, let's send it off to the user.

          let mailgunClient = new mailgun({
            apiKey: sails.config.custom.mailgun.apiKey,
            domain: sails.config.custom.mailgun.domain
          });
          let link = sails.config.custom.siteAddress + '/account/verify?token=' + token.uuid;
          let message = {
            from: 'Matchbook <no-reply@' + sails.config.custom.mailgun.domain + '>',
            to: user.email,
            subject: 'Verify your email address',
            text: 'Hello, ' + user.name + '. Please finish setting up your account on Matchbook by verifying your email address.\n' +
            'Simply click the link below to complete the account-creation process by verifying that you own this email address.\n' +
            '\n' +
            link /*+
              '\n'+  //let's hold off on this part until we have some safe measure for dealing with people signing up others' email addresses
              'Didn\'t register an account on Matchbook? You can safely ignore this email.'*/
          };
          sails.log.debug(message);

          try {
            await mailgunClient.messages().send(message);
            return exits.success();
          } catch (e) {
            return exits.emailError(e);
          }
        }
        else{
          return exits.noToken();
        }
      }
      else{
        return exits.noToken();
      }
    }
    else{
      return exits.userDoesNotExist();
    }
  }

};
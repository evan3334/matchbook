require('uuid');

module.exports = {
  friendlyName: 'Verify page',

  description: 'Shows the page instructing a user to verify their email',

  inputs: {
    redirect: {
      type: 'string',
      description: 'the page a user should be redirected to after viewing this page',
      required: false
    },
    resendemail: {
      type: 'boolean',
      description: 'if true, a new email will be sent',
      required: false,
      defaultsTo: false
    },
    token: {
      type: 'string',
      description: 'the token to verify account with (if coming from the email link)',
      required: false
    }
  },

  exits: {
    showPage: {
      responseType: 'view',
      viewTemplatePath: 'pages/pleaseverify'
    },
    tokenInvalid: {
      responseType: 'view',
      viewTemplatePath: 'pages/invalidtoken'
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    //check if an account is logged in (this is not done in policy to avoid a loop)
    if(this.req.session.me){
      let user = this.req.session.me;
      //if the account is already verified
      if(user.verified){
        return redir(inputs,exits);
      }
      else if(inputs.token){
        //we've been given a token. Let's make sure it's good:
        let uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
        if(uuidRegex.test(inputs.token.toLowerCase())){
          let token = await Token.findOne({uuid: inputs.token}).populate('user');
          if(token && token.type === 'verify-email' && token.user.uuid === user.uuid){
            //all token validations have succeeded. Let's verify the account.
            let updatedUser = await User.update({uuid:user.uuid})
              .set({verified: true})
              .fetch();
            if(!updatedUser){
              return this.res.serverError(new Error('No user account exists for the specified user ID!'));
            }
            this.req.session.me = updatedUser;
            return redir(inputs,exits);
          }
        }
      }
      if(inputs.resendemail){
        //let's make sure the token didn't expire, if a token exists we will send it but if not we will regenerate it
        let token = await Token.findOne({user: user.id, type: 'verify-email'});
        if(!token){
          sails.log.debug(user.uuid);
          token = await sails.helpers.genVerificationToken(user.uuid);
        }

        //we should have a token at this point, either newly generated or retrieved from the database.
        //let's send the email:
        await sails.helpers.sendVerificationEmail(user.uuid);
        //email is sent! let's show the page.
        return exits.showPage({email: user.email, sent: true})
      }
      return exits.showPage({email: user.email});
    }
    else{
      return this.res.needsLogin();
    }
  }
};

function redir(inputs, exits){
  let redirectPage = '/';
  if(inputs.redirect){
    redirectPage = decodeURIComponent(inputs.redirect);
  }
  return exits.redirect(redirectPage);
}
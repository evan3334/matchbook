module.exports = {
  friendlyName: 'Login Page',

  description: 'Shows the login page, or redirects if the user\'s already logged in.',

  inputs: {
    redirect:{
      description:'The page to redirect to after login.',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/login'
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function(inputs,exits){
    if(this.req.session.me){ //if user is already logged in
      let redirectPage = '/';
      if(inputs.redirect){
        redirectPage = decodeURIComponent(inputs.redirect);
      }
      return exits.redirect(redirectPage);
    }
    else{
      return exits.success({redirect: inputs.redirect});
    }
  }
};
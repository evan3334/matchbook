module.exports = {
  friendlyName: 'Login Page',

  description: 'Shows the login page, or redirects if the user\'s already logged in.',

  inputs: {
    //none
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
      return exits.redirect('/'); //redirect to homepage for now
    }
    else{
      return exits.success();
    }
  }
};
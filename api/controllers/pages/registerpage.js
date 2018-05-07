module.exports = {
  friendlyName: 'Register Page',

  description: 'Show the register page if the user is not logged in, or redirect if not.',

  inputs: {
    //none
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/register'
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function(inputs,exits){
    //if the user is logged in
    if(this.req.session.me){
      return exits.redirect('/');
    }
    else{
      return exits.success();
    }
  }
};
module.exports = {
  friendlyName: 'Create page',

  description: 'Shows the create page, or redirects the user if not logged in.',

  inputs: {},

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/createlisting'
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    //if the user is logged in
    if (this.req.session.me) {
      return exits.success();
    }
    else {
      return exits.redirect('/login');
    }
  }
};
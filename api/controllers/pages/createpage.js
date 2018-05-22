module.exports = {
  friendlyName: 'Create page',

  description: 'Shows the create page',

  inputs: {},

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/createlisting'
    }
  },

  fn: async function (inputs, exits) {
    return exits.success({backbtn:'/listings/'});
  }
};
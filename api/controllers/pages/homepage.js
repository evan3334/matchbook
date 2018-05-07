module.exports = {
  friendlyName: 'Homepage',

  description: 'Shows the homepage.',

  inputs: {
    //none
  },

  exits: {
    success:{
      responseType:'view',
      viewTemplatePath: 'pages/homepage'
    }
  },

  fn: async function(inputs,exits){
    return exits.success();
  }
};
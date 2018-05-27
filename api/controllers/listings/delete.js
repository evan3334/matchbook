var uuid = require('uuid');

module.exports = {

  friendlyName: 'Delete Listing',

  description: 'Delete a given listing',

  inputs: {
    uuid: {
      description: 'The UUID of the listing to delete',
      type: 'string',
      required: true,
      isUUID: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/deletesuccess'
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits){
    let user = this.req.session.me;
    try {
      var listing = await Listing.findOne({uuid: inputs.uuid}).populate('creator');
      if(listing){
        if(listing.creator.uuid === user.uuid || user.admin){
          await Listing.destroy({uuid: inputs.uuid});
          return exits.success({backbtn:'/listings/'});
        }
        else{
          return exits.redirect('/listings/'+inputs.uuid);
        }
      }
      else{
        return this.res.notFound();
      }
    }
    catch(e){
      return this.res.serverError(e);
    }
  }

};
var uuid = require('uuid');

module.exports = {

  friendlyName: 'Edit Existing Listing',

  description: 'Update an existing listing with the given parameters',

  inputs: {
    uuid: {
      description: 'The UUID of the listing to update',
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
        if(listing.creator.uuid === user.uuid){
          await Listing.destroy({uuid: inputs.uuid});
          return exits.success();
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
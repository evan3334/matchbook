module.exports = {
  friendlyName: 'Delete page',

  description: 'Shows the delete page, which is really just the view page with a different parameter.',
  extendedDescription: 'NOTE: This page is only as a backup in case someone enters in /delete/ as part of the URL. The standard way to delete a listing is by using the button on its respective view page.',

  inputs: {
    uuid: {
      type: 'string',
      description: "The UUID of the listing to edit.",
      isUUID: true,
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/listingsingle'
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    var listing = await Listing.findOne({uuid:inputs.uuid}).populate('creator');
    if(!listing){
      return this.res.notFound();
    }
    else{
      var user = this.req.session.me;
      if(listing.creator.uuid !== user.uuid){
        //the user is not allowed to delete this listing, so simply show them its page.
        return exits.redirect('/listings/'+inputs.uuid);
      }
      else{
        //the user can delete this listing, so show them the page with the dialog.
        return exits.success({listing: listing, showDelete: true, admin: user.admin, owner:true, backbtn:'/listings/'});
      }
    }
  }
};
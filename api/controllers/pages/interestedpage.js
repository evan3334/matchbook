module.exports = {
  friendlyName: 'Interested page',

  description: 'Shows the \'I am interested\' page, which is really just the view page with a different parameter.',
  extendedDescription: 'NOTE: This page is only as a backup in case someone enters in /interested/ as part of the URL. The standard way to view this page is by using the button on its respective view page.',

  inputs: {
    uuid: {
      type: 'string',
      description: "The UUID of the listing.",
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
      if(listing.creator.uuid === user.uuid){
        //the user can't be interested in buying their own listing, so simply show them its page.
        return exits.redirect('/listings/'+inputs.uuid);
      }
      else{
        //the user can show interest in this listing, so show them the page with the dialog.
        return exits.success({listing: listing, showInterest: true, admin: user.admin, owner:false, backbtn:'/listings/'});
      }
    }
  }
};
module.exports = {

  friendlyName: 'Show all listings',

  description: 'Show all listings in marketplace, or if specific criteria were given, show only listings matching those.',

  inputs: {
    userid: {
      description: 'If given, this action will return all the listings posted by the user associated with this ID.',
      type: 'string',
      isUUID: true,
      required: false
    },
    isbn: {
      description: 'If given, this action will return all the listings with this ISBN',
      type: 'string',
      custom: function(value){
        return /[0-9]{10}$/.test(value) || /[0-9]{13}$/.test(value);
      },
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/listingresults'
    },
    error: {
      description: 'Something went wrong on our end.',
      statusCode: 500
    }
  },

  fn: async function (inputs, exits){
    var listings;
    var all = true;
    try {
      if (inputs.isbn) {
        listings = await Listing.find({isbn: inputs.isbn}).populate('creator');
        all=false;
      }
      else {
        listings = await Listing.find().populate('creator');
      }
      return exits.success({all: all, results: listings});
    }
    catch(e){
      return exits.error();
    }
  }

};
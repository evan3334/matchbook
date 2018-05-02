var uuid = require('uuid');

module.exports = {

  friendlyName: 'Create New Listing',

  description: 'Create a new listing with the given parameters',

  inputs: {
    title: {
      description: 'The title of the book',
      type: 'string',
      required: true
    },
    isbn: {
      description: 'The ISBN of the book',
      type: 'string',
      custom: function(value){
        return /[0-9]{10}$/.test(value) || /[0-9]{13}$/.test(value);
      },
      required: true
    },
    price: {
      description: 'The price of the book',
      type: 'number',
      custom: function(value){
        return value>0 && ((value*100)%1)===0; //make sure the number is positive and has 2 decimal places max
      },
      required: true
    }
  },

  exits: {
    displayListing: {
      responseType: 'redirect'
    },
    error: {
      description: 'Something went wrong on our end.',
      statusCode: 500
    }
  },

  fn: async function (inputs, exits){
    try {
      var listing = await Listing.create({
        title: inputs.title,
        isbn: inputs.isbn,
        price: inputs.price,
        uuid: uuid.v4()
      }).fetch();
      return exits.displayListing("/listings/"+listing.uuid);
    }
    catch(e){
      return exits.error();
    }
  }

};
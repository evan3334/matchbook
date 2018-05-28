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
      required: false
    },
    title: {
      description: 'Search query to search in the titles of listings',
      type: 'string',
      required: false
    },
    page: {
      description: 'Page number of results',
      type: 'number',
      required: false,
      defaultsTo: 1
    },
    perpage: {
      description: 'Maximum number of results to show per page',
      type: 'number',
      required: false,
      defaultsTo: 10
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

  fn: async function (inputs, exits) {
    if (inputs.perpage < 1) {
      inputs.perpage = module.exports.inputs.perpage.defaultsTo;
    }
    if (inputs.page < 1) {
      inputs.page = 1;
    }

    let listings;
    let all = true;
    try {
      //generic object to hold database query criteria based on the inputs
      let criteria = {};

      //now let's check the inputs and build up the criteria object
      if (inputs.isbn) {
        //first make sure we're dealing with only numbers here
        let isbn = sanitizeISBN(inputs.isbn);
        criteria.isbn = {startsWith: isbn};
        all = false;
      }

      //perform a generic DB search based on the criteria

      let count = await Listing.count(criteria);
      if(count >0) {

        //determine the maximum number of pages we can show
        //if the maxpages value has any fractional part, we can count one more page because the last page is only partially filled
        //we can solve this with the ceiling function because it automatically rounds up
        let maxpages = Math.ceil(count / inputs.perpage);

        //if the selected page is over the maximum number of pages
        if (inputs.page > maxpages) {
          //just set page to maximum number of pages
          inputs.page = maxpages;
        }

        //how many entries to skip. since page isn't zero-indexed subtract 1 from it.
        let skip = (inputs.page - 1) * inputs.perpage;
        //max number of entries we can get from the query
        let limit = inputs.perpage;

        //perform a database query with the given criteria and fill in the creator
        listings = await Listing.find({where: criteria, skip: skip, limit: limit}).populate('creator');
        //make sure all of the undefined attributes that have defaults are filled in
        for (let i = 0; i < listings.length; i++) {
          listings[i] = await Listing.fillAttributes(listings[i]);
        }
        //display the page
        return exits.success({
          page: inputs.page,
          perpage: inputs.perpage,
          maxpages: maxpages,
          all: all,
          results: listings
        });
      }
      else{
        return exits.success({
          page: 1,
          perpage: inputs.perpage,
          maxpages: 1,
          all: all,
          results: []
        })
      }
    }
    catch (e) {
      return exits.error();
    }
  }
};

function sanitizeISBN(isbn){
  let newISBN = '';
  let i =0;
  for(let char of isbn){
    //stop at 13 characters, that's the longest an ISBN can be
    //we don't care if it's between 10 and 13 because we can search for listings that start with the numbers given
    if(i===13){
      break;
    }
    if(/[0-9]/.test(char)){
      newISBN+=char;
    }
  }
  return newISBN;
}
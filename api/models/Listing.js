module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    isbn: {
      type: 'string',
      required:true,
      custom: function(value){
        return /^[0-9]{10}$/.test(value) || /^[0-9]{13}$/.test(value);
      }
    },
    price: {
      type: 'number',
      required: true
    },
    uuid: {
      type: 'string',
      required: true,
      isUUID: true,
      unique: true
    },
    creator:{
      model: 'user',
      required: true
    },
    description: {
      type: 'string',
      required: false
    },
    subtitle: {
      type: 'string',
      required: false
    },
    authors:{
      type: 'json',
      columnType: 'array',
      required: false,
      defaultsTo: ['Anonymous', 'Anonymous 2'],
    },
    publisher:{
      type: 'string',
      required: false
    },
    publicationDate:{
      type: 'ref',
      required: false,
      defaultsTo: new Date(0),
      custom: function(value){
        return value instanceof Date;
      }
    },
    cover: {
      type: 'string',
      isURL: true,
      required: false,
      defaultsTo: sails.config.custom.siteAddress+'/images/defaultcover.png'
    }
  },

  fillAttributes: async function fillAttributes(listing){
    let keys = Object.keys(module.exports.attributes);
    for(let key of keys){
      if(typeof listing[key]==='undefined'){
        if(typeof module.exports.attributes[key].defaultsTo!=='undefined'){
          listing[key] = module.exports.attributes[key].defaultsTo;
        }
      }
    }
    return listing;
  }
};
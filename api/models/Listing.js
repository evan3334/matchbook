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
        return /[0-9]{10}$/.test(value) || /[0-9]{13}$/.test(value);
      }
    },
    price: {
      type: 'number',
      required: true
    },
    uuid: {
      type: 'string',
      required: true,
      isUUID: true
    }
  }
};
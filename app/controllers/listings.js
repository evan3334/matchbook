var Listings = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Listing.all(function(err, listings) {
      if (err) {
        throw err;
      }
      self.respondWith(listings, {type:'Listing'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , listing = geddy.model.Listing.create(params);

    if (!listing.isValid()) {
      this.respondWith(listing);
    }
    else {
      listing.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(listing, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Listing.first(params.id, function(err, listing) {
      if (err) {
        throw err;
      }
      if (!listing) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(listing);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Listing.first(params.id, function(err, listing) {
      if (err) {
        throw err;
      }
      if (!listing) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(listing);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Listing.first(params.id, function(err, listing) {
      if (err) {
        throw err;
      }
      listing.updateProperties(params);

      if (!listing.isValid()) {
        self.respondWith(listing);
      }
      else {
        listing.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(listing, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Listing.first(params.id, function(err, listing) {
      if (err) {
        throw err;
      }
      if (!listing) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Listing.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(listing);
        });
      }
    });
  };

};

exports.Listings = Listings;

(function() {
  var Application, ApplicationView, CreditCardWidget, DESCENDING_ID_COMPARATOR, DashboardView, Donation, EMAIL_REGEX, Helpers, IE_VERSION, IS_IE, IS_MOBILE, IS_PHONE, IS_SAFARI, IS_TABLET, MENTION_REGEX, NewDonationView, ProfileView, Router, SC_Activities, SC_Activity, SC_Application, SC_Applications, SC_Comment, SC_Comments, SC_Group, SC_Groups, SC_Playlist, SC_Playlists, SC_Track, SC_Tracks, SC_User, SC_Users, SC_WebProfile, SC_WebProfiles, SearchView, Session, SettingsView, SoundCloudCollection, SoundCloudModel, SplashView, StreamView, TAG_REGEX, URL_REGEX, User, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref3, _ref30, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  URL_REGEX = /((http\:\/\/|https\:\/\/|ftp\:\/\/)|(www\.))+(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;

  EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;

  TAG_REGEX = /#[a-z0-9_]+/gi;

  MENTION_REGEX = /@[a-z0-9_]+/gi;

  _ref = (function() {
    var version_details, _ref, _ref1, _ref2, _ref3;
    version_details = (_ref = ((_ref1 = ((_ref2 = navigator.appVersion) != null ? _ref2 : "").match(/(\(| )([^;]+)/gi)) != null ? _ref1 : ["", ""])[1]) != null ? _ref : "";
    version_details = version_details.toLowerCase().slice(1);
    return [version_details.indexOf("msie") > -1, parseInt((_ref3 = version_details.split(" ", 2)[1]) != null ? _ref3 : "0")];
  })(), IS_IE = _ref[0], IE_VERSION = _ref[1];

  IS_SAFARI = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

  IS_PHONE = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);

  IS_TABLET = navigator.userAgent.match(/iPad/i);

  IS_MOBILE = IS_PHONE || IS_TABLET;

  DESCENDING_ID_COMPARATOR = function(model_a, model_b) {
    var a_id, b_id, _ref1, _ref2;
    a_id = parseInt((_ref1 = model_a.get("id")) != null ? _ref1 : -1);
    b_id = parseInt((_ref2 = model_b.get("id")) != null ? _ref2 : -1);
    if (a_id > b_id) {
      return -1;
    }
    if (a_id < b_id) {
      return 1;
    }
    return 0;
  };

  ko.extenders["errorable"] = function(target, options) {
    target.error = ko.observable("");
    target.has_error = ko.computed(function() {
      var err;
      err = target.error();
      if (!_.isString(err)) {
        err = "";
      }
      return _.trim(err).length > 0;
    });
    target.clear_error = function() {
      return target.error("");
    };
    return target;
  };

  ko.extenders['resetAfter'] = function(target, duration) {
    var originalValue;
    originalValue = ko.utils.unwrapObservable(target);
    target.subscribe(function(value) {
      if (value === originalValue) {
        return;
      }
      return setTimeout((function() {
        return target(originalValue);
      }), duration);
    });
    return target;
  };

  ko.extenders["validateable"] = function(target, options) {
    var _error, _is_valid;
    _error = ko.observable("");
    _is_valid = ko.observable(false);
    target.error = ko.computed({
      read: function() {
        return _error();
      },
      write: function(value) {
        value = _.trim((value != null ? value : "").toString());
        if (!_.isEmpty(value)) {
          _is_valid(false);
        }
        return _error(value);
      }
    });
    target.has_error = ko.computed(function() {
      return target.error().length > 0;
    });
    target.is_valid = ko.computed({
      read: function() {
        return !target.has_error() && _is_valid();
      },
      write: function(value) {
        if (value === true) {
          target.error("");
        }
        return _is_valid(value);
      }
    });
    target.clearValidations = function() {
      target.error("");
      return _is_valid(false);
    };
    return target;
  };

  this.Helpers = Helpers = {
    escapeHTML: function(html) {
      if (!_.isString(html)) {
        html = "";
      }
    },
    removeEntityHtmlFromText: function(html) {
      html = $("<div/>").html(html).text();
      return html.replace(/<[^>]+>/gi, " ");
    },
    replaceHtmlEntitiesWithText: function(text) {
      text = ko.unwrap(text);
      text = text.replace("&nbsp;", " ");
      text = text.replace("&lt;", "<");
      text = text.replace("&gt;", ">");
      text = text.replace("&amp;", "&");
      return text;
    },
    concat: function() {
      var arg, ret, _i, _len;
      ret = "";
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        ret += ko.unwrap(arg);
      }
      return ret;
    },
    'isEmail': function(emailStr) {
      emailStr = ko.unwrap(emailStr);
      if (!_.isString(emailStr)) {
        emailStr = "";
      }
      emailStr = _.trim(emailStr);
      return new RegExp(EMAIL_REGEX).test(emailStr);
    },
    'isUrl': function(urlStr) {
      urlStr = ko.unwrap(urlStr);
      if (!_.isString(urlStr)) {
        urlStr = "";
      }
      urlStr = _.trim(urlStr);
      return new RegExp(URL_REGEX).test(urlStr);
    },
    /*
    		* t500x500:     500×500
    		* crop:         400×400
    		* t300x300:     300×300
    		* large:        100×100 (default)
    		* t67x67:       67×67    (only on artworks)
    		* badge:        47×47
    		* small:        32×32
    		* tiny:         20×20    (on artworks)
    		* tiny:         18×18    (on avatars)
    		* mini:         16×16
    		* original:     (originally uploaded image)
    */

    resizeImage: function(avatar_url, size) {
      var _ref1;
      avatar_url = (_ref1 = ko.unwrap(avatar_url)) != null ? _ref1 : "";
      return avatar_url.replace("-large.", "-" + size + ".");
    },
    formatCreditCardNumber: function(cc_number) {
      cc_number = ko.unwrap(cc_number);
      cc_number = _.trim((cc_number != null ? cc_number : "").toString());
      cc_number = cc_number.replace(/[^0-9]/gi, "").slice(0, 16);
      cc_number = _.trim([cc_number.slice(0, 4), cc_number.slice(4, 8), cc_number.slice(8, 12), cc_number.slice(12, 16)].join(" ")).replace(/\s+/gi, "-");
      return cc_number;
    },
    creditCardImageUrl: function(card_type) {
      card_type = ko.unwrap(card_type);
      if (!_.isString(card_type)) {
        card_type = "";
      }
      card_type = _.trim(card_type).toLowerCase();
      if (card_type === "visa") {
        return "/images/cards/visa.png";
      }
      if (card_type === "mastercard") {
        return "/images/cards/mastercard.png";
      }
      if (card_type === "discover") {
        return "/images/cards/discover.png";
      }
      if (card_type === "american express") {
        return "/images/cards/amex.png";
      }
      if (card_type === "jcb") {
        return "/images/cards/jcb.png";
      }
      if (card_type === "diners club") {
        return "/images/cards/diners.png";
      }
      return "/images/cards/credit.png";
    },
    formatNumber: function(number, format) {
      number = ko.unwrap(number);
      if (format == null) {
        format = '0,0';
      }
      return numeral(number).format(format);
    }
  };

  _.mixin({
    trim: function(str) {
      if (str == null) {
        return "";
      }
      return str.toString().replace(/^\s+/, '').replace(/\s+$/, '');
    }
  });

  ko.subscribable.fn.classify = function() {
    var extenders, identifier, identifiers, _i, _len;
    identifiers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    extenders = {};
    for (_i = 0, _len = identifiers.length; _i < _len; _i++) {
      identifier = identifiers[_i];
      if (_.isString(identifier) && !_.isEmpty(identifier)) {
        extenders[identifier] = true;
      }
    }
    return this.extend(extenders);
  };

  SoundCloudModel = (function(_super) {
    __extends(SoundCloudModel, _super);

    function SoundCloudModel() {
      _ref1 = SoundCloudModel.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    SoundCloudModel.prototype.makeUrl = function(type, parent, id) {
      var original_base_api_url, url;
      original_base_api_url = Falcon.baseApiUrl;
      Falcon.baseApiUrl = "";
      url = SoundCloudModel.__super__.makeUrl.call(this, type, parent, id);
      Falcon.baseApiUrl = original_base_api_url;
      return url;
    };

    SoundCloudModel.prototype.sync = function(type, options, context) {
      var callback, method, url, _ref2,
        _this = this;
      if (!_.isString(type)) {
        type = "GET";
      }
      type = _.trim(type).toUpperCase();
      if (type !== "GET" && type !== "POST" && type !== "PUT" && type !== "DELETE") {
        type = "GET";
      }
      if (context == null) {
        context = this;
      }
      if (options == null) {
        options = {};
      }
      if (options.fill == null) {
        options.fill = true;
      }
      if (options.success == null) {
        options.success = (function() {});
      }
      if (options.error == null) {
        options.error = (function() {});
      }
      if (options.complete == null) {
        options.complete = (function() {});
      }
      if (options.params == null) {
        options.params = {};
      }
      if (options.access_token != null) {
        SC.accessToken(options.access_token);
      }
      url = (_ref2 = options.url) != null ? _ref2 : this.makeUrl(type, this.parent);
      callback = function(data, error) {
        var parsed_data;
        parsed_data = _this.parse(data, options);
        if (options.fill) {
          _this.fill(parsed_data);
        }
        if (error) {
          options.error.call(context, _this, data, error);
        } else {
          options.success.call(context, _this, data);
        }
        return options.complete.call(context, _this, data);
      };
      switch (type) {
        case "GET":
          method = 'get';
          break;
        case "POST":
          method = 'post';
          break;
        case "PUT":
          method = 'put';
          break;
        case "DELETE":
          method = 'delete';
      }
      return SC[method](url, options.params, callback);
    };

    return SoundCloudModel;

  })(Falcon.Model);

  Donation = (function(_super) {
    __extends(Donation, _super);

    function Donation() {
      _ref2 = Donation.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Donation.prototype.url = 'donation';

    Donation.prototype.defaults = {
      "amount": 0,
      "frequency": "once",
      "soundcloud_user_id": "",
      "balanced_card_uri": null
    };

    Donation.prototype.validate = function() {
      var amount, frequency;
      amount = this.get('amount');
      if (!(_.isNumber(amount) && amount > 0)) {
        return false;
      }
      frequency = this.get('frequency');
      if (frequency !== "once" && frequency !== "weekly") {
        return false;
      }
      return true;
    };

    return Donation;

  })(Falcon.Model);

  Session = (function(_super) {
    __extends(Session, _super);

    function Session() {
      _ref3 = Session.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Session.prototype.url = 'session';

    Session.prototype.defaults = {
      "soundcloud_access_token": ""
    };

    Session.prototype.makeUrl = function() {
      return (Falcon.baseApiUrl + "/" + this.url).replace(/([^:])\/\//gi, "$1/");
    };

    Session.prototype.toUser = function() {
      var user;
      user = new User(this.serialize());
      user.sc_user.url = "/me";
      user.sc_user.makeUrl = function() {
        return this.url;
      };
      user.sc_user.activities = new SC_Activities(user.sc_user);
      return user;
    };

    return Session;

  })(Falcon.Model);

  SC_Activity = (function(_super) {
    __extends(SC_Activity, _super);

    function SC_Activity() {
      _ref4 = SC_Activity.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    SC_Activity.prototype.url = "activities";

    SC_Activity.prototype.defaults = {
      'tags': '',
      'type': '',
      'created_at': null,
      'track': function() {
        return new SC_Track;
      },
      'playlist': function() {
        return new SC_Playlist;
      },
      'user': function() {
        return new SC_User;
      }
    };

    SC_Activity.prototype.parse = function(data) {
      var ret;
      ret = {
        'created_at': data['created_at'],
        'tags': data['tags'],
        'type': data['type']
      };
      if (data.type === 'track') {
        ret['track'] = data['origin'];
      } else if (data.type === 'playlist') {
        ret['playlist'] = data['origin'];
      } else if (data.type === 'favoriting') {
        ret['user'] = data['origin']['user'];
        ret['track'] = data['origin']['track'];
      }
      return ret;
    };

    return SC_Activity;

  })(SoundCloudModel);

  SC_Application = (function(_super) {
    __extends(SC_Application, _super);

    function SC_Application() {
      _ref5 = SC_Application.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    SC_Application.prototype.url = "apps";

    return SC_Application;

  })(SoundCloudModel);

  SC_Comment = (function(_super) {
    __extends(SC_Comment, _super);

    function SC_Comment() {
      _ref6 = SC_Comment.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    SC_Comment.prototype.url = "comments";

    return SC_Comment;

  })(SoundCloudModel);

  SC_Group = (function(_super) {
    __extends(SC_Group, _super);

    function SC_Group() {
      _ref7 = SC_Group.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    SC_Group.prototype.url = "groups";

    return SC_Group;

  })(SoundCloudModel);

  SC_Playlist = (function(_super) {
    __extends(SC_Playlist, _super);

    function SC_Playlist() {
      _ref8 = SC_Playlist.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    SC_Playlist.prototype.url = "playlists";

    return SC_Playlist;

  })(SoundCloudModel);

  SC_Track = (function(_super) {
    var _currently_playing_track;

    __extends(SC_Track, _super);

    function SC_Track() {
      _ref9 = SC_Track.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    SC_Track.prototype.url = "tracks";

    _currently_playing_track = null;

    SC_Track.stopCurrent = function() {
      if (!(_currently_playing_track instanceof SC_Track)) {
        return;
      }
      _currently_playing_track.stop();
      return _currently_playing_track = null;
    };

    SC_Track.setCurrentlyPlaying = function(track) {
      this.stopCurrent();
      if (!(track instanceof SC_Track)) {
        return;
      }
      return _currently_playing_track = track;
    };

    SC_Track.prototype["is_playing"] = false;

    SC_Track.prototype["sound"] = null;

    SC_Track.prototype.defaults = {
      "created_at": null,
      "title": "",
      "permalink_url": "",
      "sharing": "",
      "embeddable_by": "",
      "purchase_url": "",
      "artwork_url": "",
      "description": "",
      "duration": 0,
      "genre": "",
      "shared_to_count": 0,
      "release": 0,
      "release_day": 0,
      "release_month": 0,
      "release_year": 0,
      "streamable": false,
      "downloadable": false,
      "state": "",
      "license": "",
      "track_type": "",
      "waveform_url": "",
      "download_url": "",
      "stream_url": "",
      "video_url": "",
      "bpm": 0,
      "commentable": false,
      "isrc": "",
      "key_signature": "",
      "comment_count": 0,
      "download_count": 0,
      "playback_count": 0,
      "favoritings_count": 0,
      "original_format": "",
      "original_content_size": 0,
      "user_favorite": false,
      "user": function() {
        return new SC_User;
      },
      "label": function() {
        return new SC_User;
      },
      "created_with": function() {
        return new SC_Application;
      },
      "comments": function() {
        return new SC_Comments(this);
      },
      "favorites": function() {
        return new SC_Users(this);
      },
      "shared_to": function() {
        var shared_to;
        shared_to = new SC_Users(this);
        shared_to.url = "shared-to/users";
        return shared_to;
      }
    };

    SC_Track.prototype.observables = {
      "is_playing": false
    };

    SC_Track.prototype.togglePlay = function() {
      if (this.is_playing) {
        return this.stop();
      } else {
        return this.play;
      }
    };

    SC_Track.prototype.play = function() {
      var _this = this;
      if (this.is_playing()) {
        return;
      }
      if (this.sound) {
        return this.sound.play();
      }
      return SC.stream("/tracks/" + (this.get('id')), function(sound, error) {
        console.log(error);
        SC_Track.setCurrentlyPlaying(_this);
        _this.sound = sound;
        _this.sound.play();
        return _this.is_playing(true);
      });
    };

    SC_Track.prototype.stop = function() {
      if (!this.is_playing()) {
        return;
      }
      this.sound.stop();
      return this.is_playing(false);
    };

    return SC_Track;

  })(SoundCloudModel);

  SC_User = (function(_super) {
    __extends(SC_User, _super);

    function SC_User() {
      _ref10 = SC_User.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    SC_User.prototype.url = "users";

    SC_User.prototype.defaults = {
      "username": "",
      "permalink_url": "",
      "avatar_url": "",
      "country": "",
      "full_name": "",
      "city": "",
      "description": "",
      "website": "",
      "website_title": "",
      "track_count": 0,
      "playlist_count": 0,
      "followers_count": 0,
      "followings_count": 0,
      "public_favorites_count": 0,
      "tracks": function() {
        return new SC_Tracks(this);
      },
      "playlists": function() {
        return new SC_Playlists(this);
      },
      "followers": function() {
        var followers;
        followers = new SC_Users(this);
        followers.url = "followers";
        return followers;
      },
      "followings": function() {
        var followings;
        followings = new SC_Users(this);
        followings.url = "followings";
        return followings;
      },
      "comments": function() {
        return new SC_Comments(this);
      },
      "favorites": function() {
        var favorites;
        favorites = new SC_Tracks(this);
        favorites.url = "favorites";
        return favorites;
      },
      "groups": function() {
        return new SC_Groups(this);
      },
      "web-profiles": function() {
        return new SC_WebProfiles(this);
      }
    };

    SC_User.prototype.fetchByUsername = function(options) {
      if (_.isFunction(options)) {
        options = {
          complete: options
        };
      }
      if (!_.isObject(options)) {
        options = {};
      }
      options.url = this.makeUrl("GET", this.parent, this.get("username"));
      return this.fetch(options);
    };

    return SC_User;

  })(SoundCloudModel);

  SC_WebProfile = (function(_super) {
    __extends(SC_WebProfile, _super);

    function SC_WebProfile() {
      _ref11 = SC_WebProfile.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    SC_WebProfile.prototype.url = "web-profiles";

    return SC_WebProfile;

  })(SoundCloudModel);

  User = (function(_super) {
    __extends(User, _super);

    function User() {
      _ref12 = User.__super__.constructor.apply(this, arguments);
      return _ref12;
    }

    User.prototype.url = "user";

    User.prototype.defaults = {
      "soundcloud_access_token": "",
      "soundcloud_id": "",
      "balanced_card_uri": "",
      "balanced_customer_uri": "",
      "balanced_bank_account_uri": "",
      "card_last_4": "",
      "card_type": "",
      "card_expiration_month": 0,
      "card_expiration_year": 0,
      "bank_name": "",
      "bank_account_number": "",
      "full_name": "",
      "avatar_url": "",
      "created_at": null,
      "updated_at": null,
      "sc_user": function() {
        return new SC_User;
      }
    };

    return User;

  })(Falcon.Model);

  SoundCloudCollection = (function(_super) {
    __extends(SoundCloudCollection, _super);

    function SoundCloudCollection() {
      _ref13 = SoundCloudCollection.__super__.constructor.apply(this, arguments);
      return _ref13;
    }

    SoundCloudCollection.prototype['limit'] = 50;

    SoundCloudCollection.prototype.makeUrl = function(type, parent) {
      var original_base_api_url, url;
      original_base_api_url = Falcon.baseApiUrl;
      Falcon.baseApiUrl = "";
      url = SoundCloudCollection.__super__.makeUrl.call(this, type, parent);
      Falcon.baseApiUrl = original_base_api_url;
      return url;
    };

    SoundCloudCollection.prototype.sync = function(type, options, context) {
      return SoundCloudModel.prototype.sync.call(this, type, options, context);
    };

    SoundCloudCollection.prototype.search = function(params, options) {
      if (_.isString(params)) {
        params = {
          'q': params
        };
      }
      if (!_.isObject(params)) {
        params = {};
      }
      if (params.limit == null) {
        params.limit = this.limit;
      }
      if (_.isFunction(options)) {
        options = {
          success: options
        };
      }
      if (!_.isObject(options)) {
        options = {};
      }
      options.params = params;
      return this.fetch(options);
    };

    return SoundCloudCollection;

  })(Falcon.Collection);

  SC_Activities = (function(_super) {
    __extends(SC_Activities, _super);

    function SC_Activities() {
      _ref14 = SC_Activities.__super__.constructor.apply(this, arguments);
      return _ref14;
    }

    SC_Activities.prototype.model = SC_Activity;

    SC_Activities.prototype.parse = function(data) {
      var item;
      return (function() {
        var _i, _len, _ref15, _ref16, _results;
        _ref16 = (_ref15 = data.collection) != null ? _ref15 : [];
        _results = [];
        for (_i = 0, _len = _ref16.length; _i < _len; _i++) {
          item = _ref16[_i];
          _results.push(SC_Activity.prototype.parse(item));
        }
        return _results;
      })();
    };

    SC_Activities.prototype.fetchTracks = function() {
      var args, original_url, ret;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      original_url = this.url;
      this.url = "activities/tracks";
      ret = this.fetch.apply(this, args);
      this.url = original_url;
      return ret;
    };

    return SC_Activities;

  })(SoundCloudCollection);

  SC_Applications = (function(_super) {
    __extends(SC_Applications, _super);

    function SC_Applications() {
      _ref15 = SC_Applications.__super__.constructor.apply(this, arguments);
      return _ref15;
    }

    SC_Applications.prototype.model = SC_Application;

    return SC_Applications;

  })(Falcon.Collection);

  SC_Comments = (function(_super) {
    __extends(SC_Comments, _super);

    function SC_Comments() {
      _ref16 = SC_Comments.__super__.constructor.apply(this, arguments);
      return _ref16;
    }

    SC_Comments.prototype.model = SC_Comment;

    return SC_Comments;

  })(SoundCloudCollection);

  SC_Groups = (function(_super) {
    __extends(SC_Groups, _super);

    function SC_Groups() {
      _ref17 = SC_Groups.__super__.constructor.apply(this, arguments);
      return _ref17;
    }

    SC_Groups.prototype.model = SC_Group;

    return SC_Groups;

  })(SoundCloudCollection);

  SC_Playlists = (function(_super) {
    __extends(SC_Playlists, _super);

    function SC_Playlists() {
      _ref18 = SC_Playlists.__super__.constructor.apply(this, arguments);
      return _ref18;
    }

    SC_Playlists.prototype.model = SC_Playlist;

    return SC_Playlists;

  })(SoundCloudCollection);

  SC_Tracks = (function(_super) {
    __extends(SC_Tracks, _super);

    function SC_Tracks() {
      _ref19 = SC_Tracks.__super__.constructor.apply(this, arguments);
      return _ref19;
    }

    SC_Tracks.prototype.model = SC_Track;

    return SC_Tracks;

  })(SoundCloudCollection);

  SC_Users = (function(_super) {
    __extends(SC_Users, _super);

    function SC_Users() {
      _ref20 = SC_Users.__super__.constructor.apply(this, arguments);
      return _ref20;
    }

    SC_Users.prototype.model = SC_User;

    return SC_Users;

  })(SoundCloudCollection);

  SC_WebProfiles = (function(_super) {
    __extends(SC_WebProfiles, _super);

    function SC_WebProfiles() {
      _ref21 = SC_WebProfiles.__super__.constructor.apply(this, arguments);
      return _ref21;
    }

    SC_WebProfiles.prototype.model = SC_WebProfile;

    return SC_WebProfiles;

  })(SoundCloudCollection);

  ApplicationView = (function(_super) {
    var _connect_options;

    __extends(ApplicationView, _super);

    function ApplicationView() {
      _ref22 = ApplicationView.__super__.constructor.apply(this, arguments);
      return _ref22;
    }

    ApplicationView.prototype.url = '#application-tmpl';

    _connect_options = {};

    ApplicationView.prototype.defaults = {
      'splash_view': function() {
        return new SplashView;
      }
    };

    ApplicationView.prototype.observables = {
      'current_user': null,
      'content_view': null,
      'modal_view': null,
      'is_logged_in': false,
      'is_checking_session': false,
      'is_connecting': false,
      'is_showing_modal': false,
      'is_dashboard_selected': function() {
        return this.content_view() instanceof DashboardView;
      },
      'is_stream_selected': function() {
        return this.content_view() instanceof StreamView;
      },
      'is_settings_selected': function() {
        return this.content_view() instanceof SettingsView;
      },
      'is_search_selected': function() {
        return this.content_view() instanceof SearchView;
      },
      'search_query': ''
    };

    ApplicationView.prototype.checkSession = function() {
      var _this = this;
      if (this.is_checking_session()) {
        return;
      }
      this.is_checking_session(true);
      return (new Session).fetch({
        success: function(session, data) {
          return _this.login(session);
        },
        error: function(session) {
          return _this.is_checking_session(false);
        }
      });
    };

    ApplicationView.prototype.login = function(session) {
      var access_token, user,
        _this = this;
      if (!(session instanceof Session)) {
        return;
      }
      if (_.isEmpty(access_token = session.get("soundcloud_access_token"))) {
        return false;
      }
      user = session.toUser();
      SC.accessToken(access_token);
      return user.sc_user.fetch({
        'access_token': access_token,
        success: function(sc_user) {
          user.sc_user.fill(user.sc_user.unwrap());
          _this.current_user(user);
          _this.is_logged_in(true);
          return _this.notifySubscribers();
        },
        complete: function() {
          return _this.is_checking_session(false);
        }
      });
    };

    ApplicationView.prototype.logout = function() {
      var _this = this;
      if (!this.is_logged_in()) {
        return;
      }
      return (new Session).destroy({
        success: function() {
          _this.current_user(null);
          SC.accessToken(null);
          _this.is_logged_in(false);
          return _this.notifySubscribers();
        }
      });
    };

    ApplicationView.prototype.connect = function(options) {
      var dialog;
      this.is_connecting(true);
      if (_.isFunction(options)) {
        options = {
          success: options
        };
      }
      if (options == null) {
        options = {};
      }
      if (options.success == null) {
        options.success = (function() {});
      }
      if (options.error == null) {
        options.error = (function() {});
      }
      if (options.complete == null) {
        options.complete = (function() {});
      }
      _connect_options = options;
      dialog = SC.connect(function() {});
      setTimeout(function() {
        if (_connect_options !== options) {
          return;
        }
        dialog.options.window.close();
        _connect_options.error("timeout", "Connect timed out");
        _connect_options.complete();
        return _connect_options = null;
      }, 30000);
      return {
        abort: function() {
          if (_connect_options !== options) {
            return;
          }
          _connect_options.error("abortted", "User canceled request");
          _connect_options.complete();
          return _connect_options = null;
        }
      };
    };

    ApplicationView.prototype.connectResponse = function(status, params) {
      if (!this.is_connecting()) {
        return;
      }
      this.is_connecting(false);
      if (status === "success") {
        SC.connectCallback();
        _connect_options.success(SC.accessToken());
        _connect_options.complete();
        return _connect_options = null;
      } else {
        _connect_options.error(params['error'], params['error_description']);
        _connect_options.complete();
        _connect_options = null;
        return SC.connectCallback();
      }
    };

    ApplicationView.prototype.setContentView = function(view) {
      if (!Falcon.isView(view)) {
        return null;
      }
      this.content_view(view);
      return view;
    };

    ApplicationView.prototype.notifySubscribers = function() {
      var content_view;
      if (!Falcon.isView(content_view = this.content_view())) {
        return;
      }
      return this.trigger("update:user", this.current_user());
    };

    ApplicationView.prototype.searchSubmit = function() {
      this.search(this.search_query());
      return false;
    };

    ApplicationView.prototype.search = function(query) {
      if (_.isEmpty(query)) {
        return this.search_query("");
      } else {
        if (query == null) {
          query = "";
        }
        if (!_.isString(query)) {
          query = this.search_query();
        }
        query = _.trim(query);
        this.search_query(query);
        return Router.gotoSearch({
          query: query
        });
      }
    };

    ApplicationView.prototype.showModal = function(view) {
      if (!Falcon.isView(view)) {
        return;
      }
      this.modal_view(view);
      return this.is_showing_modal(true);
    };

    ApplicationView.prototype.hideModal = function() {
      return this.is_showing_modal(false);
    };

    return ApplicationView;

  })(Falcon.View);

  CreditCardWidget = (function(_super) {
    __extends(CreditCardWidget, _super);

    function CreditCardWidget() {
      _ref23 = CreditCardWidget.__super__.constructor.apply(this, arguments);
      return _ref23;
    }

    CreditCardWidget.prototype.url = '#credit_card_widget-tmpl';

    CreditCardWidget.prototype.observables = {
      'credit_card_type': '',
      'credit_card_expiration_month': '',
      'credit_card_expiration_year': '',
      'credit_card_cvc': '',
      '_credit_card_number': '',
      'credit_card_number': {
        read: function() {
          return Helpers.formatCreditCardNumber(this._credit_card_number);
        },
        write: function(number) {
          return this._credit_card_number(number);
        }
      },
      'credit_card_expiration': {
        read: function() {
          var month, year, _ref24, _ref25;
          year = _.trim((_ref24 = ko.unwrap(this.credit_card_expiration_year)) != null ? _ref24 : "");
          month = _.trim((_ref25 = ko.unwrap(this.credit_card_expiration_month)) != null ? _ref25 : "");
          if (_.isEmpty(year) || _.isEmpty(month)) {
            return '';
          }
          return "" + month + "/" + year;
        },
        write: function(value) {
          var month, year, _ref24;
          value = _.trim(value != null ? value : "");
          _ref24 = value.split("/"), month = _ref24[0], year = _ref24[1];
          month = _.trim(month != null ? month : "");
          year = _.trim(year != null ? year : "");
          if (year.length === 2) {
            year = "20" + year;
          }
          if (month.length === 1) {
            month = "0" + month;
          }
          year = year.slice(0, 4);
          month = month.slice(0, 2);
          console.log(month, year);
          this.credit_card_expiration_month(month);
          return this.credit_card_expiration_year(year);
        }
      }
    };

    CreditCardWidget.prototype.initialize = function() {
      var _this = this;
      this.credit_card_number.classify("validateable");
      this.credit_card_expiration.classify("validateable");
      this.credit_card_cvc.classify("validateable");
      ko.computed(function() {
        var is_valid, number;
        number = _this.credit_card_number();
        is_valid = balanced.card.isCardNumberValid(number);
        _this.credit_card_number.is_valid(is_valid);
        return _this.credit_card_type(is_valid ? balanced.card.cardType(number) : "");
      });
      ko.computed(function() {
        var month, year;
        _this.credit_card_expiration();
        month = _this.credit_card_expiration_month.peek();
        year = _this.credit_card_expiration_year.peek();
        return _this.credit_card_expiration.is_valid(balanced.card.isExpiryValid(month, year));
      });
      return ko.computed(function() {
        var cvc, number;
        number = _this.credit_card_number();
        cvc = _this.credit_card_cvc();
        return _this.credit_card_cvc.is_valid(balanced.card.isSecurityCodeValid(number, cvc));
      });
    };

    CreditCardWidget.prototype.resetFields = function() {
      this.credit_card_number("");
      this.credit_card_expiration("");
      return this.credit_card_cvc("");
    };

    CreditCardWidget.prototype.clearValidations = function() {
      this.credit_card_number.clearValidations();
      this.credit_card_expiration.clearValidations();
      return this.credit_card_cvc.clearValidations();
    };

    CreditCardWidget.prototype.hasError = function() {
      return this.credit_card_number.has_error() || this.credit_card_expiration.has_error() || this.credit_card_cvc.has_error();
    };

    CreditCardWidget.prototype.createCardOnBalanced = function(options) {
      var credit_card_cvc, credit_card_expiration_month, credit_card_expiration_year, credit_card_number,
        _this = this;
      if (_.isFunction(options)) {
        options = {
          complete: options
        };
      }
      if (!_.isObject(options)) {
        options = {};
      }
      if (options.success == null) {
        options.success = (function() {});
      }
      if (options.error == null) {
        options.error = (function() {});
      }
      if (options.complete == null) {
        options.complete = (function() {});
      }
      credit_card_number = this.credit_card_number();
      credit_card_cvc = this.credit_card_cvc();
      credit_card_expiration_month = this.credit_card_expiration_month();
      credit_card_expiration_year = this.credit_card_expiration_year();
      console.log("This: ", credit_card_expiration_month, credit_card_expiration_year);
      if (!balanced.card.isCardNumberValid(credit_card_number)) {
        this.credit_card_number.error("Please enter a valid credit card number.");
      }
      if (!balanced.card.isExpiryValid(credit_card_expiration_month, credit_card_expiration_year)) {
        this.credit_card_expiration.error("Please enter a valid expiration date.");
      }
      if (!balanced.card.isSecurityCodeValid(credit_card_number, credit_card_cvc)) {
        this.credit_card_cvc.error("Please enter a valid CVC Number.");
      }
      if (this.hasError()) {
        options.error();
        options.complete();
        return;
      }
      this.credit_card_number.is_valid(true);
      this.credit_card_expiration.is_valid(true);
      this.credit_card_cvc.is_valid(true);
      return balanced.card.create({
        'card_number': credit_card_number,
        'expiration_month': credit_card_expiration_month,
        'expiration_year': credit_card_expiration_year,
        'security_code': credit_card_cvc
      }, function(response) {
        switch (response.status) {
          case 201:
            options.success(response.data.uri);
            break;
          default:
            options.error();
        }
        return options.complete();
      });
    };

    return CreditCardWidget;

  })(Falcon.View);

  DashboardView = (function(_super) {
    __extends(DashboardView, _super);

    function DashboardView() {
      _ref24 = DashboardView.__super__.constructor.apply(this, arguments);
      return _ref24;
    }

    DashboardView.prototype.url = "#dashboard-tmpl";

    DashboardView.prototype.observables = {
      "current_user": null
    };

    DashboardView.prototype.display = function() {
      Application.on("update:user", this.updateCurrentUser, this);
      return this.updateCurrentUser(Application.current_user());
    };

    DashboardView.prototype.dispose = function() {
      return Application.off("update:user", this.updateCurrentUser);
    };

    DashboardView.prototype.updateCurrentUser = function(user) {
      if (user === this.current_user()) {
        return;
      }
      this.current_user(user);
      return this.fetchInformation();
    };

    DashboardView.prototype.fetchInformation = function() {
      var current_user;
      if (!((current_user = this.current_user()) instanceof User)) {

      }
    };

    return DashboardView;

  })(Falcon.View);

  NewDonationView = (function(_super) {
    __extends(NewDonationView, _super);

    function NewDonationView() {
      _ref25 = NewDonationView.__super__.constructor.apply(this, arguments);
      return _ref25;
    }

    NewDonationView.prototype.url = '#new_donation-tmpl';

    NewDonationView.prototype.defaults = {
      'sc_user': function(sc_user) {
        return ko.unwrap(sc_user);
      },
      'credit_card_widget': function() {
        return new CreditCardWidget;
      },
      'donation': function() {
        return new Donation;
      }
    };

    NewDonationView.prototype.observables = {
      'alert': null,
      'current_user': null,
      'is_loading': false,
      'is_saving': false,
      'is_showing_new_credit_card': false,
      'is_showing_success': false,
      'donation_amount': null,
      'donation_frequency': 'once',
      'donation_message': '',
      'is_donation_anonymous': false,
      'is_frequency_once': function() {
        return this.donation_frequency() === 'once';
      },
      'is_frequency_weekly': function() {
        return this.donation_frequency() === 'weekly';
      }
    };

    NewDonationView.prototype.initialize = function() {
      return this.alert.classify("validateable");
    };

    NewDonationView.prototype.display = function() {
      Application.on("update:user", this.updateCurrentUser, this);
      return this.updateCurrentUser(Application.current_user());
    };

    NewDonationView.prototype.dispose = function() {
      return Application.off("update:user", this.updateCurrentUser);
    };

    NewDonationView.prototype.updateCurrentUser = function(user) {
      if (user === this.current_user()) {
        return;
      }
      this.current_user(user);
      return this.is_showing_new_credit_card(_.isEmpty(user.get('balanced_card_uri')));
    };

    NewDonationView.prototype.setFrequencyToOnce = function() {
      return this.donation_frequency("once");
    };

    NewDonationView.prototype.setFrequencyToWeekly = function() {
      return this.donation_frequency("weekly");
    };

    NewDonationView.prototype.showNewCreditCard = function() {
      return this.is_showing_new_credit_card(true);
    };

    NewDonationView.prototype.setIsAnonymous = function() {
      return this.is_donation_anonymous(true);
    };

    NewDonationView.prototype.setIsntAnonymous = function() {
      return this.is_donation_anonymous(false);
    };

    NewDonationView.prototype.cancelDonation = function() {
      if (this.is_saving()) {
        return false;
      }
      this.trigger("cancel");
      return false;
    };

    NewDonationView.prototype.createDonation = function() {
      var amount, current_user, donation, frequency, is_anonymous, message, soundcloud_user_id, _saveCardToUser, _saveDonation,
        _this = this;
      if (!((current_user = this.current_user()) instanceof User)) {
        return false;
      }
      if (this.is_saving()) {
        return false;
      }
      amount = parseFloat(this.donation_amount());
      frequency = this.donation_frequency();
      message = this.donation_message();
      is_anonymous = this.is_donation_anonymous();
      soundcloud_user_id = this.sc_user.get('id');
      donation = new Donation({
        amount: amount,
        frequency: frequency,
        message: message,
        is_anonymous: is_anonymous,
        soundcloud_user_id: soundcloud_user_id
      });
      this.is_saving(true);
      _saveDonation = function() {
        return donation.create({
          complete: function() {
            return _this.is_saving(false);
          },
          success: function(donation) {
            _this.donation.fill(donation.unwrap());
            return _this.is_showing_success(true);
          }
        });
      };
      _saveCardToUser = function(balanced_card_uri) {
        return current_user.clone(["id"]).set({
          balanced_card_uri: balanced_card_uri
        }).save({
          attributes: ["balanced_card_uri"],
          success: function(user) {
            current_user.fill(user.unwrap());
            return _saveDonation();
          },
          error: function() {
            _this.alert.error("Error while saving credit card information");
            return _this.is_saving(false);
          }
        });
      };
      if (this.is_showing_new_credit_card()) {
        this.credit_card_widget.createCardOnBalanced({
          success: _saveCardToUser,
          error: function() {
            return _this.is_saving(false);
          }
        });
      } else {
        _saveDonation();
      }
      return false;
    };

    return NewDonationView;

  })(Falcon.View);

  ProfileView = (function(_super) {
    __extends(ProfileView, _super);

    function ProfileView() {
      _ref26 = ProfileView.__super__.constructor.apply(this, arguments);
      return _ref26;
    }

    ProfileView.prototype.url = '#profile-tmpl';

    ProfileView.prototype.defaults = {
      "user": function(sc_id) {
        var user;
        user = new User;
        user.sc_user.set("id", sc_id);
        return user;
      }
    };

    ProfileView.prototype.observables = {
      "current_user": null,
      "viewing_user": function() {
        if (this.user.sc_user.isNew()) {
          return this.current_user();
        } else {
          return this.user;
        }
      },
      "is_loading": false,
      "has_error": false
    };

    ProfileView.prototype.display = function() {
      Application.on("update:user", this.updateCurrentUser, this);
      return this.updateCurrentUser(Application.current_user());
    };

    ProfileView.prototype.dispose = function() {
      return Application.off("update:user", this.updateCurrentUser);
    };

    ProfileView.prototype.updateCurrentUser = function(user) {
      if (user === this.current_user()) {
        return;
      }
      this.current_user(user);
      return this.fetchInformation();
    };

    ProfileView.prototype.fetchInformation = function() {
      var current_user,
        _this = this;
      if (!((current_user = this.current_user()) instanceof User)) {
        return;
      }
      if (this.is_loading()) {
        return;
      }
      if (current_user.equals(this.viewing_user)) {
        return;
      }
      this.is_loading(true);
      return this.user.sc_user.fetch({
        complete: function() {
          return _this.is_loading(false);
        },
        success: function() {
          return _this.has_error(false);
        },
        error: function() {
          return _this.has_error(true);
        }
      });
    };

    ProfileView.prototype.donate = function() {
      var view;
      view = new NewDonationView(this.user.sc_user);
      view.on("cancel", function() {
        return Application.hideModal();
      });
      return Application.showModal(view);
    };

    return ProfileView;

  })(Falcon.View);

  SearchView = (function(_super) {
    __extends(SearchView, _super);

    function SearchView() {
      _ref27 = SearchView.__super__.constructor.apply(this, arguments);
      return _ref27;
    }

    SearchView.prototype.url = '#search-tmpl';

    SearchView.prototype.defaults = {
      'sc_users': function() {
        var sc_users;
        sc_users = new SC_Users;
        sc_users.limit = 11;
        return sc_users;
      },
      'sc_tracks': function() {
        var sc_tracks;
        sc_tracks = new SC_Tracks;
        sc_tracks.limit = 25;
        return sc_tracks;
      }
    };

    SearchView.prototype.observables = {
      'current_user': null,
      'query': '',
      'is_loading_users': false,
      'is_loading_tracks': false
    };

    SearchView.prototype.display = function() {
      Application.on("update:user", this.updateCurrentUser, this);
      return this.updateCurrentUser(Application.current_user());
    };

    SearchView.prototype.dispose = function() {
      return Application.off("update:user", this.updateCurrentUser);
    };

    SearchView.prototype.updateCurrentUser = function(user) {
      if (user === this.current_user()) {
        return;
      }
      this.current_user(user);
      return this.search();
    };

    SearchView.prototype.updateQuery = function(query) {
      if (!_.isString(query)) {
        query = "";
      }
      query = _.trim(query);
      if (query === this.query()) {
        return;
      }
      this.query(query);
      return this.search();
    };

    SearchView.prototype.search = function() {
      var query,
        _this = this;
      if (!Application.is_logged_in()) {
        return;
      }
      query = this.query();
      if (_.isEmpty(query)) {
        this.sc_users.reset();
        return this.sc_tracks.reset();
      } else {
        this.is_loading_users(true);
        this.sc_users.search(query, function() {
          return _this.is_loading_users(false);
        });
        this.is_loading_tracks(true);
        return this.sc_tracks.search(query, function() {
          return _this.is_loading_tracks(false);
        });
      }
    };

    return SearchView;

  })(Falcon.View);

  SettingsView = (function(_super) {
    __extends(SettingsView, _super);

    function SettingsView() {
      _ref28 = SettingsView.__super__.constructor.apply(this, arguments);
      return _ref28;
    }

    SettingsView.prototype.url = "#settings-tmpl";

    SettingsView.prototype.defaults = {
      'credit_card_widget': function() {
        return new CreditCardWidget;
      }
    };

    SettingsView.prototype.observables = {
      'alert': '',
      'is_saving': false,
      'current_user': null,
      'is_showing_personal_information': false,
      'is_showing_credit_card': false,
      'is_showing_bank_account': false,
      'current_credit_card_last_4': '',
      'current_credit_card_type': '',
      'has_credit_card': function() {
        return !_.isEmpty(this.current_credit_card_last_4()) || !_.isEmpty(this.current_credit_card_type());
      },
      'current_bank_name': "",
      'current_bank_account_number': "",
      'has_bank_account': function() {
        return !_.isEmpty(this.current_bank_name()) || !_.isEmpty(this.current_bank_account_number());
      },
      'bank_account_name': "",
      'bank_account_account_number': "",
      'bank_account_routing_number': ""
    };

    SettingsView.prototype.initialize = function() {
      var _this = this;
      this.alert.classify("validateable");
      this.bank_account_name.classify("validateable");
      this.bank_account_account_number.classify("validateable");
      this.bank_account_routing_number.classify("validateable");
      ko.computed(function() {
        var name;
        name = _this.bank_account_name();
        return _this.bank_account_name.is_valid(!_.isEmpty(name));
      });
      ko.computed(function() {
        var account_number;
        account_number = _this.bank_account_account_number();
        return _this.bank_account_account_number.is_valid(!_.isEmpty(account_number));
      });
      ko.computed(function() {
        var routing_number;
        routing_number = _this.bank_account_routing_number();
        return _this.bank_account_routing_number.is_valid(balanced.bankAccount.validateRoutingNumber(routing_number));
      });
      return this.showPersonalInformation();
    };

    SettingsView.prototype.display = function() {
      Application.on("update:user", this.updateCurrentUser, this);
      return this.updateCurrentUser(Application.current_user());
    };

    SettingsView.prototype.dispose = function() {
      return Application.off("update:user", this.updateCurrentUser);
    };

    SettingsView.prototype.updateCurrentUser = function(user) {
      if (user === this.current_user()) {
        return;
      }
      this.current_user(user);
      return this.populateData();
    };

    SettingsView.prototype.populateData = function() {
      var current_user;
      if ((current_user = this.current_user()) instanceof User) {
        this.current_credit_card_last_4(current_user.get('card_last_4'));
        this.current_credit_card_type(current_user.get('card_type'));
        this.current_bank_name(current_user.get('bank_name'));
        return this.current_bank_account_number(current_user.get('bank_account_number'));
      } else {
        this.current_credit_card_last_4("");
        this.current_credit_card_type("");
        this.current_bank_name("");
        return this.current_bank_account_number("");
      }
    };

    SettingsView.prototype._reset = function() {
      this.is_showing_personal_information(false);
      this.is_showing_credit_card(false);
      this.is_showing_bank_account(false);
      return this._resetFields();
    };

    SettingsView.prototype._resetFields = function() {
      this.alert("");
      this.credit_card_widget.resetFields();
      this.bank_account_name("");
      this.bank_account_account_number("");
      this.bank_account_routing_number("");
      return this._clearValidations();
    };

    SettingsView.prototype._clearValidations = function() {
      this.alert.clearValidations();
      this.credit_card_widget.clearValidations();
      this.bank_account_name.clearValidations();
      this.bank_account_account_number.clearValidations();
      return this.bank_account_routing_number.clearValidations();
    };

    SettingsView.prototype._hasError = function() {
      if (this.alert.has_error()) {
        return true;
      }
      if (this.is_showing_credit_card()) {
        return this.credit_card_widget.hasError();
      } else if (this.is_showing_bank_account()) {
        return this.bank_account_routing_number.has_error() || this.bank_account_account_number.has_error() || this.bank_account_name.has_error();
      }
      return false;
    };

    SettingsView.prototype.showPersonalInformation = function() {
      this._reset();
      return this.is_showing_personal_information(true);
    };

    SettingsView.prototype.showCreditCard = function() {
      this._reset();
      return this.is_showing_credit_card(true);
    };

    SettingsView.prototype.cancelSaveCreditCard = function() {
      if (this.is_saving()) {
        return false;
      }
      if (!confirm("Are you sure you want to cancel saving your credit card?")) {
        return false;
      }
      return this._resetFields();
    };

    SettingsView.prototype.saveCreditCard = function() {
      var current_user, _saveCardToUser,
        _this = this;
      if (!((current_user = this.current_user()) instanceof User)) {
        return false;
      }
      if (this.is_saving()) {
        return false;
      }
      this.is_saving(true);
      _saveCardToUser = function(balanced_card_uri) {
        return current_user.clone(["id"]).set({
          balanced_card_uri: balanced_card_uri
        }).save({
          attributes: ["balanced_card_uri"],
          complete: function() {
            return _this.is_saving(false);
          },
          success: function(user) {
            current_user.fill(user.unwrap());
            _this.populateData();
            _this._resetFields();
            return _this.alert("Successfully saved credit card information!");
          },
          error: function() {
            return _this.alert.error("Error while saving credit card information");
          }
        });
      };
      this.credit_card_widget.createCardOnBalanced({
        success: _saveCardToUser,
        error: function() {
          _this.is_saving(false);
          return _this.alert.error("An error occurred while saving credit card information");
        }
      });
      return false;
    };

    SettingsView.prototype.removeCreditCard = function() {
      var current_user,
        _this = this;
      if (!((current_user = this.current_user()) instanceof User)) {
        return false;
      }
      if (!current_user.get('balanced_card_uri')) {
        return false;
      }
      if (this.is_saving()) {
        return false;
      }
      if (!confirm("Are you sure you want to remove your credit card?")) {
        return false;
      }
      this.is_saving(true);
      current_user.clone(["id"]).save({
        params: {
          "remove_credit_card": true
        },
        attributes: [],
        success: function(user) {
          current_user.fill(user.unwrap());
          _this.populateData();
          _this._clearValidations();
          return _this.alert("Successfully removed credit card");
        },
        error: function() {
          return _this.alert.error("There was an error while trying to remove your credit card");
        },
        complete: function() {
          return _this.is_saving(false);
        }
      });
      return false;
    };

    SettingsView.prototype.showBankAccount = function() {
      this._reset();
      return this.is_showing_bank_account(true);
    };

    SettingsView.prototype.cancelSaveBankAccount = function() {
      if (this.is_saving()) {
        return false;
      }
      if (!confirm("Are you sure you want to cancel saving your bank account?")) {
        return false;
      }
      return this._resetFields();
    };

    SettingsView.prototype.saveBankAccount = function() {
      var account_number, bank_account_obj, current_user, name, routing_number, validations, _saveBankAccountToUser,
        _this = this;
      if (!((current_user = this.current_user()) instanceof User)) {
        return false;
      }
      if (this.is_saving()) {
        return false;
      }
      this._clearValidations();
      routing_number = this.bank_account_routing_number();
      account_number = this.bank_account_account_number();
      name = this.bank_account_name();
      if (_.isEmpty(routing_number)) {
        this.bank_account_routing_number.error("Please enter a routing number");
      }
      if (_.isEmpty(account_number)) {
        this.bank_account_account_number.error("Please enter a account number");
      }
      if (_.isEmpty(name)) {
        this.bank_account_name.error("Please enter a name");
      }
      if (this._hasError()) {
        return false;
      }
      bank_account_obj = {
        routing_number: routing_number,
        account_number: account_number,
        name: name
      };
      validations = balanced.bankAccount.validate(bank_account_obj);
      if (validations.routing_number != null) {
        this.bank_account_routing_number.error(validations.routing_number);
      }
      if (validations.account_number != null) {
        this.bank_account_account_number.error(validations.account_number);
      }
      if (validations.name != null) {
        this.bank_account_name.error(validations.name);
      }
      if (this._hasError()) {
        return false;
      }
      this.bank_account_routing_number.is_valid(true);
      this.bank_account_account_number.is_valid(true);
      this.bank_account_name.is_valid(true);
      this.is_saving(true);
      _saveBankAccountToUser = function(balanced_bank_account_uri) {
        return current_user.clone(["id"]).set({
          balanced_bank_account_uri: balanced_bank_account_uri
        }).save({
          attributes: ["balanced_bank_account_uri"],
          complete: function() {
            return _this.is_saving(false);
          },
          success: function(user) {
            current_user.fill(user.unwrap());
            _this.populateData();
            _this._resetFields();
            return _this.alert("Successfully saved bank account information!");
          },
          error: function() {
            return _this.alert.error("Error while saving bank account information");
          }
        });
      };
      balanced.bankAccount.create(bank_account_obj, function(response) {
        switch (response.status) {
          case 201:
            return _saveBankAccountToUser(response.data.uri);
          default:
            _this.alert.error("An error occurred while saving bank account information");
        }
        return _this.is_saving(false);
      });
      return false;
    };

    SettingsView.prototype.removeBankAccount = function() {
      var current_user,
        _this = this;
      if (!((current_user = this.current_user()) instanceof User)) {
        return false;
      }
      if (!current_user.get('balanced_bank_account_uri')) {
        return false;
      }
      if (this.is_saving()) {
        return false;
      }
      if (!confirm("Are you sure you want to remove your bank account?")) {
        return false;
      }
      this.is_saving(true);
      current_user.clone(["id"]).save({
        params: {
          "remove_bank_account": true
        },
        attributes: [],
        success: function(user) {
          current_user.fill(user.unwrap());
          _this.populateData();
          _this._clearValidations();
          return _this.alert("Successfully removed bank account");
        },
        error: function() {
          return _this.alert.error("There was an error while trying to remove your credit card");
        },
        complete: function() {
          return _this.is_saving(false);
        }
      });
      return false;
    };

    SettingsView.prototype.gotoPersonalInfomration = function() {
      return Finch.navigate({
        "showing": null
      }, true);
    };

    SettingsView.prototype.gotoCreditCard = function() {
      return Finch.navigate({
        "showing": "credit_card"
      }, true);
    };

    SettingsView.prototype.gotoBankAccount = function() {
      return Finch.navigate({
        "showing": "bank_account"
      }, true);
    };

    return SettingsView;

  })(Falcon.View);

  SplashView = (function(_super) {
    __extends(SplashView, _super);

    function SplashView() {
      _ref29 = SplashView.__super__.constructor.apply(this, arguments);
      return _ref29;
    }

    SplashView.prototype.url = '#splash-tmpl';

    SplashView.prototype.observables = {
      "is_loading": false,
      "is_connected": false
    };

    SplashView.prototype.connect = function() {
      var _this = this;
      if (this.is_loading()) {
        return;
      }
      this.is_loading(true);
      this.is_connected(false);
      return Application.connect({
        success: function(soundcloud_access_token) {
          _this.is_connected(true);
          return _this.login(soundcloud_access_token);
        },
        error: function(error, message) {
          console.log(error, message);
          return _this.is_loading(false);
        }
      });
    };

    SplashView.prototype.login = function(soundcloud_access_token) {
      var _this = this;
      if (soundcloud_access_token == null) {
        return;
      }
      if (!this.is_connected()) {
        return;
      }
      return (new Session({
        soundcloud_access_token: soundcloud_access_token
      })).create({
        'attributes': ['soundcloud_access_token'],
        success: function(session) {
          Application.login(session);
          _this.is_loading(false);
          return _this.is_connected(false);
        },
        error: function() {
          return _this.register(soundcloud_access_token);
        }
      });
    };

    SplashView.prototype.register = function(soundcloud_access_token) {
      var _this = this;
      if (soundcloud_access_token == null) {
        return;
      }
      if (!this.is_connected()) {
        return;
      }
      if (Application.is_logged_in()) {
        return;
      }
      return (new User({
        soundcloud_access_token: soundcloud_access_token
      })).create({
        'attributes': ['soundcloud_access_token'],
        success: function(user) {
          return (new Session).fetch({
            success: function(session) {
              return Application.login(session);
            },
            complete: function() {
              _this.is_connected(false);
              return _this.is_loading(false);
            }
          });
        },
        error: function(user) {
          _this.is_loading(false);
          return _this.is_connected(false);
        }
      });
    };

    return SplashView;

  })(Falcon.View);

  StreamView = (function(_super) {
    __extends(StreamView, _super);

    function StreamView() {
      _ref30 = StreamView.__super__.constructor.apply(this, arguments);
      return _ref30;
    }

    StreamView.prototype.url = "#stream-tmpl";

    StreamView.prototype.defaults = {
      "tracks": function() {
        return new SC_Tracks;
      }
    };

    StreamView.prototype.observables = {
      "is_loading": false,
      "current_user": null
    };

    StreamView.prototype.display = function() {
      Application.on("update:user", this.updateCurrentUser, this);
      return this.updateCurrentUser(Application.current_user());
    };

    StreamView.prototype.dispose = function() {
      return Application.off("update:user", this.updateCurrentUser);
    };

    StreamView.prototype.updateCurrentUser = function(user) {
      if (user === this.current_user()) {
        return;
      }
      this.current_user(user);
      return this.fetchInformation();
    };

    StreamView.prototype.fetchInformation = function() {
      var current_user,
        _this = this;
      if (!((current_user = this.current_user()) instanceof User)) {
        return;
      }
      if (this.is_loading()) {
        return;
      }
      this.is_loading(true);
      return current_user.sc_user.activities.fetchTracks({
        complete: function() {
          return _this.is_loading(false);
        }
      });
    };

    return StreamView;

  })(Falcon.View);

  Falcon.addBinding("src", function(element, valueAccessor) {
    var value;
    value = ko.unwrap(valueAccessor());
    return element.setAttribute("src", value);
  });

  Falcon.addBinding('stopEvent', function(element, valueAccessor) {
    var evt, value, _i, _len, _results;
    value = ko.unwrap(valueAccessor());
    if (_.isString(value)) {
      value = [value];
    }
    _results = [];
    for (_i = 0, _len = value.length; _i < _len; _i++) {
      evt = value[_i];
      _results.push($(element).on(evt, function(event) {
        event.stopPropagation();
        event.preventDefault();
        return false;
      }));
    }
    return _results;
  });

  Finch.route("/", {
    setup: function() {
      Application.checkSession();
      return Finch.observe("query", function(query) {
        return Application.search(query);
      });
    },
    load: function() {
      return Application.setContentView(new DashboardView);
    }
  });

  Finch.route("[/]stream", {
    setup: function() {
      return this.view = Application.setContentView(new StreamView);
    }
  });

  Finch.route("[/]settings", {
    setup: function() {
      var _this = this;
      this.view = Application.setContentView(new SettingsView);
      return Finch.observe("showing", function(showing) {
        if (showing === "credit_card") {
          return _this.view.showCreditCard();
        }
        if (showing === "bank_account") {
          return _this.view.showBankAccount();
        }
        return _this.view.showPersonalInformation();
      });
    }
  });

  Finch.route("[/]search", {
    setup: function() {
      var _this = this;
      this.view = Application.setContentView(new SearchView);
      return Finch.observe("query", function(query) {
        return _this.view.updateQuery(query);
      });
    }
  });

  Finch.route("[/]profile", {
    setup: function() {
      return this.view = Application.setContentView(new ProfileView);
    }
  });

  Finch.route("[/]profile/:username", {
    setup: function(_arg) {
      var username;
      username = _arg.username;
      return this.view = Application.setContentView(new ProfileView(username));
    }
  });

  this.Router = Router = {
    'gotoDashboard': function() {
      return Finch.navigate("/");
    },
    'gotoStream': function() {
      return Finch.navigate("/stream");
    },
    'gotoSettings': function() {
      return Finch.navigate("/settings");
    },
    'gotoSearch': function(params) {
      return Finch.navigate("/search", params);
    },
    'gotoProfile': function(user) {
      if (user instanceof SC_User) {
        return Finch.navigate("/profile/" + (user.get('id')));
      } else {
        return Finch.navigate("/profile");
      }
    }
  };

  if (typeof ENV === "undefined" || ENV === null) {
    throw "Could not find ENV variables";
  }

  this.Application = Application = new ApplicationView;

  SC.initialize({
    client_id: ENV['SOUNDCLOUD_CLIENT_ID'],
    redirect_uri: ENV['SOUNDCLOUD_REDIRECT_URL']
  });

  balanced.init(ENV['BALANCED_MAKRETPLACE_URI']);

  Falcon.apply(Application);

  Finch.listen();

}).call(this);

(function() {
  var Application, ApplicationView, DESCENDING_ID_COMPARATOR, DashboardView, EMAIL_REGEX, Helpers, IE_VERSION, IS_IE, IS_MOBILE, IS_PHONE, IS_SAFARI, IS_TABLET, MENTION_REGEX, Router, SC_Activities, SC_Activity, SC_Application, SC_Applications, SC_Comment, SC_Comments, SC_Group, SC_Groups, SC_Playlist, SC_Playlists, SC_Track, SC_Tracks, SC_User, SC_Users, SC_WebProfile, SC_WebProfiles, Session, SoundCloudCollection, SoundCloudModel, SplashView, StreamView, TAG_REGEX, URL_REGEX, User, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

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
        ret += unwrap(arg);
      }
      return ret;
    },
    'isEmail': function(emailStr) {
      emailStr = unwrap(emailStr);
      if (!_.isString(emailStr)) {
        emailStr = "";
      }
      emailStr = _.trim(emailStr);
      return new RegExp(EMAIL_REGEX).test(emailStr);
    },
    'isUrl': function(urlStr) {
      urlStr = unwrap(urlStr);
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

    'resize_image': function(avatar_url, size) {
      var _ref1;
      avatar_url = (_ref1 = ko.unwrap(avatar_url)) != null ? _ref1 : "";
      return avatar_url.replace("-large.", "-" + size + ".");
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

  SoundCloudModel = (function(_super) {
    __extends(SoundCloudModel, _super);

    function SoundCloudModel() {
      _ref1 = SoundCloudModel.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    SoundCloudModel.prototype.makeUrl = function(type, parent) {
      var original_base_api_url, url;
      original_base_api_url = Falcon.baseApiUrl;
      Falcon.baseApiUrl = "";
      url = SoundCloudModel.__super__.makeUrl.call(this, type, parent);
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

  Session = (function(_super) {
    __extends(Session, _super);

    function Session() {
      _ref2 = Session.__super__.constructor.apply(this, arguments);
      return _ref2;
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
      _ref3 = SC_Activity.__super__.constructor.apply(this, arguments);
      return _ref3;
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
      _ref4 = SC_Application.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    SC_Application.prototype.url = "apps";

    return SC_Application;

  })(SoundCloudModel);

  SC_Comment = (function(_super) {
    __extends(SC_Comment, _super);

    function SC_Comment() {
      _ref5 = SC_Comment.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    SC_Comment.prototype.url = "comments";

    return SC_Comment;

  })(SoundCloudModel);

  SC_Group = (function(_super) {
    __extends(SC_Group, _super);

    function SC_Group() {
      _ref6 = SC_Group.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    SC_Group.prototype.url = "groups";

    return SC_Group;

  })(SoundCloudModel);

  SC_Playlist = (function(_super) {
    __extends(SC_Playlist, _super);

    function SC_Playlist() {
      _ref7 = SC_Playlist.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    SC_Playlist.prototype.url = "playlists";

    return SC_Playlist;

  })(SoundCloudModel);

  SC_Track = (function(_super) {
    var _currently_playing_track;

    __extends(SC_Track, _super);

    function SC_Track() {
      _ref8 = SC_Track.__super__.constructor.apply(this, arguments);
      return _ref8;
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
      _ref9 = SC_User.__super__.constructor.apply(this, arguments);
      return _ref9;
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

    return SC_User;

  })(SoundCloudModel);

  SC_WebProfile = (function(_super) {
    __extends(SC_WebProfile, _super);

    function SC_WebProfile() {
      _ref10 = SC_WebProfile.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    SC_WebProfile.prototype.url = "web-profiles";

    return SC_WebProfile;

  })(SoundCloudModel);

  User = (function(_super) {
    __extends(User, _super);

    function User() {
      _ref11 = User.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    User.prototype.url = "user";

    User.prototype.defaults = {
      "soundcloud_access_token": "",
      "full_name": "",
      "soundcloud_id": "",
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
      _ref12 = SoundCloudCollection.__super__.constructor.apply(this, arguments);
      return _ref12;
    }

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

    return SoundCloudCollection;

  })(Falcon.Collection);

  SC_Activities = (function(_super) {
    __extends(SC_Activities, _super);

    function SC_Activities() {
      _ref13 = SC_Activities.__super__.constructor.apply(this, arguments);
      return _ref13;
    }

    SC_Activities.prototype.model = SC_Activity;

    SC_Activities.prototype.parse = function(data) {
      var item;
      return (function() {
        var _i, _len, _ref14, _ref15, _results;
        _ref15 = (_ref14 = data.collection) != null ? _ref14 : [];
        _results = [];
        for (_i = 0, _len = _ref15.length; _i < _len; _i++) {
          item = _ref15[_i];
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
      _ref14 = SC_Applications.__super__.constructor.apply(this, arguments);
      return _ref14;
    }

    SC_Applications.prototype.model = SC_Application;

    return SC_Applications;

  })(Falcon.Collection);

  SC_Comments = (function(_super) {
    __extends(SC_Comments, _super);

    function SC_Comments() {
      _ref15 = SC_Comments.__super__.constructor.apply(this, arguments);
      return _ref15;
    }

    SC_Comments.prototype.model = SC_Comment;

    return SC_Comments;

  })(SoundCloudCollection);

  SC_Groups = (function(_super) {
    __extends(SC_Groups, _super);

    function SC_Groups() {
      _ref16 = SC_Groups.__super__.constructor.apply(this, arguments);
      return _ref16;
    }

    SC_Groups.prototype.model = SC_Group;

    return SC_Groups;

  })(SoundCloudCollection);

  SC_Playlists = (function(_super) {
    __extends(SC_Playlists, _super);

    function SC_Playlists() {
      _ref17 = SC_Playlists.__super__.constructor.apply(this, arguments);
      return _ref17;
    }

    SC_Playlists.prototype.model = SC_Playlist;

    return SC_Playlists;

  })(SoundCloudCollection);

  SC_Tracks = (function(_super) {
    __extends(SC_Tracks, _super);

    function SC_Tracks() {
      _ref18 = SC_Tracks.__super__.constructor.apply(this, arguments);
      return _ref18;
    }

    SC_Tracks.prototype.model = SC_Track;

    return SC_Tracks;

  })(SoundCloudCollection);

  SC_Users = (function(_super) {
    __extends(SC_Users, _super);

    function SC_Users() {
      _ref19 = SC_Users.__super__.constructor.apply(this, arguments);
      return _ref19;
    }

    SC_Users.prototype.model = SC_User;

    return SC_Users;

  })(SoundCloudCollection);

  SC_WebProfiles = (function(_super) {
    __extends(SC_WebProfiles, _super);

    function SC_WebProfiles() {
      _ref20 = SC_WebProfiles.__super__.constructor.apply(this, arguments);
      return _ref20;
    }

    SC_WebProfiles.prototype.model = SC_WebProfile;

    return SC_WebProfiles;

  })(SoundCloudCollection);

  ApplicationView = (function(_super) {
    var _connect_options;

    __extends(ApplicationView, _super);

    function ApplicationView() {
      _ref21 = ApplicationView.__super__.constructor.apply(this, arguments);
      return _ref21;
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
      }
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
      console.log(dialog);
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
        return;
      }
      this.content_view(view);
      return this.notifySubscribers();
    };

    ApplicationView.prototype.notifySubscribers = function() {
      var content_view;
      if (!Falcon.isView(content_view = this.content_view())) {
        return;
      }
      return this.trigger("update:user", this.current_user());
    };

    return ApplicationView;

  })(Falcon.View);

  DashboardView = (function(_super) {
    __extends(DashboardView, _super);

    function DashboardView() {
      _ref22 = DashboardView.__super__.constructor.apply(this, arguments);
      return _ref22;
    }

    DashboardView.prototype.url = "#dashboard-tmpl";

    DashboardView.prototype.observables = {
      "current_user": null
    };

    DashboardView.prototype.initialize = function() {
      return Application.on("update:user", this.updateCurrentUser, this);
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

  SplashView = (function(_super) {
    __extends(SplashView, _super);

    function SplashView() {
      _ref23 = SplashView.__super__.constructor.apply(this, arguments);
      return _ref23;
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
          var _this = this;
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
      _ref24 = StreamView.__super__.constructor.apply(this, arguments);
      return _ref24;
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

    StreamView.prototype.initialize = function() {
      return Application.on("update:user", this.updateCurrentUser, this);
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

  Finch.route("/", {
    setup: function() {
      return Application.checkSession();
    },
    load: function() {
      return Application.setContentView(new DashboardView);
    }
  });

  Finch.route("[/]stream", {
    setup: function() {
      this.view = new StreamView;
      return Application.setContentView(this.view);
    }
  });

  this.Router = Router = {
    'gotoDashboard': function() {
      return Finch.navigate("/");
    },
    'gotoStream': function() {
      return Finch.navigate("/stream");
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

(function() {
  var Application, ApplicationView, DESCENDING_ID_COMPARATOR, EMAIL_REGEX, Helpers, IE_VERSION, IS_IE, IS_MOBILE, IS_PHONE, IS_SAFARI, IS_TABLET, MENTION_REGEX, Router, Session, TAG_REGEX, URL_REGEX, Utitlity, _ref, _ref1, _ref2,
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
    }
  };

  this.Utitlity = Utitlity = {
    trim: function(str) {
      if (str == null) {
        return "";
      }
      return str.toString().replace(/^\s+/, '').replace(/\s+$/, '');
    }
  };

  Session = (function(_super) {
    __extends(Session, _super);

    function Session() {
      _ref1 = Session.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Session.prototype.url = 'session';

    Session.prototype.makeUrl = function() {
      return (Falcon.baseApiUrl + "/" + this.url).replace(/([^:])\/\//gi, "$1/");
    };

    Session.prototype.toUser = function() {
      var user;
      user = new User(this.serialize());
      return user;
    };

    return Session;

  })(Falcon.Model);

  ApplicationView = (function(_super) {
    __extends(ApplicationView, _super);

    function ApplicationView() {
      _ref2 = ApplicationView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ApplicationView.prototype.url = '#application-tmpl';

    return ApplicationView;

  })(Falcon.View);

  Finch.route("/", {
    setup: function() {}
  });

  this.Router = Router = {};

  this.Application = Application = new ApplicationView;

  Falcon.apply(Application, "#application");

  Finch.listen();

}).call(this);

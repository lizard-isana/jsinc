var _add_post_file_load_hook, _add_post_parse_hook, _add_post_content_load_hook, _add_post_page_load_hook;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var JSIncGlobal = JSIncGlobal || {};
JSIncGlobal.Storage = {};
JSIncGlobal.Storage.PostPageLoadHook = [];
JSIncGlobal.Storage.loaded_file_num = JSIncGlobal.Storage.loaded_file_num || 0;
const JSInc = (_add_post_file_load_hook = /*#__PURE__*/new WeakMap(), _add_post_parse_hook = /*#__PURE__*/new WeakMap(), _add_post_content_load_hook = /*#__PURE__*/new WeakMap(), _add_post_page_load_hook = /*#__PURE__*/new WeakMap(), /*#__PURE__*/function () {
  "use strict";

  function JSInc(element, option) {
    var _this = this;

    _classCallCheck(this, JSInc);

    _classPrivateFieldInitSpec(this, _add_post_file_load_hook, {
      writable: true,
      value: function (f) {
        this.Storage.PostFileLoadHook.push(f);
      }
    });

    _classPrivateFieldInitSpec(this, _add_post_parse_hook, {
      writable: true,
      value: function (f) {
        this.Storage.PostParseHook.push(f);
      }
    });

    _classPrivateFieldInitSpec(this, _add_post_content_load_hook, {
      writable: true,
      value: function (f) {
        this.Storage.PostContentLoadHook.push(f);
      }
    });

    _classPrivateFieldInitSpec(this, _add_post_page_load_hook, {
      writable: true,
      value: function (f) {
        JSIncGlobal.Storage.PostPageLoadHook.push(f);
      }
    });

    _defineProperty(this, "post_file_load_hook", function (f) {
      _classPrivateFieldGet(_this, _add_post_file_load_hook).call(_this, f);
    });

    _defineProperty(this, "post_parse_hook", function (f) {
      _classPrivateFieldGet(_this, _add_post_parse_hook).call(_this, f);
    });

    _defineProperty(this, "post_content_load_hook", function (f) {
      _classPrivateFieldGet(_this, _add_post_content_load_hook).call(_this, f);
    });

    _defineProperty(this, "post_page_load_hook", function (f) {
      _classPrivateFieldGet(_this, _add_post_page_load_hook).call(_this, f);
    });

    this.Storage = {};
    this.Storage.PostFileLoadHook = [];
    this.Storage.PostParseHook = [];
    this.Storage.PostContentLoadHook = [];
    this.Storage.PostPageLoadHook = [];
    this.element = element;

    if (option && option.mode != undefined) {
      this.mode = option.mode;
    } else {
      this.mode = "open";
    }

    if (option && option.shadow != undefined) {
      this.shadow = option.shadow;
    } else {
      this.shadow = false;
    }
  }

  _createClass(JSInc, [{
    key: "load",
    value: function load(file) {
      var _this2 = this;

      fetch(file).then(function (res) {
        return res.text();
      }).then(function (text) {
        JSIncGlobal.Storage.loaded_file_num++;

        if (_this2.Storage.PostFileLoadHook.length > 0) {
          for (var i in _this2.Storage.PostFileLoadHook) {
            text = _this2.Storage.PostFileLoadHook[i](text);
          }
        }

        let dom = document.createRange().createContextualFragment(text);
        return dom;
      }).then(function (dom) {
        if (_this2.Storage.PostParseHook.length > 0) {
          for (var i in _this2.Storage.PostParseHook) {
            dom = _this2.Storage.PostParseHook[i](dom);
          }
        }

        let target;

        if (_this2.shadow == true) {
          target = _this2.element.attachShadow({
            mode: _this2.mode
          });
        } else {
          target = _this2.element;
        }

        target.appendChild(dom);
        return;
      }).then(function () {
        if (_this2.Storage.PostContentLoadHook.length > 0) {
          for (let i in _this2.Storage.PostContentLoadHook) {
            _this2.Storage.PostContentLoadHook[i]();
          }
        }

        JSIncGlobal.Storage.display_file_num = JSIncGlobal.Storage.display_file_num || 0;
        JSIncGlobal.Storage.display_file_num++;

        if (JSIncGlobal.Storage.PostPageLoadHook.length > 0 && JSIncGlobal.Storage.loaded_file_num == JSIncGlobal.Storage.display_file_num) {
          for (var i in JSIncGlobal.Storage.PostPageLoadHook) {
            JSIncGlobal.Storage.PostPageLoadHook[i]();
          }
        }
      }).catch(function (error) {
        console.error('Error:', error);
      });
    }
  }]);

  return JSInc;
}());

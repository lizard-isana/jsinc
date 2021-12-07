var _script_loader, _store_scripts, _apply_scripts, _store_styles, _apply_styles, _add_post_file_load_hook, _add_post_parse_hook, _add_post_content_load_hook, _add_post_page_load_hook;

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
const JSInc = (_script_loader = /*#__PURE__*/new WeakMap(), _store_scripts = /*#__PURE__*/new WeakMap(), _apply_scripts = /*#__PURE__*/new WeakMap(), _store_styles = /*#__PURE__*/new WeakMap(), _apply_styles = /*#__PURE__*/new WeakMap(), _add_post_file_load_hook = /*#__PURE__*/new WeakMap(), _add_post_parse_hook = /*#__PURE__*/new WeakMap(), _add_post_content_load_hook = /*#__PURE__*/new WeakMap(), _add_post_page_load_hook = /*#__PURE__*/new WeakMap(), /*#__PURE__*/function () {
  "use strict";

  function JSInc(element, option) {
    var _this = this;

    _classCallCheck(this, JSInc);

    _classPrivateFieldInitSpec(this, _script_loader, {
      writable: true,
      value: function (scripts, target, callback) {
        var len = scripts.length;
        var i = 0;
        console.log(_this);
        const loaded_scripts = [];

        function append_script() {
          if (loaded_scripts.indexOf(scripts[i]) < 0 && scripts[i] !== undefined) {
            var script = document.createElement("script");
            script.src = scripts[i];
            target.appendChild(script);
            loaded_scripts.push(scripts[i]);
            i++;

            if (i == len) {
              if (callback) {
                script.onload = callback;
              }

              return;
            }

            script.onload = append_script;
          } else if (scripts[i] == undefined && i != len) {
            i++;
            append_script();
          } else {
            return;
          }
        }

        append_script();
        _this.LoadedScripts = loaded_scripts;
      }
    });

    _classPrivateFieldInitSpec(this, _store_scripts, {
      writable: true,
      value: function (dom) {
        const script_elements = dom.querySelectorAll("script");
        const included_scripts = [];
        const written_scripts = [];

        for (let i = 0, ln = script_elements.length; i < ln; i++) {
          if (script_elements[i]) {
            const src = script_elements[i].getAttribute("src");
            const type = script_elements[i].getAttribute("type");

            if (src) {
              _this.Storage.included_scripts.push(src);
            } else if (type) {
              if (type == "text/javascript") {
                _this.Storage.written_scripts.push(script_elements[i].textContent);
              } else {
                continue;
              }
            } else {
              _this.Storage.written_scripts.push(script_elements[i].textContent);
            }

            script_elements[i].parentNode.removeChild(script_elements[i]);
          }
        }
      }
    });

    _classPrivateFieldInitSpec(this, _apply_scripts, {
      writable: true,
      value: function (dom, target) {
        const included_scripts = _this.Storage.included_scripts;
        const written_scripts = _this.Storage.written_scripts;

        if (included_scripts.length > 0) {
          _classPrivateFieldGet(_this, _script_loader).call(_this, included_scripts, target, function () {
            new Function(written_scripts.join("\n"))();
          });
        } else {
          new Function(written_scripts.join("\n"))();
        }
      }
    });

    _classPrivateFieldInitSpec(this, _store_styles, {
      writable: true,
      value: function (dom) {
        const written_styles = dom.querySelectorAll("style");
        const merged_style = [];

        if (written_styles.length > 0) {
          for (var i = 0, ln = written_styles.length; i < ln; i++) {
            if (written_styles[i] && written_styles[i].textContent) {
              merged_style.push(written_styles[i].textContent);
            }

            written_styles[i].parentNode.removeChild(written_styles[i]);
          }

          const merged_style_element = document.createElement('style');
          merged_style_element.setAttribute("type", "text/css");
          merged_style_element.textContent = merged_style.join("\n");
          _this.Storage.written_styles = merged_style_element;
        }

        const included_styles = dom.querySelectorAll("link[rel='stylesheet']");
        let node;

        for (var i = 0, ln = included_styles.length; i < ln; i++) {
          node = included_styles[i].cloneNode(true);

          if (node) {
            _this.Storage.included_styles.push(node);
          }

          included_styles[i].parentNode.removeChild(included_styles[i]);
        }
      }
    });

    _classPrivateFieldInitSpec(this, _apply_styles, {
      writable: true,
      value: function (dom, target) {
        if (_this.Storage.written_styles) {
          target.appendChild(_this.Storage.written_styles);
        }

        const included_styles = _this.Storage.included_styles;

        if (included_styles) {
          for (var i = 0, ln = included_styles.length; i < ln; i++) {
            var href = included_styles[i].getAttribute("href");

            if (_this.LoadedStyles.indexOf(href) < 0 && href !== undefined) {
              target.appendChild(included_styles[i]);

              _this.LoadedStyles.push(href);
            }
          }
        }
      }
    });

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
    this.Storage.written_styles;
    this.Storage.included_styles = [];
    this.Storage.written_scripts = [];
    this.Storage.included_scripts = [];
    this.element = element;
    this.LoadedScripts = [];
    this.LoadedStyles = [];

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

    if (option && option.callback != undefined) {
      this.callback = option.callback;
    } else {
      this.callback = undefined;
    }

    if (option && option.sanitize != undefined) {
      this.sanitize = option.sanitize;
    } else {
      this.sanitize = true;
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

        let dom = new DOMParser().parseFromString(text, "text/html");
        return dom;
      }).then(function (dom) {
        if (_this2.Storage.PostParseHook.length > 0) {
          for (var i in _this2.Storage.PostParseHook) {
            dom.body = _this2.Storage.PostParseHook[i](dom.body);
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

        _classPrivateFieldGet(_this2, _store_styles).call(_this2, dom);

        _classPrivateFieldGet(_this2, _store_scripts).call(_this2, dom);

        target.innerHTML = dom.body.innerHTML;

        _classPrivateFieldGet(_this2, _apply_styles).call(_this2, dom, target);

        _classPrivateFieldGet(_this2, _apply_scripts).call(_this2, dom, target);

        if (_this2.Storage.PostContentLoadHook.length > 0) {
          for (var i in _this2.Storage.PostContentLoadHook) {
            _this2.Storage.PostContentLoadHook[i]();
          }
        }

        JSIncGlobal.Storage.display_file_num = JSIncGlobal.Storage.display_file_num || 0;
        JSIncGlobal.Storage.display_file_num++;

        if (JSIncGlobal.Storage.PostPageLoadHook.length > 0 && JSIncGlobal.Storage.loaded_file_num == JSIncGlobal.Storage.display_file_num) {
          for (var i in JSIncGlobal.Storage.PostPageLoadHook.length) {
            JSIncGlobal.Storage.PostPageLoadHook.length[i]();
          }
        }
      }).catch(function (error) {
        console.error('Error:', error);
      });
    }
  }]);

  return JSInc;
}());

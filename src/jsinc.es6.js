var JSIncGlobal = JSIncGlobal || {};
JSIncGlobal.Storage = {};
JSIncGlobal.Storage.PostPageLoadHook = [];
JSIncGlobal.Storage.loaded_file_num = JSIncGlobal.Storage.loaded_file_num || 0;

const JSInc = class{
  constructor(element,option){
    this.Storage = {};
    this.Storage.PostFileLoadHook = [];
    this.Storage.PostParseHook = [];
    this.Storage.PostContentLoadHook = [];
    this.Storage.PostPageLoadHook = [];
    this.element = element;
    if(option && option.mode != undefined){
      this.mode = option.mode;
    }else{
      this.mode = "open";
    }
    if(option && option.shadow != undefined){
      this.shadow = option.shadow;
    }else{
      this.shadow = false;
    }
  }
  #add_post_file_load_hook = function (f) {
    this.Storage.PostFileLoadHook.push(f);
  };

  #add_post_parse_hook = function (f) {
    this.Storage.PostParseHook.push(f);
  };

  #add_post_content_load_hook = function (f) {
    this.Storage.PostContentLoadHook.push(f);
  };

  #add_post_page_load_hook = function (f) {
    JSIncGlobal.Storage.PostPageLoadHook.push(f);
  };

  post_file_load_hook = (f) => {
    this.#add_post_file_load_hook(f);
  }

  post_parse_hook = (f) => {
    this.#add_post_parse_hook(f);
  }

  post_content_load_hook = (f) => {
    this.#add_post_content_load_hook(f);
  }

  post_page_load_hook = (f) => {
    this.#add_post_page_load_hook(f);
  }

  load(file){
    fetch(file)
    .then((res) => res.text())
    .then((text) => {
      JSIncGlobal.Storage.loaded_file_num++;
      if (this.Storage.PostFileLoadHook.length > 0) {
        for (var i in this.Storage.PostFileLoadHook) {
          text = this.Storage.PostFileLoadHook[i](text);
        }
      }
      let dom = document.createRange().createContextualFragment(text);
      return dom;
    })
    .then((dom) => {
      if (this.Storage.PostParseHook.length > 0) {
        for (var i in this.Storage.PostParseHook) {
          dom = this.Storage.PostParseHook[i](dom);
        }
      }
      let target;
      if(this.shadow == true){
        target = this.element.attachShadow({mode: this.mode});
      }else{
        target = this.element;
      }
      target.appendChild(dom);
      return;
    })
    .then(() => {
      if (this.Storage.PostContentLoadHook.length > 0) {
        for (let i in this.Storage.PostContentLoadHook) {
          this.Storage.PostContentLoadHook[i]();
        }
      }
      JSIncGlobal.Storage.display_file_num = JSIncGlobal.Storage.display_file_num || 0;
      JSIncGlobal.Storage.display_file_num++;
      if (JSIncGlobal.Storage.PostPageLoadHook.length > 0 && JSIncGlobal.Storage.loaded_file_num == JSIncGlobal.Storage.display_file_num) {
        for (var i in JSIncGlobal.Storage.PostPageLoadHook.length) {
          JSIncGlobal.Storage.PostPageLoadHook.length[i]();
        }
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
    });
  }
};

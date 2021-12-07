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
    this.Storage.written_styles;
    this.Storage.included_styles = [];
    this.Storage.written_scripts = [];
    this.Storage.included_scripts = [];

    this.element = element;
    this.LoadedScripts = [];
    this.LoadedStyles = [];
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
    if(option && option.callback != undefined){
      this.callback = option.callback;
    }else{
      this.callback = undefined;
    }
    if(option && option.sanitize != undefined){
      this.sanitize = option.sanitize;
    }else{
      this.sanitize = true;
    }

  }

  #script_loader =  (scripts, target, callback) => {
    var len = scripts.length;
    var i = 0;
    console.log(this);
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
    this.LoadedScripts = loaded_scripts;
  };


  #store_scripts  = (dom) =>{
    const script_elements = dom.querySelectorAll(`script`)
    const included_scripts = [];
    const written_scripts = [];
    for (let i = 0, ln = script_elements.length; i < ln; i++) {
      if (script_elements[i]) {
        const src = script_elements[i].getAttribute("src");
        const type = script_elements[i].getAttribute("type");
        if (src) {
          this.Storage.included_scripts.push(src)
        } else if (type) {
          if (type == "text/javascript") {
            this.Storage.written_scripts.push(script_elements[i].textContent);
          } else {
            continue;
          }
        } else {
          this.Storage.written_scripts.push(script_elements[i].textContent);
        }
        script_elements[i].parentNode.removeChild(script_elements[i]);
      }
    }
  }

  #apply_scripts = (dom,target) =>{
    const included_scripts = this.Storage.included_scripts;
    const written_scripts = this.Storage.written_scripts;
    if (included_scripts.length > 0) {
      this.#script_loader(included_scripts,target, function () {
        new Function(written_scripts.join("\n"))()
      })
    } else {
      new Function(written_scripts.join("\n"))()
    }
  }

  #store_styles = (dom) => {
    const written_styles = dom.querySelectorAll("style");
    const merged_style = [];
    if(written_styles.length>0){
      for (var i = 0, ln = written_styles.length; i < ln; i++) {
        if (written_styles[i] && written_styles[i].textContent) {
          merged_style.push(written_styles[i].textContent);
        }
        written_styles[i].parentNode.removeChild(written_styles[i]);
      }
      const merged_style_element = document.createElement('style');
      merged_style_element.setAttribute("type", "text/css");
      merged_style_element.textContent = merged_style.join("\n");
      this.Storage.written_styles = merged_style_element;
    }
    
    const included_styles = dom.querySelectorAll("link[rel='stylesheet']");
    let node;
    for (var i = 0, ln = included_styles.length; i < ln; i++) {
      node =  included_styles[i].cloneNode(true);
      if(node){
        this.Storage.included_styles.push(node);
      }
      included_styles[i].parentNode.removeChild(included_styles[i]);
    }

  }

  #apply_styles = (dom,target) => {
    if(this.Storage.written_styles){
      target.appendChild(this.Storage.written_styles);
    }

    const included_styles = this.Storage.included_styles;
    if(included_styles){
      for (var i = 0, ln = included_styles.length; i < ln; i++) {
        var href = included_styles[i].getAttribute("href");
        if (this.LoadedStyles.indexOf(href) < 0 && href !== undefined) {
          target.appendChild(included_styles[i]);
          this.LoadedStyles.push(href);
        }
      }
    }
  };

  
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
      let dom = new DOMParser().parseFromString(text, "text/html");
      return dom;
    })
    .then((dom) => {

      if (this.Storage.PostParseHook.length > 0) {
        for (var i in this.Storage.PostParseHook) {
          dom.body = this.Storage.PostParseHook[i](dom.body);
        }
      }

      let target;
      if(this.shadow == true){
        target = this.element.attachShadow({mode: this.mode});
      }else{
        target = this.element;
      }
      this.#store_styles(dom);
      this.#store_scripts(dom)
      target.innerHTML = dom.body.innerHTML;
      this.#apply_styles(dom,target);
      this.#apply_scripts(dom,target);

      if (this.Storage.PostContentLoadHook.length > 0) {
        for (var i in this.Storage.PostContentLoadHook) {
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

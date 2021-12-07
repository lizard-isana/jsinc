# JSInc - JavaScript Client-side Includes

## How to use

Include JSInc on your website.

```HTML
<script src="./dist/jsinc.min.js"></script>
```

And initialize with the target element and load the include file.

```JavaScript 
document.addEventListener('DOMContentLoaded', function(){
  const element = document.querySelector("#include_target");
  const inc = new JSInc(element);
  inc.load("include_file.html");
})
```

```HTML
<div id="include_target">
  ( The content of "include_file.html" will be appearers here. )
</div>
```

Or you can use with data attributes.

```JavaScript
document.addEventListener('DOMContentLoaded', function(){
  const includes = document.querySelectorAll("[data-include]");
  let file,jsinc=[];
  for(let i = 0, ln=includes.length;i<ln;i++){
    file =  includes[i].dataset.include;
    jsinc[i] = new JSInc(includes[i]);
    jsinc[i].load(file);
  }
})
```

```HTML
<div data-include="include_file_01.html">
  ( The content of "include_file_01.html" will be appearers here. )
</div>

<div data-include="include_file_02.html">
  ( The content of "include_file_02.html" will be appearers here. )
</div>

```

## Documents
https://lizard-isana.github.io/jsinc/ (Japanese)

## License
© 2021 Isana Kashiwai (MIT license)

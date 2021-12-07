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

## Documents
https://lizard-isana.github.io/jsinc/ (Japanese)

## License
© 2021 Isana Kashiwai (MIT license)

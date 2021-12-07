# JSInc - JavaScript Client-side Includes
JavaScriptで外部htmlファイルをインクルードするためのライブラリです。

単にファイルを非同期で取得して埋め込むと、ファイルに埋め込まれたCSSが効かなかったり、スクリプトが実行されなかったりしますが、その辺りがちゃんと動くようにしてあります。例えば、インクルードファイルにGTMのタグを埋め込んでも動きます。

また、ファイルの読み込み、HTMLのパース、ページへの埋め込みなどの各過程にHookで割り込めるようにしてあるので、Markdownファイルを読み込んでHTMLに変換して表示したり（この文書はそうやって表示しています）、JSONファイルを読み込んでHTMLのリストに変換して表示させたり、セキュリティ対策でファイルの内容をサニタイズしてから表示する、といったようなことも、比較的簡単にできます。

## Source Code
https://github.com/lizard-isana/jsinc/

## 使い方
1. ライブラリを読み込む
2. DOM要素でJSIncを初期化
3. load()メソッドでファイルを読み込む

```HTML

<script src="/path/to/script/jsinc.min.js"></script>

```

```JavaScript 
document.addEventListener('DOMContentLoaded', function(){
  const element = document.querySelector("#include_target");
  const inc = new JSInc(element);
  inc.load("include_file.html");
})
```

```HTML
<div data-include="include_file.html">
  ( "include_file.html"の内容が表示されます )
</div>
```


あるいは、HTMLのdata属性を使って、ファイル指定をHTML側に書いておけば、JSを書き換えることなくファイルを読み込めます。


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
  ( "include_file_01.html"の内容が表示されます )
</div>

<div data-include="include_file_02.html">
    ( "include_file_02.html"の内容が表示されます )
</div>
```

## Shadow DOM
JSIncの初期化時に、shadowオプションとmodeオプションを設定することで、通常のDOMではなくShadowDOMとしてコンテンツを埋め込むことができます。これにより、インクルード部分はカプセル化され、本体ページとの間でスタイルシートやスクリプトなどが相互に影響されることなく、切り離された状態で埋め込むことができます。

Shadow DOMについての詳しい説明は、以下の参考ページなどを参照して下さい。
cf.[shadow DOM の使い方 - Web Components | MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_shadow_DOM)

```JavaScript
const element = document.querySelector(".target");
const inc = new JSInc(element,{
  shadow:true,
  mode:"open"
});
inc.load("inc.html");
```

## SSI/PHP Includeとの違い
JavaScriptを使用したCSI(Client Side Includes)は、サーバ上で実行される通常のSSI(Server Side Includes)とは異なり、ブラウザ上で一旦ページが構築された後で、わずかに遅れてインクルード部分の外部ファイルが読み込まれます。

このわずかな時間差は、通常のHTMLを表示する場合にはほとんど問題になりませんが、スクリプトなどで、読み込み後のページの内容を操作する場合には、意図した挙動にならない場合があります。

読み込まれたインクルード部分を操作したい場合や、インクルードが読み込まれた後のページ全体を操作したい場合は、別項で説明するHookなどを利用して、適切なタイミングでスクリプトが動作するように設定する必要があります。

### インクルードファイル中のスタイルシートとスクリプトタグ
JSIncは、インクルードファイル中のスタイルシートタグ（style タグとlinkタグ）とスクリプトタグ（埋め込みとリンクの両方のscriptタグ）をファイルの読み込み後にいったん退避させ、ページにインクルードファイルを埋め込んだ後に再適用するという動作をします。これは、インクルードファイル中のスタイルシートとスクリプトをページへの埋め込み後に確実に動作させるための処理です。

ほとんどスクリプトやスタイルシートはこの操作で問題なく動作しますが、一部のスクリプト（特に document.write などでスクリプトが埋め込まれた位置で動作することを意図したものなど）は、意図した動作をしない可能性があることに留意してください。

## Hook
JSIncには、以下のタイミングで個々のコンテンツやページ全体の処理に介入するHookが用意されています。

1. インクルードファイルがサーバからダウンロードされた直後（HTMLとしてパースされる前）
2. HTMLとしてパースされた直後
3. ターゲットの要素内にコンテンツが表示された後
4. (複数のインクルードが使用されていた場合に)全てのコンテンツが表示された後

このうち、1-3 は、ファイルが読み込まれ、 HTMLがパースされ、コンテンツが要素内に展開されるたびに実行されます。これらの処理は個々のファイルごとに非同期で行われているため、読み込みの順番や要素間の参照などは保証されません。4はページ内に複数のインクルードが使用されていた場合でも、ページ全体の表示が終わった後で1度だけ実行されます。要素間での参照が必要な場合はこのタイミングで行う必要があります。

### post_file_load_hook
post_file_load_hook は、ファイルがダウンロードされた後、ファイルの内容がDOMとしてパースされる前に実行されるフックです。引数として、読み込まれたファイルの内容がテキストとして渡されます。returnで戻した内容がHTMLとしてパースされます。

この段階では読み込まれるファイルは必ずしもHTMLである必要はありません。post_file_load_hookで読み込まれたファイルをHTMLに変換すれば、その後のプロセスはHTMLファイルを直接読み込んだ時と同じように実行されます。

以下の例では、Markdownファイルを読みこみ、Markdown-ItでHTML化して戻しています。

```JavaScript
inc.post_file_load_hook(function(file){
  const md = window.markdownit();
  const html = md.render(file);
  return html;
})
```

### post_parse_hook
post_parse_hook は、読み込まれたファイルがHTMLとしてパースされた後、ページに埋め込まれる前に実行されるフックです。引数として、HTMLのDOMとしてパースされたコンテンツが渡されるので、通常のDOM操作でコンテンツにアクセスできます。returnで戻した内容がインクルードとしてページに埋め込まれます。

以下の例では、新たにCSSを読み込み、レンダリングされたコンテンツにスタイルを適用しています。

```JavaScript
inc.post_parse_hook(function(dom){
  const style = document.createElement("link");
  style.setAttribute("rel","stylesheet")
  style.setAttribute("href","./css/inc.css");
  dom.appendChild(style);
  return dom;
})

```

### post_content_load_hook
post_content_load_hook は、ターゲットとなる要素内にコンテンツが埋め込まれた後に実行されるフックです。同一ページ内で複数のインクルードファイルが読み込まれた場合には、それぞれのファイルが埋め込まれる度に実行されます。ただし、他のインクルードが読み込まれているかどうかは問いません。ページ全体を操作する必要がある場合には、次のpost_page_load_hookを使う必要があります。

なお、すでにDOM内にコンテンツが展開された後なので、ShadowDOMをclosedで生成した場合には、post_content_load_hookで外部からDOM内を操作することはできません。

```JavaScript
inc.post_content_load_hook(function(){
  //do somthing
  return;
})
```

### post_page_load_hook
post_page_load_hook は、同一ページ内で複数のインクルードファイルが読み込まれた場合に、全てのインクルードファイルが読み込まれた後で一度だけ実行されます。インクルードファイルを含むページ全体を操作する必要がある場合は、このフックから実行する必要があります。

なお、すでにDOM内にコンテンツが展開された後なので、ShadowDOMをclosedで生成した場合には、post_page_load_hookで外部からDOM内を操作することはできません。

```JavaScript
inc.post_page_load_hook(function(){
  //do somthing
  return;
})
```

## セキュリティ
JSIncは、初期化時やファイルの読み込み時のパラメータや読み込まれるファイルの内容に対して暗黙のバリデーションやサニタイズを行いません。ユーザーの入力やURLクエリを、初期化時のパラメータや読み込みファイルのURLに利用したり、コンテンツとして要素内に展開するような運用にはクロスサイトスクリプティングなどのセキュリティリスクが生じます。

ユーザーが操作可能な値をライブラリに渡す場合は、事前にあるいはHookなどを使って、入力に不正な値が混入しないように処理してください。

以下の例では、読み込むインクルードのファイル名に入力値を使うことを想定して、ライブラリに渡すファイル名をサニタイズしています。

```JavaScript
const file = (function(input_string){
    const str = input_string.split("/").slice(-1)[0]; // ディレクトリトラバーサル/ CORS対策
    return String(str).replace(/&/g, '&amp;')
    .replace(/\?/g, '&#63;')
    .replace(/#/g, '&#35;')
    .replace(/\//g, '&#47;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&#039;') サニタイズ
})()

const path = "./path/to/include/";

const element = document.querySelector("#include_target");
const inc = new JSInc(element);
inc.load(path + file);
```

読み込まれるファイルの内容に対するサニタイズが必要な場合は、`post_file_load_hook` を使用して、HTMLとしてパース前の文字列に対して処理を行います。以下の例では、 [DOMPurify](https://github.com/cure53/DOMPurify) を使用して、入力されたファイルの内容をサニタイズしています。

```JavaScript
inc.post_file_load_hook(function(file){
  const sanitized = DOMPurify.sanitize( file )
  return sanitized;
})
```

## IE11 対応
以下のような指定で`polyfill.io`のポリフィルを読み込むことで表示ができます。
```HTML
<script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2CReflect.set%2Cfetch" crossorigin="anonymous"></script>
<script src="/path/to/script/jsinc.min.js"></script>
```

## License
MIT License ©︎ Isana KASHIWAI 2021 


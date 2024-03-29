import { runTest } from './utils.js'

const regex1 =
  /<html>[\s\S]*<head>[\s\S]*<\/head>[\s\S]*<body>[\s\S]*<\/body>[\s\S]*<\/html>/
const regex2 =
  /<html>[\s\S]*?<head>[\s\S]*?<\/head>[\s\S]*?<body>[\s\S]*?<\/body>[\s\S]*?<\/html>/
const regex3 =
  /<html>(?=([\s\S]*?<head>))\1(?=([\s\S]*?<\/head>))\2(?=([\s\S]*?<body>))\3(?=([\s\S]*?<\/body>))\4(?=([\s\S]*?<\/html>))\5/
let str = ''

runTest('regex1', () => regex1.test(str), 10)
runTest('regex2', () => regex2.test(str), 10)
runTest('regex3', () => regex3.test(str), 10)

str = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/resource/lib/normalize.css">
  <link rel="stylesheet" href="/resource/lib/main.css">
  <link rel="stylesheet" href="/resource/lib/vs.css">
  <script src="/resource/lib/marked.js"></script>
  <script src="/resource/lib/highlight.pack.js"></script>
  <script src="/resource/lib/touch.js"></script>
  <script src="/resource/lib/main.js"></script>
  <title>优质项目</title>
</head>

<body>
  <iframe id="header" src="/header.html" frameborder="0" width="100%" height="36px"></iframe>
  <nav id="sidemenu">
    <div id="togglemenu">菜<br>单<br><span>&gt;</span><span>&lt;</span></div>
    <!-- 以下内容需手动填入 -->
    <h2>优质项目</h2>
    <div>
      <a href="chartjs.md">Chart.js</a>
    </div>
    <h2>D3.js</h2>
    <div>
      <a href="d3/api.md">API</a>
    </div>
    <h2>three.js</h2>
    <div>
      <a href="three/terms.md">名词术语</a>
      <a href="three/quickstart.md">快速起步</a>
      <a href="three/minibook.md">入门指南</a>
      <a href="three/gettingstarted.md">入门教程</a>
    </div>
    <h2>Bootstrap</h2>
    <div>
      <a href="bootstrap.md">Bootstrap V4</a>
    </div>
    <h2>jQuery</h2>
    <div>
      <a href="jquery/jq-sharp.md">锋利的 jQuery</a>
      <a href="jquery/jqevent.md">jQuery 事件</a>
      <a href="jquery/jqplugin.md">jQuery 插件</a>
      <a href="jquery/jqanimate.md">jQuery 动画</a>
    </div>
    <h2>Others</h2>
    <div>
      <a href="https://lodash.com/docs/">Lodash *</a>
    </div>
    <!-- 手动填入到此结束 -->
  </nav>
  <div id="tools"><div id="outline">索引</div><div id="mark" style="display: none;">增/删标记</div></div>
  <main>
    <article id="md"></article>
  </main>
  <iframe id="html" frameborder="0" width="100%" scrolling="no"></iframe>
</body>
`

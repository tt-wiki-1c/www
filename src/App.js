import './assets/style.css'

import {html} from 'lit'
import {unsafeHTML as lit_unsafeHTML} from 'lit/directives/unsafe-html.js';
import {until as lit_until} from 'lit/directives/until.js';

const parseMarkdown = await (async ()=>{
  const md = new (await import("markdown-it")).default({
    // html:true,
    linkify:true,
    breaks:true,
    highlight: await (async ()=>{
      const {default:hljs} = await import('highlight.js')
      return (str, lang)=>{
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch {}
        }
        return ''; // use external default escaping
      }
    })()
  })
  
  const render = (text,inline,a)=>{
    if (a) text = (`
:::: spoiler **n** \`3\`

ii
::: spoiler 2

kk
:::

rr
::::


...
::::: spoiler **a**

b

:::: spoiler **c**

d

::: spoiler **e**

f
:::

g
::::

h
::::::

::: spoiler **JSON**
# [JSON](/0)
# [JSON](https://github.com)
## JSON
### JSON
#### JSON
JSON
##### JSON
###### JSON
\`\`\`json
//
[
  {
    "v":[true,false,null],
    "c":9,
    "b":""
  }
]
\`\`\`
:::
::: spoiler C

# C
\`\`\`c
//
#include <stdio.h>;

int main()
{
  printf("%d",0);
  return 0;
}
\`\`\`
:::
::: spoiler # C++

# C++
\`\`\`c++
//
#include <iostream>
using namespace std;

int main()
{
  cout << "";
  return 0;
}
\`\`\`
:::
::: spoiler \`Java\`
# Java
\`\`\`java
//

import a.j.E;

public static class Main {
  public static void main(String[] args, int a) {
    int c = 0;
    float f = 0.5;
    String xx = "";
    System.out.printLn(fc, ("").toString());
  }
}
\`\`\`
:::
::: spoiler JavaScript

# JavaScript
\`\`\`js
//
import {default as z} from "";

const c = 0;

class A extends Z {
  constructor(...args) {
    super(...args)
    this.c = 1
    this.d = () => {}
    this["o"] = 1
  }
}

let gt = new A();

for (const x of v) {
  ouj(\` k 4
98\${ u(4, \`n\${84}\`, null, [document,0,x,true]) }
\`)
}

console.log(98, "\\n", /^\\s.*$/)
encodeURI(y,s)
function c(u,s) {
  this.u += "itg";
  this.z = {
   k: 93,
   c: 7 == 2 + 5 / 3,
   "r":97
  };
  let [a,b,c] = [true,false,null];
}
\`\`\`
:::
::: spoiler Lua

# Lua
\`\`\`lua
--
table.insert()
a.i()
b()
print(98)
function t:c(u,s)
  self.u = "itg";
  local a,b,c = true,false,nil;
end
local function z(u,s)
  self.u = "itg";
  local a,b,c = true,false,nil;
end
\`\`\`
:::
`)
    /*
    text = (`
\`\`\`yml
#@creatorList

\`\`\`
`)
    */
    /*
    text = (`
-# 88549
`)
    */
    text = md[inline ? "renderInline" : "render"](text)
    return text
  }
  
  md.use((await import("markdown-it-container")).default, 'spoiler', {
    validate: function(params) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const m = token.info.trim().match(/^spoiler\s+(.*)$/)[1];
        // opening tag 
        return `<spoil-er>\n<div slot="summary">${render(m,true)}</div>\n`;
        // return `<details><summary>${md.utils.escapeHtml(m)}</summary>\n`;
      } else {
        // closing tag
        return '</spoil-er>\n';
      }
    }
  });
  
  /*
  .use((await import("markdown-it-container")).default,"infobox",{
    validate: function(params) {
      return params.trim().match(/^infobox\s+(.*)$/)
    }
  })
  */
  /*
  .use((await import("markdown-it-container")).default,"infobox",{
    validate: function(params) {
      return params.trim().match(/^infobox\s+(.*)$/)
    }
  })
  */
  
  return render
})()

export const App = async () => {
  const pageName = (()=>{
    /*
    {
      const params=new URLSearchParams(location.search);
      pageName=params.get("p")
      if (!pageName || pageName.length<1) pageName = "Creator-list";
      pageName = pageName.replaceAll(/\s/g,"-");
      params.set("p",pageName)
      history.replaceState(null,'',`${location.pathname}?${params}`,{})
    }
    */
    const path = location.pathname.split("/")
    const {length} = path
    const oPageName = encodeURIComponent(path[length-1] ?? '')
    const pageName = (()=>{
      let pageName = oPageName.replaceAll(/\s/g,"-")
      if (pageName.length<1) pageName = "Creator-list";
      pageName = decodeURIComponent(pageName);
      return pageName
    })()
    if (pageName !== oPageName) {
      path[length-1] = pageName
      history.replaceState(null,'',`${path.join("/")}${location.search}`,{})
    }
    return `${pageName ?? ''}`
  })()
  
  const md = async ()=>{
    const r = await new Promise((s)=>{
      const fileUrl = `https://raw.githubusercontent.com/1Code-JS/tt-wiki-1c/wiki/pages/${pageName}.md`
      if (true) {
        s(fetch(fileUrl))
        return
      }
      requestAnimationFrame(()=>{
        let u = URL.createObjectURL(new Blob([`
          addEventListener("message",async ({data:fileUrl})=>{
            let o = {cache:"reload"};
            let f; f = async ()=>{
              try {
                return await fetch(fileUrl,o)
              } catch (e) {
                return await f()
              }
            }
            const r = await f(); o = f = undefined
            try {
              postMessage([
                await r.arrayBuffer(),
                {
                  status: r.status,
                  statusText: r.statusText,
                  headers: (()=>{
                    let h = r.headers
                    return [...h.entries()]
                  })()
                }
              ])
            } catch (e) {
              postMessage(e.message)
            }
          })
          globalThis.n = 4
        `.substr(0)],{type:"text/javascript"}))
        let w = new Worker(u,{type:"module"})
        w.addEventListener("message",async ({data})=>{
          if (typeof data == "string") {
            console.error(data)
          } else {
            console.log(data)
            URL.revokeObjectURL(u)
            w.terminate()
            s(new Response(data))
          }
        })
        w.addEventListener("error",(e)=>{
          console.error(e)
          URL.revokeObjectURL(u)
          w.terminate()
        })
        w.postMessage(fileUrl)
      })
    })
    const text = await r.text()
    return r.ok ? parseMarkdown(text,undefined,true) : ""
  }
  
  const timeModified = async ()=>{
    let pages = await fetch("https://raw.githubusercontent.com/1Code-JS/tt-wiki-1c/wiki/pages.json").then((r)=>{
      console.log(r)
      return r.json()
    })
    let {[`${pageName}.md`]:data} = pages.data
    if (data) {
      const timeModified = new Date(data["time modified"])
      return (
        `Last edited on ${timeModified.toDateString()} \
        ${timeModified.toTimeString().match(/\d\d:\d\d:\d\d/)}`
      )
    }
  }
  
  return (html`
    <div id="md-html-output">
      ${lit_until(md().then((t)=>lit_unsafeHTML(t)),'')}
    </div>
    <div id="date-modified">
      <p id="t">${lit_until(timeModified(), '')}</p>
    </div>
    <div id="tlbr">
      <p id="title">${pageName}</p>
      <a id="gh-url" href=${`https://github.com/1Code-JS/tt-wiki-1c/wiki/${pageName}/_edit`}>
        <button style="border-radius: 100%; width: 30px; height: 30px"></button>
      </a>
    </div>
    <p class="subtext">
      &#169;2024 1Code JS<br/>
      This site is neither affiliated with nor endorsed by TheoTown nor it's respective developers.
    </p>
    <spoil-er>
      <div slot="summary">856</div>
      <p>856</p>
    </spoil-er>
  `)
}
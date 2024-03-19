if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.on("vite:afterUpdate",({updates})=>{
    console.log(updates)
  })
};
try {
  (await (import("https://esm.sh/eruda"))).default.init()
} catch {}

import './UI/init.js'
import { App } from './App.js'
import {render as lit_render} from 'lit'



await updatePage()

window.__openURL = window.__openURL ?? ((...a)=>{window.openURL(...a)})
window.openURL = (url)=>{
  if (!url) return
  let e = undefined
  if (typeof url == "object" && Event.prototype.isPrototypeOf(url)) {
    e = url
    url = e.target.getAttribute("href")
  }
  if (typeof url != "string") return
  const {origin} = location
  url = ((url)=>new URL(url,origin))(url);
  if (url.origin!=origin) return
  if (e) e.preventDefault()
  history.pushState(null,'',`${url.pathname}${url.searchParams}${url.hash}`,{})
  updatePage()
}
async function updatePage() {
  lit_render(await App(), document.body)
  for (const a of document.querySelectorAll("a")) {
    a.addEventListener("click",window.__openURL)
  }
  {return}
}
addEventListener("popstate",()=>updatePage());
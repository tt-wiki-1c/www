if (import.meta.hot) {
	(await (import("https://esm.sh/eruda"))).default.init()
	import.meta.hot.accept()
};

import hljs from 'highlight.js'

import {CreatorInfoElement} from '/CreatorInfoElement.js'
import {CreatorListElement} from '/CreatorListElement.js'

const parseMarkdown = await (async ()=>{
	const md = (await import("markdown-it")).default({
		// html:true,
		linkify:true,
		breaks:true,
		highlight: await (async ()=>{
			return (str, lang)=>{
	      if (lang && hljs.getLanguage(lang)) {
	        try {
	          return hljs.highlight(str, { language: lang }).value;
	        } catch (__) {}
	      }
	      return ''; // use external default escaping
			}
		})()
	})
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
	return (text)=>{
		const htmlOutput = document.createElement("div")
		htmlOutput.innerHTML = md.render(text)
		/* htmlOutput.innerHTML = md.render(`
\`\`\`yml
#@creatorList

\`\`\`
`) */
		/* 
		htmlOutput.innerHTML = md.render(`
-# 88549
`)
		*/
		htmlOutput.normalize()
		for (const p of htmlOutput.querySelectorAll("p")) {
			let tn = p.firstChild
			while (tn) {
				if (tn && tn.nodeType === Node.TEXT_NODE) break;
				tn = tn.nextSibling
			}
			if (!tn) continue;
			const {nodeValue} = tn
			const s = nodeValue.substr(2,1)
			if (s != "\n" && s.match(/\s/) && nodeValue.startsWith("-#")) {
				tn.nodeValue = nodeValue.substr(3)
				p.classList.add("subtext")
			}
		}
		return htmlOutput.innerHTML
	}
})()

updatePage()

window.openURL = (url)=>{
	if (!url) return
	let e = undefined
	if (typeof url == "object" && Event.prototype.isPrototypeOf(url)) {
		e = url
		url = e.target.getAttribute("href")
	}
	if (typeof url != "string") return
	url = ((url)=>new URL(url,url))(url);
	if (url.origin!=location.origin) return
	if (e) {
		e.preventDefault()
		e.stopPropagation()
	}
	history.pushState(null,'',`${url.pathname}${url.searchParams}${url.hash}`,{})
	updatePage()
}

async function updatePage() {
	const editUrl = document.getElementById("gh-url")
	const htmlOutput = document.getElementById("md-html-output")
	let pageName
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
	{
		let path = location.pathname.split("/")
		pageName = encodeURIComponent(path[-1] || '').replaceAll(/\s/g,"-")
		if (pageName.length<1) pageName = "Creator-list";
		pageName = decodeURIComponent(pageName);
		path[path.length-1] = pageName
		history.replaceState(null,'',`${path.join("/")}${location.search}`,{})
	}
	
	const pageNameE = ()=>pageName;
	const fileUrl = `https://raw.githubusercontent.com/1Code-JS/tt-wiki-1c/wiki/pages/${pageNameE()}.md`
	const response = await fetch(fileUrl,{cache:"reload"})
	const text = await response.text()
	editUrl.href=`https://github.com/1Code-JS/tt-wiki-1c/wiki/${pageNameE()}/_edit`
	htmlOutput.innerHTML = response.ok ? parseMarkdown(text) : "";
	for (const e of htmlOutput.querySelectorAll("pre")) {
		{
			const {children} = e
			if (!(children.length == 1)) continue
			const ee = children[0]
			if (!(ee.tagName == "CODE" && ee.classList.contains("language-yml"))) continue
		}
		let {textContent} = e
		let aa = (textContent.trim().split("\n")[0] ?? '').match(/^#@(\w+).*$/)
		if (Array.isArray(aa)) {aa = aa[1]} else continue
		switch (aa) {
			case "creatorList": {
				let l =document.createElement("ctr-l")
				e.parentElement.replaceChild(l,e)
				l.reload(textContent)
			}
		}
	}
	/*
	for (const ci of htmlOutput.querySelectorAll("ctr-l")) {
		let p = ci.parentElement
		switch (p.tagName) {
			case "H1": case "H2": case "H3":
			case "H4": case "H5": case "H6": case "P":
			if (p.children.length == 1 && p.innerText.length == 0) {
				p.parentElement.replaceChild(ci,p)
				ci.reload()
			}
		}
	}
	*/
	for (const a of htmlOutput.querySelectorAll("a[href]")) {
		// a.setAttribute("onclick","return false")
		a.addEventListener("click",(...arg)=>openURL(...arg))
	}
}

addEventListener("popstate",()=>updatePage());

try {
	customElements.define("ctr-l",CreatorListElement)
	customElements.define("ctr-i",CreatorInfoElement)
} catch (e) {
	// console.error(e)
}

/*
{
	let cheerio = await import("https://esm.sh/cheerio")
	let a = cheerio.load("<p></p>")
	console.log(a('p'))
	//console.log(a('p').prop("innerHTML"))
}
*/
import YAML from "yaml"
import {CreatorInfoElement} from '/CreatorInfoElement.js'

export class CreatorListElement extends HTMLElement {
	constructor() {
		super()
		this.reload()
	}
	connectedCallback() {
		
	}
	async reload(yaml) {
		this.innerHTML = ""
		/* const yaml = (()=>{
			let [e,p] = []
			e=p=this.nextElementSibling
			if (!e) return
			if (e.tagName == "PRE") {
				e = e.querySelector("code")
				if (!(e && e.parentElement === p)) return
			}
			if (!e.classList.contains("language-yml")) return
			p.remove();
			return e.innerText
		})() */
		if (!yaml) return
		const data = YAML.parse(yaml)
		
		const loadCreators = (pe,countryName,list)=>{
			if (!Array.isArray(list)) return
			for (const {name,forum} of list) {
				let e = document.createElement("li")
				pe.appendChild(e)
				{
					const ee = new CreatorInfoElement()
					e.appendChild(ee)
					e = ee
				}
				e.setAttribute("country",countryName)
				e.setAttribute("name",name ?? '')
				e.setAttribute("forum",forum ?? '')
			}
		}
		
		for (const continentName in data) {
			const continent = data[continentName]
			if (!Object.prototype.isPrototypeOf(continent)) continue;
			let pe = document.createElement("details")
			{
				let e = document.createElement("summary")
				e.innerText = continentName
				pe.appendChild(e)
			}
			this.appendChild(pe)
			{
				const e = document.createElement("ul")
				pe.appendChild(e)
				pe = e
			}
			if (Array.isArray(continent)) {
				loadCreators(pe,continentName, continent)
			} else {
				for (const countryName in continent) {
					loadCreators(pe,countryName,continent[countryName])
				}
			}
		}
		
		return data
	}
}

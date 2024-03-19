import {flag} from "country-emoji"

export class CreatorInfoElement extends HTMLElement {
	constructor() {
		super()
		this.#flagE()
		this.#nameE()
	}
	connectedCallback() {
		this.#flagE()
		this.#nameE()
	}
	
	#flagE() {
		let e = this.querySelector("#flag")
		if (!(e && e.parentElement === this)) {
			e = document.createElement("span")
			e.setAttribute("id","flag")
			this.appendChild(e)
		}
		return e
	}
	#nameE() {
		let e = this.querySelector("#name")
		if (!(e && e.parentElement === this)) {
			e = document.createElement("a")
			e.setAttribute("id","name")
			this.appendChild(e)
		}
		e.addEventListener("click",(...args)=>openURL(...args))
		return e
	}

	static observedAttributes = ["name","country","forum"]
	async attributeChangedCallback(attrName,oldValue,newValue) {
		if (attrName == "country") {
			let flagE = this.#flagE()
			const flagText = `${flag(newValue) ?? ''}`
			flagE.innerText = flagText
			flagE.style.display = flagText.length < 1 ? "none" : null
		} else if (attrName == "name") {
			let nameE = this.#nameE()
			if ((newValue ?? '').length < 1) {
				nameE.innerText = this.getAttribute("forum") ?? '(unknown)'
			} else {
				nameE.innerText = newValue
			}
		} else if (attrName == "forum") {
			let nameE = this.#nameE()
			if ((newValue ?? '').length < 1) {
				nameE.removeAttribute("href")
			} else {
				nameE.href = `https://forum.theotown.com/search.php?author=${encodeURIComponent(newValue)}&fid%5B%5D=43&sc=1&sr=topics&sk=t&sf=firstpost`
			}
			if ((this.getAttribute("name") ?? '').length < 1)
				nameE.innerText = newValue ?? '(unknown)'
		}
	}
}
import {LitElement, css, html} from 'lit';
export default (()=>{
  let C = customElements.get("spoil-er")
  if (C != null) return C
  C = class SpoilerElement extends LitElement {
    static properties = {
      open: {
        type: Boolean,
        reflect: true
      }
    }
    static styles = (css`
      :host {
        display: block;
        background-color: #fff1;
        border: 1px solid #ffffff7f;
        border-radius: 5px;
        margin: 5px;
        animation: 3s;
        overflow: hidden;
        & > #summary {
          display: flex;
          align-items: center;
          min-height: 25px;
          background-color: #fff1;
          & > #toggle {
            min-height: 25px;
          }
          & > #content {
            min-height: 25px;
            background-color: #fff1;
            padding: 0px 5px;
            overflow: hidden;
            & > slot[name="summary"] {
              width: 100%;
              height: 100%;
            }
          }
        }
        & > #content {
          display: grid;
          padding: 0px 10px;
          grid-template-rows: 0fr;
          transition: 0.2s grid-template-rows ease-in-out 0.001ms;
          & > div {
            min-height: 0px;
          }
        } 
      }
      
      :host([open]) > #content {
        grid-template-rows: 1fr;
      }
    `)
    
    #pa;
    updated(changedProperties) {
      if (!changedProperties.has("open")) return
      let a = Math.random(); this.#pa = a
      const {shadowRoot} = this
      const toggle = shadowRoot.querySelector(":host > #summary > #toggle");
      const content = shadowRoot.querySelector(":host > #content");
      const subcontent = content.querySelector(":scope > div");
      if (this.open) subcontent.style.display = null
      else content.addEventListener("transitionstart",()=>{
        if (this.#pa !== a) return
        const {style} = subcontent
        let e0, e1;
        e0 = ()=>{
          content.removeEventListener("transitioncancel",e1)
          style.display = "none"
        }
        e1 = ()=>{
          content.removeEventListener("transitionend",e0)
          style.display = null
        }
        content.addEventListener("transitionend",e0,{once:true})
        content.addEventListener("transitioncancel",e1,{once:true})
      },{once:true})
    }
    
    constructor() {
      super()
      this.open = false
    }
    
    render() {
      return (html`
        <div id="summary" @click="${()=>{this.open = !this.open}}">
          <button id="toggle">${this.open ? "Hide" : "Show"}</button>
          <div id="content">
            <slot name="summary"></slot>
          </div>
        </div>
        <div id="content">
          <div style="display: none;">
            <slot/>
          </div>
        </div>
      `)
    }
  }
  customElements.define("spoil-er",C)
  return C
})()
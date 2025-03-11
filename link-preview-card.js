/**
 * Copyright 2025 macygmac
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { ref } from "lit/directives/ref.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.url = "http://hax.psu.edu";
    this.description = "";  
    this.data = {};
    this.image = "";
    this.loading = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
    
  }


  updated(changedProperties) { 
    super.updated(changedProperties);
    if (changedProperties.has("url")) {
      this.data = this.getData(this.url);
    }
  }

  

  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    this.title = json.data.title;
    this.description = json.data.description;
    this.url = json.data.url;
    this.image = json.data.image;
  } catch (error) {
      console.error(error.message);
      }
    }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      data: { type: Object },
      url: { type: String },
      description: { type: String },
      image: { type: String },
      loading: { type: Boolean, reflect: true },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <div>${this.title}</div>
  <div>${this.url}</div>
  <div>${this.description}</div> 
  <div>${this.image}</div>

  

</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);



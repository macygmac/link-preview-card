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
    this.url = "";
    this.description = "";  
    this.data = {};
    this.image = "";
    this.link = "";
    this.loading = false;
    
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
    this.loading = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    this.title = json.data.title;
    this.description = json.data.description;
    this.link = json.data["url"] || link;
    this.image = json.data["og:image"] || json.data["apple-touch-icon"] || json.data["image"] || "";
  } catch (error) {
      console.error(error.message);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      }
      finally {
        this.loading = false;
      }
    }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      data: { type: Object },
      url: { type: String },
      link: { type: String },
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
        border-radius: var(--ddd-radius-sm);
        padding: var(--ddd-spacing-3);
        max-width: 400px;
        border: var(--ddd-border-xs);
        
      }
      img { 
        max-width: 100%;
        border-radius: var(--ddd-radius-sm);  
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }

      .loading-spinner {
        margin: 20px auto;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="preview" part="preview">
        ${this.loading
          ? html`<div class="loading-spinner" part="loading-spinner"></div>`
          : html`
            ${this.image ? html`<img src="${this.image}" alt="Preview Image" />` : ''}
            <div class="content" part="content">
              <h3 class="title" part="title">${this.title}</h3>
              <p class="desc" part="desc">${this.description}</p>
              <a href="${this.link}" target="_blank" class="url" part="url">Visit Site</a>
            </div>
        `}
      </div>
    `;
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



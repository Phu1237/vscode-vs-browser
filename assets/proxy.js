customElements.define(
  "using-proxy",
  class extends HTMLIFrameElement {
    static get observedAttributes() {
      return ["src"];
    }
    constructor() {
      super();
    }
    attributeChangedCallback() {
      this.load(this.src);
    }
    connectedCallback() {
      this.sandbox =
        "" + this.sandbox ||
        "allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"; // all except allow-top-navigation
    }
    load(url, options) {
      if (!url || !url.startsWith("http")) {
        throw new Error(`Proxy src ${url} does not start with http(s)://`);
      }
      console.log("Proxy loading:", url);
      this.srcdoc = `<html>
<head>
	<style>
	.loader {
		position: absolute;
		top: calc(50% - 25px);
		left: calc(50% - 25px);
		width: 50px;
		height: 50px;
		background-color: #333;
		border-radius: 50%;
		animation: loader 1s infinite ease-in-out;
	}
	@keyframes loader {
		0% {
		transform: scale(0);
		}
		100% {
		transform: scale(1);
		opacity: 0;
		}
	}
	</style>
</head>
<body>
	<div class="loader"></div>
</body>
</html>`;
      this.fetchProxy(url, options, 0)
        .then((res) => res.text())
        .then((data) => {
          if (data) {
            this.srcdoc = data.replace(
              /<head([^>]*)>/i,
              `<head$1>
	<base href="${url}">
	<script>
	// Proxy navigation event handlers
	document.addEventListener('click', e => {
		if (frameElement && document.activeElement && document.activeElement.href) {
			e.preventDefault()
			frameElement.load(document.activeElement.href)
		}
	})
	document.addEventListener('submit', e => {
    console.log('submit', e.target);
		if (frameElement && document.activeElement && document.activeElement.form && document.activeElement.form.action) {
			e.preventDefault()
			if (document.activeElement.form.method === 'post') {
        console.log('post');
				frameElement.load(document.activeElement.form.action, {method: 'post', body: new FormData(document.activeElement.form)})
      } else {
        console.log('get');
				frameElement.load(document.activeElement.form.action + '?' + new URLSearchParams(new FormData(document.activeElement.form)))
      }
		}
	})
	</script>
  `
            );
            this.setAttribute("srcurl", url);
          }
        })
        .catch((e) => console.error("Cannot load Proxy:", e));
    }
    fetchProxy(url, options, i) {
      let proxies = (options || {}).proxies || [
        // 'https://morning-sea-28950.herokuapp.com/',
        // 'https://yacdn.org/proxy/',
        window.localProxy,
        "https://api.codetabs.com/v1/proxy/?quest=",
      ];
      // clean up the array with undefined values
      proxies = proxies.filter((p) => !!p);
      return fetch(proxies[i] + url, options)
        .then((res) => {
          if (!window.forceLocation) {
            if (!res.ok) {
              throw new Error(`${res.status} ${res.statusText}`);
            }
          }
          return res;
        })
        .catch((error) => {
          if (i === proxies.length - 1) {
            throw error;
          }
          return this.fetchProxy(url, options, i + 1);
        });
    }
  },
  { extends: "iframe" }
);

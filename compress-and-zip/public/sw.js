if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise(async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()})),s.then(()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]})},s=(s,a)=>{Promise.all(s.map(e)).then(e=>a(1===e.length?e[0]:e))},a={require:Promise.resolve(s)};self.define=(s,i,n)=>{a[s]||(a[s]=Promise.resolve().then(()=>{let a={};const c={uri:location.origin+s.slice(1)};return Promise.all(i.map(s=>{switch(s){case"exports":return a;case"module":return c;default:return e(s)}})).then(e=>{const s=n(...e);return a.default||(a.default=s),a})}))}}define("./sw.js",["./workbox-8778d57b"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/UDz1sdNGZ_E1WDjs1RaP7/_buildManifest.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/UDz1sdNGZ_E1WDjs1RaP7/_ssgManifest.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/commons.ad1dd656b127b586e70d.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/f6078781a05fe1bcb0902d23dbbb2662c8d200b3.47b8922ced02d1ddaa2f.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/framework.9ec1f7868b3e9d138cdd.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/main-be97445bf657ebd52555.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/pages/_app-9134881b6385deb46688.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/pages/_error-3834583bd75ba06a2470.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/pages/index-fff2531bbb5146e965e1.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/polyfills-57d8738e7416f8423303.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/chunks/webpack-e067438c4cf4ef2ef178.js",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/css/87cbb10d7bd54a65b806.css",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/_next/static/css/dc12a86eade222bfb994.css",revision:"UDz1sdNGZ_E1WDjs1RaP7"},{url:"/favicon.ico",revision:"21b739d43fcb9bbb83d8541fe4fe88fa"},{url:"/icons/apple-icon-180.png",revision:"3777788fb35d648fc64dba3747d331bd"},{url:"/icons/apple-splash-1125-2436.jpg",revision:"51cf6052376172ff54b6b6c7db4c3190"},{url:"/icons/apple-splash-1136-640.jpg",revision:"d4123dbd9100ee37712efc96258ed351"},{url:"/icons/apple-splash-1170-2532.jpg",revision:"3d8d9c7a3d79834be4dac5b7fa8aa58d"},{url:"/icons/apple-splash-1242-2208.jpg",revision:"542dee7087b8a702e9e7ea5fb713bfa6"},{url:"/icons/apple-splash-1242-2688.jpg",revision:"0bac500304274c45015ac2456da51bcc"},{url:"/icons/apple-splash-1284-2778.jpg",revision:"86386956f6b52b10ed0c61fab4ddd129"},{url:"/icons/apple-splash-1334-750.jpg",revision:"f0e9d9c783e1708a32dc6ea000914181"},{url:"/icons/apple-splash-1536-2048.jpg",revision:"83436ae0fd5504469a6ff029f5e855dc"},{url:"/icons/apple-splash-1620-2160.jpg",revision:"9b47e14fe625ab5bc897049fe5944e8c"},{url:"/icons/apple-splash-1668-2224.jpg",revision:"f3bad76eae74fbe137e47f02c4b65791"},{url:"/icons/apple-splash-1668-2388.jpg",revision:"bef5a1772567fff6f38a212623732c89"},{url:"/icons/apple-splash-1792-828.jpg",revision:"0ec316f04594a88fc354cfa83767d7ec"},{url:"/icons/apple-splash-2048-1536.jpg",revision:"194d27ef9846270d14048eece77b99f2"},{url:"/icons/apple-splash-2048-2732.jpg",revision:"a1afe24f5890c13ab990bb7933670ffb"},{url:"/icons/apple-splash-2160-1620.jpg",revision:"ee50060aad39fe4bf2d3f6230d981edf"},{url:"/icons/apple-splash-2208-1242.jpg",revision:"c1a62f7d243a6727f0597d15916d075f"},{url:"/icons/apple-splash-2224-1668.jpg",revision:"8c66ef51bedfa6095dac486ca17d1cd4"},{url:"/icons/apple-splash-2388-1668.jpg",revision:"e43e8b3d01aba5a21bbee494aed43cfc"},{url:"/icons/apple-splash-2436-1125.jpg",revision:"e542dd043d1f383b4614cd7ba7cea96a"},{url:"/icons/apple-splash-2532-1170.jpg",revision:"9eb9fc827114d598192bc77434754e9b"},{url:"/icons/apple-splash-2688-1242.jpg",revision:"c0c45058213745b1e3bd8a698255bf03"},{url:"/icons/apple-splash-2732-2048.jpg",revision:"3e48aa7cd2fbf6e82522100249b59326"},{url:"/icons/apple-splash-2778-1284.jpg",revision:"daf1c52da5c073f41daf0eb8611137ea"},{url:"/icons/apple-splash-640-1136.jpg",revision:"d9ffe04964a6a864f59a296de8bfb4f5"},{url:"/icons/apple-splash-750-1334.jpg",revision:"e48eabdb4bb2fb829ad42028ed051080"},{url:"/icons/apple-splash-828-1792.jpg",revision:"5247600c9019ee3c32bb63cc5dcf8d50"},{url:"/icons/manifest-icon-192.png",revision:"0a8486ec77ec4112c9112840d4dce211"},{url:"/icons/manifest-icon-512.png",revision:"a03e86aa95c99d9477e049c8f34df8a1"},{url:"/info.svg",revision:"b7e4e3bacb9ca5999c6336db6cc7b89c"},{url:"/manifest.json",revision:"8e372d1caa1709082a4dac0c445311ce"},{url:"/siteLogo.png",revision:"a101e5ea42bd210032a880f86f900e95"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[new e.ExpirationPlugin({maxEntries:1,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\/api\/.*$/i,new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/.*/i,new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET")}));

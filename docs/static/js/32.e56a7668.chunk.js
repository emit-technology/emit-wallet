(this["webpackJsonpemit-wallet"]=this["webpackJsonpemit-wallet"]||[]).push([[32],{1151:function(t,e,n){"use strict";n.r(e),n.d(e,"ion_route",(function(){return c})),n.d(e,"ion_route_redirect",(function(){return s})),n.d(e,"ion_router",(function(){return D})),n.d(e,"ion_router_link",(function(){return L}));var r=n(8),o=n(40),i=n(41),u=n(45),a=n(1187),c=function(){function t(t){Object(o.o)(this,t),this.ionRouteDataChanged=Object(o.g)(this,"ionRouteDataChanged",7),this.url=""}return t.prototype.onUpdate=function(t){this.ionRouteDataChanged.emit(t)},t.prototype.onComponentProps=function(t,e){if(t!==e){var n=t?Object.keys(t):[],r=e?Object.keys(e):[];if(n.length===r.length)for(var o=0,i=n;o<i.length;o++){var u=i[o];if(t[u]!==e[u])return void this.onUpdate(t)}else this.onUpdate(t)}},t.prototype.connectedCallback=function(){this.ionRouteDataChanged.emit()},Object.defineProperty(t,"watchers",{get:function(){return{url:["onUpdate"],component:["onUpdate"],componentProps:["onComponentProps"]}},enumerable:!1,configurable:!0}),t}(),s=function(){function t(t){Object(o.o)(this,t),this.ionRouteRedirectChanged=Object(o.g)(this,"ionRouteRedirectChanged",7)}return t.prototype.propDidChange=function(){this.ionRouteRedirectChanged.emit()},t.prototype.connectedCallback=function(){this.ionRouteRedirectChanged.emit()},Object.defineProperty(t,"watchers",{get:function(){return{from:["propDidChange"],to:["propDidChange"]}},enumerable:!1,configurable:!0}),t}(),h=function(t){return"/"+t.filter((function(t){return t.length>0})).join("/")},l=function(t){if(null==t)return[""];var e=t.split("?")[0].split("/").map((function(t){return t.trim()})).filter((function(t){return t.length>0}));return 0===e.length?[""]:e},f=function t(e,n,o,i,u,a){return void 0===u&&(u=!1),Object(r.a)(void 0,void 0,void 0,(function(){var c,s,h,l;return Object(r.c)(this,(function(r){switch(r.label){case 0:return r.trys.push([0,6,,7]),c=v(e),i>=n.length||!c?[2,u]:[4,c.componentOnReady()];case 1:return r.sent(),s=n[i],[4,c.setRouteId(s.id,s.params,o,a)];case 2:return(h=r.sent()).changed&&(o="root",u=!0),[4,t(h.element,n,o,i+1,u,a)];case 3:return u=r.sent(),h.markVisible?[4,h.markVisible()]:[3,5];case 4:r.sent(),r.label=5;case 5:return[2,u];case 6:return l=r.sent(),console.error(l),[2,!1];case 7:return[2]}}))}))},d=function(t){return Object(r.a)(void 0,void 0,void 0,(function(){var e,n,o,i;return Object(r.c)(this,(function(r){switch(r.label){case 0:e=[],o=t,r.label=1;case 1:return(n=v(o))?[4,n.getRouteId()]:[3,3];case 2:return(i=r.sent())?(o=i.element,i.element=void 0,e.push(i),[3,4]):[3,5];case 3:return[3,5];case 4:return[3,1];case 5:return[2,{ids:e,outlet:n}]}}))}))},p=":not([no-router]) ion-nav, :not([no-router]) ion-tabs, :not([no-router]) ion-router-outlet",v=function(t){if(t){if(t.matches(p))return t;var e=t.querySelector(p);return e||void 0}},b=function(t,e){return e.find((function(e){return function(t,e){var n=e.from;if(void 0===e.to)return!1;if(n.length>t.length)return!1;for(var r=0;r<n.length;r++){var o=n[r];if("*"===o)return!0;if(o!==t[r])return!1}return n.length===t.length}(t,e)}))},g=function(t,e){for(var n=Math.min(t.length,e.length),r=0;r<n&&t[r].toLowerCase()===e[r].id;r++);return r},m=function(t,e){for(var n,r=new O(t),o=!1,i=0;i<e.length;i++){var u=e[i].path;if(""===u[0])o=!0;else{for(var a=0,c=u;a<c.length;a++){var s=c[a],h=r.next();if(":"===s[0]){if(""===h)return null;((n=n||[])[i]||(n[i]={}))[s.slice(1)]=h}else if(h!==s)return null}o=!1}}return!o||o===(""===r.next())?n?e.map((function(t,e){return{id:t.id,path:t.path,params:w(t.params,n[e])}})):e:null},w=function(t,e){return!t&&e?e:t&&!e?t:t&&e?Object.assign(Object.assign({},t),e):void 0},y=function(t,e){for(var n=null,r=0,o=0,i=e;o<i.length;o++){var u=i[o],a=m(t,u);if(null!==a){var c=j(a);c>r&&(r=c,n=a)}}return n},j=function(t){for(var e=1,n=1,r=0,o=t;r<o.length;r++)for(var i=0,u=o[r].path;i<u.length;i++){var a=u[i];":"===a[0]?e+=Math.pow(1,n):""!==a&&(e+=Math.pow(2,n)),n++}return e},O=function(){function t(t){this.path=t.slice()}return t.prototype.next=function(){return this.path.length>0?this.path.shift():""},t}(),R=function(t){return Array.from(t.children).filter((function(t){return"ION-ROUTE-REDIRECT"===t.tagName})).map((function(t){var e=E(t,"to");return{from:l(E(t,"from")),to:null==e?void 0:l(e)}}))},C=function(t){return k(P(t))},P=function t(e,n){return void 0===n&&(n=e),Array.from(n.children).filter((function(t){return"ION-ROUTE"===t.tagName&&t.component})).map((function(n){var r=E(n,"component");if(null==r)throw new Error("component missing in ion-route");return{path:l(E(n,"url")),id:r.toLowerCase(),params:n.componentProps,beforeLeave:n.beforeLeave,beforeEnter:n.beforeEnter,children:t(e,n)}}))},E=function(t,e){return e in t?t[e]:t.hasAttribute(e)?t.getAttribute(e):null},k=function(t){for(var e=[],n=0,r=t;n<r.length;n++){var o=r[n];S([],e,o)}return e},S=function t(e,n,r){var o=e.slice();if(o.push({id:r.id,path:r.path,params:r.params,beforeLeave:r.beforeLeave,beforeEnter:r.beforeEnter}),0!==r.children.length)for(var i=0,u=r.children;i<u.length;i++){t(o,n,u[i])}else n.push(o)},D=function(){function t(t){Object(o.o)(this,t),this.ionRouteWillChange=Object(o.g)(this,"ionRouteWillChange",7),this.ionRouteDidChange=Object(o.g)(this,"ionRouteDidChange",7),this.previousPath=null,this.busy=!1,this.state=0,this.lastState=0,this.root="/",this.useHash=!0}return t.prototype.componentWillLoad=function(){return Object(r.a)(this,void 0,void 0,(function(){return Object(r.c)(this,(function(t){switch(t.label){case 0:return console.debug("[ion-router] router will load"),[4,v(document.body)?Promise.resolve():new Promise((function(t){window.addEventListener("ionNavWillLoad",t,{once:!0})}))];case 1:return t.sent(),console.debug("[ion-router] found nav"),[4,this.onRoutesChanged()];case 2:return t.sent(),[2]}}))}))},t.prototype.componentDidLoad=function(){window.addEventListener("ionRouteRedirectChanged",Object(u.m)(this.onRedirectChanged.bind(this),10)),window.addEventListener("ionRouteDataChanged",Object(u.m)(this.onRoutesChanged.bind(this),100))},t.prototype.onPopState=function(){return Object(r.a)(this,void 0,void 0,(function(){var t,e,n;return Object(r.c)(this,(function(r){switch(r.label){case 0:return t=this.historyDirection(),e=this.getPath(),[4,this.runGuards(e)];case 1:return!0!==(n=r.sent())?("object"===typeof n&&(e=l(n.redirect)),[2,!1]):(console.debug("[ion-router] URL changed -> update nav",e,t),[2,this.writeNavStateRoot(e,t)])}}))}))},t.prototype.onBackButton=function(t){var e=this;t.detail.register(0,(function(t){e.back(),t()}))},t.prototype.canTransition=function(){return Object(r.a)(this,void 0,void 0,(function(){var t;return Object(r.c)(this,(function(e){switch(e.label){case 0:return[4,this.runGuards()];case 1:return!0!==(t=e.sent())?"object"===typeof t?[2,t.redirect]:[2,!1]:[2,!0]}}))}))},t.prototype.push=function(t,e,n){return void 0===e&&(e="forward"),Object(r.a)(this,void 0,void 0,(function(){var o,i,u;return Object(r.c)(this,(function(r){switch(r.label){case 0:return t.startsWith(".")&&(t=new URL(t,window.location.href).pathname),console.debug("[ion-router] URL pushed -> updating nav",t,e),o=l(t),i=t.split("?")[1],[4,this.runGuards(o)];case 1:if(!0!==(u=r.sent())){if("object"!==typeof u)return[2,!1];o=l(u.redirect),i=u.redirect.split("?")[1]}return this.setPath(o,e,i),[2,this.writeNavStateRoot(o,e,n)]}}))}))},t.prototype.back=function(){return window.history.back(),Promise.resolve(this.waitPromise)},t.prototype.printDebug=function(){return Object(r.a)(this,void 0,void 0,(function(){return Object(r.c)(this,(function(t){return console.debug("CURRENT PATH",this.getPath()),console.debug("PREVIOUS PATH",this.previousPath),function(t){console.group("[ion-core] ROUTES["+t.length+"]");for(var e=function(t){var e=[];t.forEach((function(t){return e.push.apply(e,t.path)}));var n=t.map((function(t){return t.id}));console.debug("%c "+h(e),"font-weight: bold; padding-left: 20px","=>\t","("+n.join(", ")+")")},n=0,r=t;n<r.length;n++){e(r[n])}console.groupEnd()}(C(this.el)),function(t){console.group("[ion-core] REDIRECTS["+t.length+"]");for(var e=0,n=t;e<n.length;e++){var r=n[e];r.to&&console.debug("FROM: ","$c "+h(r.from),"font-weight: bold"," TO: ","$c "+h(r.to),"font-weight: bold")}console.groupEnd()}(R(this.el)),[2]}))}))},t.prototype.navChanged=function(t){return Object(r.a)(this,void 0,void 0,(function(){var e,n,o,i,u,a;return Object(r.c)(this,(function(r){switch(r.label){case 0:return this.busy?(console.warn("[ion-router] router is busy, navChanged was cancelled"),[2,!1]):[4,d(window.document.body)];case 1:return e=r.sent(),n=e.ids,o=e.outlet,i=C(this.el),(u=function(t,e){for(var n=null,r=0,o=t.map((function(t){return t.id})),i=0,u=e;i<u.length;i++){var a=u[i],c=g(o,a);c>r&&(n=a,r=c)}return n?n.map((function(e,n){return{id:e.id,path:e.path,params:w(e.params,t[n]&&t[n].params)}})):null}(n,i))?(a=function(t){for(var e=[],n=0,r=t;n<r.length;n++)for(var o=r[n],i=0,u=o.path;i<u.length;i++){var a=u[i];if(":"===a[0]){var c=o.params&&o.params[a.slice(1)];if(!c)return null;e.push(c)}else""!==a&&e.push(a)}return e}(u))?(console.debug("[ion-router] nav changed -> update URL",n,a),this.setPath(a,t),[4,this.safeWriteNavState(o,u,"root",a,null,n.length)]):(console.warn("[ion-router] router could not match path because some required param is missing"),[2,!1]):(console.warn("[ion-router] no matching URL for ",n.map((function(t){return t.id}))),[2,!1]);case 2:return r.sent(),[2,!0]}}))}))},t.prototype.onRedirectChanged=function(){var t=this.getPath();t&&b(t,R(this.el))&&this.writeNavStateRoot(t,"root")},t.prototype.onRoutesChanged=function(){return this.writeNavStateRoot(this.getPath(),"root")},t.prototype.historyDirection=function(){var t=window;null===t.history.state&&(this.state++,t.history.replaceState(this.state,t.document.title,t.document.location&&t.document.location.href));var e=t.history.state,n=this.lastState;return this.lastState=e,e>n||e>=n&&n>0?"forward":e<n?"back":"root"},t.prototype.writeNavStateRoot=function(t,e,n){return Object(r.a)(this,void 0,void 0,(function(){var o,i,u,a,c;return Object(r.c)(this,(function(r){return t?(o=R(this.el),i=b(t,o),u=null,i&&(this.setPath(i.to,e),u=i.from,t=i.to),a=C(this.el),(c=y(t,a))?[2,this.safeWriteNavState(document.body,c,e,t,u,0,n)]:(console.error("[ion-router] the path does not match any route"),[2,!1])):(console.error("[ion-router] URL is not part of the routing set"),[2,!1])}))}))},t.prototype.safeWriteNavState=function(t,e,n,o,i,u,a){return void 0===u&&(u=0),Object(r.a)(this,void 0,void 0,(function(){var c,s,h;return Object(r.c)(this,(function(r){switch(r.label){case 0:return[4,this.lock()];case 1:c=r.sent(),s=!1,r.label=2;case 2:return r.trys.push([2,4,,5]),[4,this.writeNavState(t,e,n,o,i,u,a)];case 3:return s=r.sent(),[3,5];case 4:return h=r.sent(),console.error(h),[3,5];case 5:return c(),[2,s]}}))}))},t.prototype.lock=function(){return Object(r.a)(this,void 0,void 0,(function(){var t,e;return Object(r.c)(this,(function(n){switch(n.label){case 0:return t=this.waitPromise,this.waitPromise=new Promise((function(t){return e=t})),void 0===t?[3,2]:[4,t];case 1:n.sent(),n.label=2;case 2:return[2,e]}}))}))},t.prototype.runGuards=function(t,e){return void 0===t&&(t=this.getPath()),void 0===e&&(e=l(this.previousPath)),Object(r.a)(this,void 0,void 0,(function(){var n,o,i,u,a,c,s,h,l;return Object(r.c)(this,(function(r){switch(r.label){case 0:return t&&e?(n=C(this.el),o=y(t,n),i=y(e,n),u=o&&o[o.length-1].beforeEnter,(a=i&&i[i.length-1].beforeLeave)?[4,a()]:[3,2]):[2,!0];case 1:return s=r.sent(),[3,3];case 2:s=!0,r.label=3;case 3:return!1===(c=s)||"object"===typeof c?[2,c]:u?[4,u()]:[3,5];case 4:return l=r.sent(),[3,6];case 5:l=!0,r.label=6;case 6:return!1===(h=l)||"object"===typeof h?[2,h]:[2,!0]}}))}))},t.prototype.writeNavState=function(t,e,n,o,i,u,a){return void 0===u&&(u=0),Object(r.a)(this,void 0,void 0,(function(){var c,s;return Object(r.c)(this,(function(r){switch(r.label){case 0:return this.busy?(console.warn("[ion-router] router is busy, transition was cancelled"),[2,!1]):(this.busy=!0,(c=this.routeChangeEvent(o,i))&&this.ionRouteWillChange.emit(c),[4,f(t,e,n,u,!1,a)]);case 1:return s=r.sent(),this.busy=!1,s&&console.debug("[ion-router] route changed",o),c&&this.ionRouteDidChange.emit(c),[2,s]}}))}))},t.prototype.setPath=function(t,e,n){this.state++,function(t,e,n,o,i,u,a){var c=h(Object(r.e)(l(e),o));n&&(c="#"+c),void 0!==a&&(c=c+"?"+a),"forward"===i?t.pushState(u,"",c):t.replaceState(u,"",c)}(window.history,this.root,this.useHash,t,e,this.state,n)},t.prototype.getPath=function(){return function(t,e,n){var r=t.pathname;if(n){var o=t.hash;r="#"===o[0]?o.slice(1):""}return function(t,e){if(t.length>e.length)return null;if(t.length<=1&&""===t[0])return e;for(var n=0;n<t.length;n++)if(t[n].length>0&&t[n]!==e[n])return null;return e.length===t.length?[""]:e.slice(t.length)}(l(e),l(r))}(window.location,this.root,this.useHash)},t.prototype.routeChangeEvent=function(t,e){var n=this.previousPath,r=h(t);return this.previousPath=r,r===n?null:{from:n,redirectedFrom:e?h(e):null,to:r}},Object.defineProperty(t.prototype,"el",{get:function(){return Object(o.k)(this)},enumerable:!1,configurable:!0}),t}(),L=function(){function t(t){var e=this;Object(o.o)(this,t),this.routerDirection="forward",this.onClick=function(t){Object(a.d)(e.href,t,e.routerDirection,e.routerAnimation)}}return t.prototype.render=function(){var t,e=Object(i.b)(this),n={href:this.href,rel:this.rel,target:this.target};return Object(o.j)(o.c,{onClick:this.onClick,class:Object(a.a)(this.color,(t={},t[e]=!0,t["ion-activatable"]=!0,t))},Object(o.j)("a",Object.assign({},n),Object(o.j)("slot",null)))},t}();L.style=":host{--background:transparent;--color:var(--ion-color-primary, #3880ff);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}"},1187:function(t,e,n){"use strict";n.d(e,"a",(function(){return i})),n.d(e,"b",(function(){return u})),n.d(e,"c",(function(){return o})),n.d(e,"d",(function(){return c}));var r=n(8),o=function(t,e){return null!==e.closest(t)},i=function(t,e){var n;return"string"===typeof t&&t.length>0?Object.assign(((n={"ion-color":!0})["ion-color-"+t]=!0,n),e):e},u=function(t){var e={};return function(t){return void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter((function(t){return null!=t})).map((function(t){return t.trim()})).filter((function(t){return""!==t})):[]}(t).forEach((function(t){return e[t]=!0})),e},a=/^[a-z][a-z0-9+\-.]*:/,c=function(t,e,n,o){return Object(r.a)(void 0,void 0,void 0,(function(){var i;return Object(r.c)(this,(function(r){return null!=t&&"#"!==t[0]&&!a.test(t)&&(i=document.querySelector("ion-router"))?(null!=e&&e.preventDefault(),[2,i.push(t,n,o)]):[2,!1]}))}))}}}]);
//# sourceMappingURL=32.e56a7668.chunk.js.map
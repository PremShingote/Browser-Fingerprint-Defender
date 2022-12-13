(() => {
    "use strict";
    var e, t = { // Declared veriable e & t
        7107: (e, t, r) => {
            var s = r(6682);
            class n {
                constructor(...e) {
                    this.handlers = {}, e.forEach((e => {
                        Object.defineProperty(this.handlers, e.name(), {
                            value: e,
                            writable: !1
                        })
                    }))
                }
                handle(e) { // e = Exception of program (if error occour then do this)
                    if (!this.handlers.hasOwnProperty(e.method)) throw new Error(`Unregistered method requested: ${e.method}`);
                    return this.handlers[e.method].handle(e)
                }
            }
            const i = "version"; // i = version which show the version of plugin and browser
            class a { // define class a
                name() {
                    return i
                }
                handle(e) {
                    return {
                        payload: {
                            version: chrome.runtime.getManifest().version
                        }
                    }
                }
            }
            var o, c = r(3958); // define value for o and c 

            function l(e, t) { // Defined 2 functions e, t
                const r = {
                    path: {}
                };
                switch (e) { // logos change if extension is enabled or DISABLED
                    case o.Inactive:
                        r.path = {
                            48: "icons/logo/48-gray.png", //Fetch INACTIVE icon for extension menu (small icon)
                            128: "icons/logo/128-gray.png" //Fetch INACTIVE icon for Setting menu (Big icon)
                        };
                        break;
                    case o.Active:
                        r.path = {
                            48: "icons/logo/48.png", //Fetch ACTIVE icon for extension menu (small icon)
                            128: "icons/logo/128.png" //Fetch ACTIVE icon for extension menu (Big icon)
                        }
                }
                "number" == typeof t && (r.tabId = t), chrome.browserAction.setIcon(r)
            } ! function (e) {
                e[e.Active = 0] = "Active", e[e.Inactive = 1] = "Inactive" // Functionality Active / Inactive switch
            }(o || (o = {}));
            class u {
                constructor(e, t) {
                    this.intervalMillis = e, this.handler = t
                }
                start() {
                    this.timer = window.setInterval(this.handler, this.intervalMillis)
                }
                isStarted() {
                    return void 0 !== this.timer
                }
                stop() {
                    void 0 !== this.timer && window.clearInterval(this.timer), this.timer = void 0
                }
                restart() {
                    this.stop(), this.start()
                }
                setIntervalMillis(e) {
                    this.intervalMillis = e, this.isStarted() && this.restart()
                }
                getIntervalMillis() {
                    return this.intervalMillis
                }
            }
            const h = "refresh-useragent"; // Get new user agaent identity code
            class d {
                constructor(e) {
                    this.useragentService = e
                }
                name() {
                    return h
                }
                handle(e) {
                    const t = this.useragentService.renew();
                    return {
                        payload: {
                            previous: t.previous,
                            new: t.new
                        }
                    }
                }
            }
            const m = "enabled-for-domain"; // Enable on this domain switch Enable / Disable
            class g {
                constructor(e) {
                    this.filterService = e
                }
                name() {
                    return m
                }
                handle(e) {
                    return {
                        payload: {
                            enabled: this.filterService.enabledForDomain(e.payload.domain)
                        }
                    }
                }
            }
            const p = "change-for-domain";
            class w {
                constructor(e) {
                    this.filterService = e
                }
                name() {
                    return p
                }
                handle(e) {
                    return this.filterService.changeForDomain(e.payload.domain, e.payload.enable), {
                        payload: {}
                    }
                }
            }
            const b = "applicable-to-uri";
            class f {
                constructor(e) {
                    this.filterService = e
                }
                name() {
                    return b
                }
                handle(e) {
                    return {
                        payload: {
                            applicable: this.filterService.applicableToURI(e.payload.uri)
                        }
                    }
                }
            }
            var v = r(2238),
                y = r.n(v);
            class k {
                constructor(e, t, r, s) { // Define Constructor settings = e, useragent = t, generator = r, remoteList = s
                    this.settings = e, this.useragent = t, this.generator = r, this.remoteList = s
                }
                renew() {
                    const e = this.useragent.get().info,
                        t = this.settings.get(),
                        r = t.customUseragent.enabled,
                        s = t.remoteUseragentList.enabled;
                    let n, i;
                    switch (!0) {
                        case r && s:
                            Math.random() < .5 ? (n = this.custom(), i = "custom_agents_list") : (n = this.remote(), i = "remote_list");
                            break;
                        case r:
                            n = this.custom(), i = "custom_agents_list";
                            break;
                        case s:
                            n = this.remote(), i = "remote_list"
                    }
                    if (void 0 !== n && void 0 !== i) return this.useragent.update({
                        info: n
                    }), {
                        source: i,
                        previous: e,
                        new: n
                    };
                    const a = this.generator.generate(t.generator.types);
                    return this.useragent.update({
                        info: a
                    }), {
                        source: "generator",
                        previous: e,
                        new: a
                    }
                }
                custom() {
                    const e = this.settings.get().customUseragent.list;
                    if (e.length > 0) {
                        const t = e[Math.floor(Math.random() * e.length)];
                        if (t.trim().length > 0) return this.parseUserAgentString(t)
                    }
                }
                remote() {
                    const e = this.remoteList.getRandom();
                    if (e.trim().length > 0) return this.parseUserAgentString(e)
                }
                parseUserAgentString(e) {
                    const t = new (y())(e).getResult(),
                        r = {
                            useragent: t.ua,
                            engine: "unknown", // Webkit names
                            osType: "unknown", // OS Types like linux, Mac, Windows, IPhone, Android
                            browser: "unknown", // Browser Name like Chrome, Firefox, Opera, Safari, Edge
                            browserVersion: { // Browser version
                                major: 0,
                                full: ""
                            }
                        };
                    if (t.engine.name) switch (t.engine.name.toLowerCase()) { // Webkit names from below list
                        case "webkit":
                            r.engine = "webkit";
                            break;
                        case "blink":
                            r.engine = "blink";
                            break;
                        case "gecko":
                            r.engine = "gecko"
                    }
                    if (t.os.name) { // OS Types like linux, Mac, Windows, IPhone, Android from below list
                        const e = t.os.name.toLowerCase();
                        switch (!0) {
                            case e.includes("windows"):
                                r.osType = "windows";
                                break;
                            case /nix|nux|bsd|vms|cent|chrom|fedora|debian|elementary|gentoo|gnu|harmony|kai|mageia|mandriva|manjaro|mint|slack|suse|ubuntu/i.test(e):
                                r.osType = "linux";
                                break;
                            case e.includes("mac"):
                                r.osType = "macOS";
                                break;
                            case /iphone|ipad|ipod/i.test(e):
                                r.osType = "iOS";
                                break;
                            case e.includes("android"):
                                r.osType = "android"
                        }
                    }
                    if (t.browser.name) { // Browser Name like Chrome, Firefox, Opera, Safari, Edge
                        const e = t.browser.name.toLowerCase();
                        switch (!0) {
                            case e.includes("chrome"):
                                r.browser = "chrome";
                                break;
                            case e.includes("firefox"):
                            case e.includes("firebird"):
                                r.browser = "firefox";
                                break;
                            case e.includes("opera"):
                                r.browser = "opera";
                                break;
                            case e.includes("safari"):
                                r.browser = "safari";
                                break;
                            case e.includes("edge"):
                                r.browser = "edge"
                        }
                    }
                    if (t.browser.version) { // Browser version
                        r.browserVersion.full = t.browser.version;
                        const e = r.browserVersion.full.split(".");
                        e.length > 0 && (r.browserVersion.major = parseInt(e[0], 10))
                    }
                    return r
                }
            }
            var S, L = r(9300);

            function O(e, t) {
                const r = t.replace(/[[\]{}()+.\\^$|]/g, "\\$&").replace(/[*?]/g, ".$&");
                return new RegExp(`^${r}$`, "i").test(e)
            }
            class U {
                constructor(e) {
                    this.settings = e
                }
                enabledForDomain(e) { // Blocked Domain list
                    const t = this.settings.get().blacklist.domains; 
                    switch (this.settings.get().blacklist.mode) {
                        case c.OM.BlackList: // List of blacklisted domains
                            return !t.includes(e);
                        case c.OM.WhiteList: // List of whitelisted domains
                            return t.includes(e)
                    }
                    return !1
                }
                changeForDomain(e, t) {
                    if (0 !== e.trim().length)
                        if (t) switch (this.settings.get().blacklist.mode) {
                            case c.OM.BlackList:
                                this.removeFromDomainsList(e);
                                break;
                            case c.OM.WhiteList:
                                this.appendIntoDomainsList(e)
                        } else switch (this.settings.get().blacklist.mode) {
                            case c.OM.BlackList:
                                this.appendIntoDomainsList(e);
                                break;
                            case c.OM.WhiteList:
                                this.removeFromDomainsList(e)
                        }
                }
                removeFromDomainsList(e) {
                    const t = this.settings.get().blacklist.domains;
                    t.includes(e) && this.settings.update({
                        blacklist: {
                            domains: t.filter((t => t !== e))
                        }
                    })
                }
                appendIntoDomainsList(e) {
                    const t = this.settings.get().blacklist.domains;
                    t.includes(e) || (t.push(e), this.settings.update({
                        blacklist: {
                            domains: t
                        }
                    }))
                }
                applicableToURI(e) {
                    if (this.settings.get().enabled) {
                        const t = U.extractDomainFromUri(e),
                            r = this.settings.get().blacklist.domains,
                            s = this.settings.get().blacklist.custom.rules;
                        switch (this.settings.get().blacklist.mode) {
                            case c.OM.BlackList:
                                if (t.length > 0 && r.includes(t)) return !1;
                                for (let t = 0; t < s.length; t++)
                                    if (O(e, s[t])) return !1;
                                return !0;
                            case c.OM.WhiteList:
                                if (t.length > 0 && r.includes(t)) return !0;
                                for (let t = 0; t < s.length; t++)
                                    if (O(e, s[t])) return !0;
                                return !1
                        }
                    }
                    return !1
                }
                static extractDomainFromUri(e) {
                    try {
                        return new URL(e).hostname
                    } catch (e) { }
                    return ""
                }
            } ! function (e) { // Selecting requird fake system fingerprint from following
                e.Android = "Android", e.ChromeOS = "Chrome OS", e.ChromiumOS = "Chromium OS", e.iOS = "iOS", e.Linux = "Linux", e.macOS = "macOS", e.Windows = "Windows", e.Unknown = "Unknown"
            }(S || (S = {}));
            class M {
                static brands(e, t) {
                    const r = [{
                        brand: "(Not(A:Brand",
                        version: t ? "99.0.0.0" : "99"
                    }];
                    if ("blink" === e.engine) {
                        const s = t ? e.browserVersion.full : e.browserVersion.major.toString();
                        if (r.push({
                            brand: "Chromium",
                            version: s
                        }), "chrome" === e.browser && r.push({
                            brand: "Google Chrome",
                            version: s
                        }), e.brandBrowserVersion) {
                            const s = t ? e.brandBrowserVersion.full : e.brandBrowserVersion.major.toString();
                            switch (e.browser) {
                                case "edge":
                                    r.push({
                                        brand: "Microsoft Edge",
                                        version: s
                                    });
                                    break;
                                case "opera":
                                    r.push({
                                        brand: "Opera",
                                        version: s
                                    })
                            }
                        }
                    }
                    return r
                }
                static platform(e) { // System Type selection
                    switch (e.osType) {
                        case "windows":
                            return S.Windows;
                        case "linux":
                            return S.Linux;
                        case "macOS":
                            return S.macOS;
                        case "iOS":
                            return S.iOS;
                        case "android":
                            return S.Android;
                        default:
                            return S.Unknown
                    }
                }
                static isMobile(e) { // Mobile type selection
                    switch (e.osType) {
                        case "android":
                        case "iOS":
                            return !0;
                        default:
                            return !1
                    }
                }
            }
            class I {
                constructor(e, t, r) {
                    this.settings = e, this.useragent = t, this.filterService = r
                }
                listen() {
                    let e;
                    ! function (e) {
                        e.userAgent = "user-agent", e.secUa = "sec-ch-ua", e.secUaFullVersion = "sec-ch-ua-full-version", e.secUaFullVersionList = "sec-ch-ua-full-version-list", e.secUaPlatform = "sec-ch-ua-platform", e.secUaMobile = "sec-ch-ua-mobile", e.secUaPlatformVersion = "sec-ch-ua-platform-version"
                    }(e || (e = {})), chrome.webRequest.onBeforeSendHeaders.addListener((t => {
                        if (this.settings.get().enabled && this.filterService.applicableToURI(t.url)) {
                            const r = this.useragent.get().info;
                            if (t.requestHeaders && void 0 !== r) {
                                for (let s = 0; s < t.requestHeaders.length; s++)
                                    if (t.requestHeaders[s].value) switch (t.requestHeaders[s].name.toLowerCase()) {
                                        case e.userAgent:
                                            t.requestHeaders[s].value = r.useragent;
                                            break;
                                        case e.secUa:
                                            t.requestHeaders[s].value = this.brandsListToString(M.brands(r, !1));
                                            break;
                                        case e.secUaFullVersion:
                                            t.requestHeaders[s].value = `"${r.browserVersion.full}"`;
                                            break;
                                        case e.secUaFullVersionList:
                                            t.requestHeaders[s].value = this.brandsListToString(M.brands(r, !0));
                                            break;
                                        case e.secUaPlatform:
                                            t.requestHeaders[s].value = `"${M.platform(r)}"`;
                                            break;
                                        case e.secUaMobile:
                                            t.requestHeaders[s].value = M.isMobile(r) ? "?1" : "?0";
                                            break;
                                        case e.secUaPlatformVersion:
                                            t.requestHeaders[s].value = '""'
                                    }
                                return {
                                    requestHeaders: t.requestHeaders
                                }
                            }
                        }
                    }), {
                        urls: ["<all_urls>"]
                    }, ["blocking", "requestHeaders"])
                }
                brandsListToString(e) {
                    return e.map((e => `"${e.brand}";v="${e.version}"`)).join(", ")
                }
            }
            var x, H = r(6574),
                E = r(5670);
            ! function (e) {
                e.onLoad = "on:load", e.onSave = "on:save", e.onChange = "on:change"
            }(x || (x = {}));
            const P = "get-useragent";
            class T {
                constructor(e) {
                    this.useragent = e
                }
                name() {
                    return P
                }
                handle(e) {
                    return {
                        payload: this.useragent.get()
                    }
                }
            }
            const V = "update-useragent";
            class A {
                constructor(e) {
                    this.useragent = e
                }
                name() {
                    return V
                }
                handle(e) {
                    return this.useragent.update(e.payload), {
                        payload: this.useragent.get()
                    }
                }
            }

            function C(e) {
                return window.btoa(unescape(encodeURIComponent(JSON.stringify(e)))).replace(/=/g, "-")
            }
            class j {
                constructor(e, t, r) { // Constructor
                    this.settings = e, this.useragent = t, this.filterService = r
                }
                listen() {
                    const e = ["blocking", "responseHeaders"];
                    this.extraHeadersAreAllowed() && e.push("extraHeaders"), chrome.webRequest.onHeadersReceived.addListener((e => {
                        if ("main_frame" === e.type || "sub_frame" === e.type) {
                            const t = this.settings.get();
                            if (t.enabled && t.jsProtection.enabled && this.filterService.applicableToURI(e.url)) {
                                const t = this.useragent.get().info;
                                if (e.responseHeaders && void 0 !== t) {
                                    const r = new Date;
                                    r.setTime(r.getTime() + 6e4);
                                    const s = {
                                        uaInfo: t
                                    };
                                    return e.responseHeaders.push({
                                        name: "Set-Cookie",
                                        value: `KlBtYgleVSwXJ=${C(s)}; expires=${r.toUTCString()}; path=/`
                                    }), {
                                        responseHeaders: e.responseHeaders
                                    }
                                }
                            }
                        }
                    }), {
                        urls: ["<all_urls>"]
                    }, e)
                }
                extraHeadersAreAllowed() {
                    const e = () => { };
                    let t = !1;
                    try {
                        chrome.webRequest.onHeadersReceived.addListener(e, {
                            urls: ["https://example.com/"]
                        }, ["extraHeaders"]), t = !0
                    } catch (e) {
                        t = !1
                    } finally {
                        chrome.webRequest.onHeadersReceived.removeListener(e)
                    }
                    return t
                }
            }
            class q {
                constructor() {
                    this.key = "remote-list-cache"
                }
                async put(e) {
                    localStorage.setItem(this.key, JSON.stringify(e))
                }
                async get() {
                    const e = localStorage.getItem(this.key);
                    return "string" == typeof e ? JSON.parse(e) : []
                }
                async exists() {
                    return "string" == typeof localStorage.getItem(this.key)
                }
                async remove() {
                    localStorage.removeItem(this.key)
                }
            }
            class R {
                constructor(e) {
                    this.uri = "", this.inmemory = [], this.cache = e
                }
                init() {
                    return new Promise(((e, t) => {
                        this.cache.get().then((e => this.inmemory = e)).then((() => e())).catch(t)
                    }))
                }
                setUri(e) {
                    this.uri = e
                }
                getUri() {
                    return this.uri
                }
                update() {
                    return new Promise(((e, t) => {
                        if (0 === this.uri.length) return t(new Error("Remote list URI was not set"));
                        this.fetchList(this.uri).then((r => {
                            this.inmemory = r, this.cache.put(r).then(e).catch(t)
                        })).catch(t)
                    }))
                }
                get() {
                    return this.inmemory.splice(0)
                }
                getRandom() {
                    return 0 === this.inmemory.length ? "" : this.inmemory[Math.floor(Math.random() * this.inmemory.length)]
                }
                fetchList(e) {
                    return new Promise(((t, r) => {
                        fetch(e, {
                            method: "GET",
                            redirect: "follow",
                            referrerPolicy: "no-referrer"
                        }).then((s => {
                            if (!s.ok) return r(new Error(`Wrong response code (${s.status}) for ${e}: ${s.statusText}`));
                            s.text().then((e => e.length > 0 ? t(e.split("\n").filter((e => {
                                const t = e.trim();
                                return !t.startsWith("#") && !t.startsWith("//") && 0 !== t.length
                            }))) : t([]))).catch(r)
                        })).catch(r)
                    }))
                }
            }
            const _ = "update-remote-ua-list";
            class $ {
                constructor(e, t) {
                    this.remoteListService = e, this.errorsHandler = t
                }
                name() {
                    return _
                }
                handle(e) {
                    return this.remoteListService.update().catch(this.errorsHandler), {
                        payload: {}
                    }
                }
            }
            class F {
                constructor(e) {
                    this.useragentService = e
                }
                listen() {
                    let e;
                    ! function (e) {
                        e.renewUseragent = "renew-useragent"
                    }(e || (e = {})), chrome.commands.onCommand.addListener((t => {
                        if (t === e.renewUseragent) this.useragentService.renew()
                    }))
                }
            }
            const B = console.error,
                D = new class {
                    init() {
                        return new Promise((e => {
                            chrome.storage.sync.get(null, (t => {
                                this.storage = chrome.runtime.lastError ? chrome.storage.local : chrome.storage.sync, e()
                            }))
                        }))
                    }
                    clear() {
                        return new Promise(((e, t) => {
                            if (!this.storage) return t(new Error("Storage was not initialized"));
                            this.storage.clear((() => {
                                if (chrome.runtime.lastError) return t(new Error(chrome.runtime.lastError.message));
                                e()
                            }))
                        }))
                    }
                    get(e) {
                        return new Promise(((t, r) => {
                            if (!this.storage) return r(new Error("Storage was not initialized"));
                            this.storage.get(e, (s => chrome.runtime.lastError ? r(new Error(chrome.runtime.lastError.message)) : s.hasOwnProperty(e) ? void t(s[e]) : t({})))
                        }))
                    }
                    set(e, t) {
                        return new Promise(((r, s) => {
                            if (!this.storage) return s(new Error("Storage was not initialized"));
                            this.storage.set({
                                [e]: t
                            }, (() => {
                                if (chrome.runtime.lastError) return s(new Error(chrome.runtime.lastError.message));
                                r()
                            }))
                        }))
                    }
                },
                W = new class {
                    constructor() {
                        this.storageKey = "useragent-state", this.state = {
                            info: void 0
                        }, this.events = {}, this.storage = chrome.storage.local
                    }
                    on(e, t) {
                        this.events.hasOwnProperty(e) ? this.events[e].push(t) : this.events[e] = [t]
                    }
                    emit(e, ...t) {
                        if (this.events.hasOwnProperty(e))
                            for (const r of this.events[e]) r(...t)
                    }
                    get() {
                        return JSON.parse(JSON.stringify(this.state))
                    }
                    update(e) {
                        let t = !1;
                        void 0 !== e.info && (this.state.info = e.info, t = !0), t && this.emit(x.onChange)
                    }
                    save() {
                        return new Promise(((e, t) => {
                            this.storage.set({
                                [this.storageKey]: this.state
                            }, (() => {
                                if (chrome.runtime.lastError) return t(new Error(chrome.runtime.lastError.message));
                                this.emit(x.onSave), e()
                            }))
                        }))
                    }
                    load() {
                        return new Promise(((e, t) => {
                            this.storage.get(this.storageKey, (r => {
                                if (chrome.runtime.lastError) return t(new Error(chrome.runtime.lastError.message));
                                r.hasOwnProperty(this.storageKey) && (r[this.storageKey].hasOwnProperty("useragent") && delete r[this.storageKey].useragent, this.state = r[this.storageKey]), this.emit(x.onLoad), e()
                            }))
                        }))
                    }
                };
            W.load().then((() => {
                W.on(x.onChange, (() => {
                    W.save().then((() => {
                        const e = W.get().info;
                        e && async function (e, t) {
                            const r = {
                                title: e
                            };
                            "number" == typeof t && (r.tabId = t), await chrome.browserAction.setTitle(r)
                        }(function (e) {
                            const t = [];
                            switch (e.browser) { // GUI for browser selection
                                case "chrome":
                                    t.push("🌐 Chrome");
                                    break;
                                case "firefox":
                                    t.push("🦊 FireFox");
                                    break;
                                case "opera":
                                    t.push("⭕ Opera");
                                    break;
                                case "safari":
                                    t.push("🧭 Safari");
                                    break;
                                case "edge":
                                    t.push("🛸 Edge");
                                    break;
                                default:
                                    t.push("👻 Browser")
                            }
                            switch (e.brandBrowserVersion && e.brandBrowserVersion.major > 0 ? t.push(`(v${e.brandBrowserVersion.major})`) : e.browserVersion.major > 0 && t.push(`(v${e.browserVersion.major})`), e.osType) {
                                case "windows":
                                    t.push("🖥 Windows");
                                    break;
                                case "linux":
                                    t.push("🐧 Linux");
                                    break;
                                case "macOS":
                                    t.push("🍏 macOS");
                                    break;
                                case "iOS":
                                    t.push("🍏 iOS");
                                    break;
                                case "android":
                                    t.push("📱 Android");
                                    break;
                                default:
                                    t.push("🧮 Device")
                            }
                            return t.join(" ")
                        }(e)).catch(B)
                    })).catch(B)
                })), D.init().then((() => {
                    const e = new c.ZP(D);
                    e.load().then((() => {
                        const t = e.get();
                        l(t.enabled ? o.Active : o.Inactive);
                        const r = new R(new q),
                            i = new k(e, W, new L.ZP, r),
                            h = new U(e);
                        t.remoteUseragentList.enabled && t.remoteUseragentList.uri.length > 0 && r.setUri(t.remoteUseragentList.uri), r.init().then((() => {
                            const m = new u(t.renew.intervalMillis, (() => {
                                i.renew()
                            })),
                                p = new u(t.remoteUseragentList.updateIntervalMillis, (() => {
                                    r.update().catch(B)
                                }));
                            t.remoteUseragentList.enabled && 0 === r.get().length && r.update().catch(B), t.renew.onStartup && i.renew(), t.enabled && t.renew.enabled && m.start(), t.enabled && t.remoteUseragentList.enabled && (r.update().catch(B), p.getIntervalMillis() > 0 && p.start()), e.on(c.oO.onChange, (() => {
                                const t = e.get();
                                l(t.enabled ? o.Active : o.Inactive), t.enabled ? (t.renew.enabled ? (m.getIntervalMillis() !== t.renew.intervalMillis && m.setIntervalMillis(t.renew.intervalMillis), m.isStarted() || m.start()) : m.stop(), t.remoteUseragentList.enabled ? (p.getIntervalMillis() !== t.remoteUseragentList.updateIntervalMillis && (t.remoteUseragentList.updateIntervalMillis > 0 ? p.setIntervalMillis(t.remoteUseragentList.updateIntervalMillis) : p.stop()), r.getUri() !== t.remoteUseragentList.uri && (r.setUri(t.remoteUseragentList.uri), r.update().catch(B), t.remoteUseragentList.updateIntervalMillis > 0 && p.restart()), !p.isStarted() && t.remoteUseragentList.updateIntervalMillis > 0 && p.start()) : p.stop()) : (m.stop(), p.stop()), e.save().catch(B)
                            })), new s.v(new n(new a, new E.Z(e), new H.Z(e), new d(i), new g(h), new w(h), new f(h), new T(W), new A(W), new $(r, B)), B).listen(), new I(e, W, h).listen(), new j(e, W, h).listen(), new F(i).listen()
                        })).catch(B)
                    })).catch(B)
                })).catch(B)
            })).catch(B)
        }
    },
        r = {};

    function s(e) {
        var n = r[e];
        if (void 0 !== n) return n.exports;
        var i = r[e] = {
            id: e,
            exports: {}
        };
        return t[e].call(i.exports, i, i.exports, s), i.exports
    }
    s.m = t, s.amdO = {}, e = [], s.O = (t, r, n, i) => {
        if (!r) {
            var a = 1 / 0;
            for (u = 0; u < e.length; u++) {
                for (var [r, n, i] = e[u], o = !0, c = 0; c < r.length; c++)(!1 & i || a >= i) && Object.keys(s.O).every((e => s.O[e](r[c]))) ? r.splice(c--, 1) : (o = !1, i < a && (a = i));
                if (o) {
                    e.splice(u--, 1);
                    var l = n();
                    void 0 !== l && (t = l)
                }
            }
            return t
        }
        i = i || 0;
        for (var u = e.length; u > 0 && e[u - 1][2] > i; u--) e[u] = e[u - 1];
        e[u] = [r, n, i]
    }, s.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return s.d(t, {
            a: t
        }), t
    }, s.d = (e, t) => {
        for (var r in t) s.o(t, r) && !s.o(e, r) && Object.defineProperty(e, r, {
            enumerable: !0,
            get: t[r]
        })
    }, s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), s.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, s.j = 352, (() => {
        var e = {
            352: 0
        };
        s.O.j = t => 0 === e[t];
        var t = (t, r) => {
            var n, i, [a, o, c] = r,
                l = 0;
            if (a.some((t => 0 !== e[t]))) {
                for (n in o) s.o(o, n) && (s.m[n] = o[n]);
                if (c) var u = c(s)
            }
            for (t && t(r); l < a.length; l++) i = a[l], s.o(e, i) && e[i] && e[i][0](), e[i] = 0;
            return s.O(u)
        },
            r = self.webpackChunkrandom_user_agent = self.webpackChunkrandom_user_agent || [];
        r.forEach(t.bind(null, 0)), r.push = t.bind(null, r.push.bind(r))
    })();
    var n = s.O(void 0, [736], (() => s(7107)));
    n = s.O(n)
})();
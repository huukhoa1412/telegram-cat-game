window.Mmobay = function(n) {
    "use strict";
    class o {
    }
    o.channelId = -1,
    o.bcId = 0,
    o.chainNet = "-3",
    o.gameVersion = "1.0.0",
    o.resVersion = 100,
    o.addr = "",
    o.basePath = "",
    o.loginUrl = "",
    o.tonConnectManifestUrl = "",
    o.packageUrl = {},
    o.loadUI = !1,
    o.worker = !1,
    o.ktxConfig = {},
    o.showNetLog = !1,
    o.isTGWebLogin = !1,
    o.isTonKeeper = !1;
    class t {
        static init() {
            t.gameDispatcher = new Laya.EventDispatcher
        }
    }
    t.PACK_LOAD_DONE = "packloaddone",
    t.LOAD_PROGRESS = "loadprogress",
    t.ENTER_GAME_ERROR = "entergameerror",
    t.CONNECT_GAME_ERROR = "connectgameerror";
    class D {
        loadPackage(e, i) {
            this._packageId = e,
            this._complete = i,
            t.gameDispatcher.once(t.PACK_LOAD_DONE, this, this.onLoadedPackage);
            i = o.packageUrl[e];
            i ? window.mbplatform.loadSubPackage(i) : console.log("load package error==>" + i)
        }
        onLoadedPackage() {
            this._complete && this._complete.runWith(this._packageId)
        }
    }
    class d {
        constructor() {
            this.m_http = new Laya.HttpRequest,
            this.m_retryTimes = 0,
            this.m_retryInterval = 1e3
        }
        static request(t, o=null, s="get", r="text", n=0, l=1e3) {
            return new Promise((i,e)=>{
                let a = new d;
                a.m_retryTimes = n,
                a.m_retryInterval = l,
                a.m_complete = Laya.Handler.create(null, e=>{
                    i(e)
                }
                ),
                a.m_error = Laya.Handler.create(null, e=>{
                    i(e)
                }
                ),
                a.send(t, s, r, o)
            }
            )
        }
        send(e, i, a, t) {
            !t || "get" != i && "GET" != i || (e += "?" + t),
            this.m_requestInfo = {
                url: e,
                method: i,
                type: a,
                data: t
            },
            this.doSend()
        }
        doSend() {
            this.m_http.once(Laya.Event.COMPLETE, this, this.onComplete),
            this.m_http.once(Laya.Event.ERROR, this, this.onError);
            var e = this.m_requestInfo.url
              , i = this.m_requestInfo.method
              , a = this.m_requestInfo.data
              , t = this.m_requestInfo.type;
            this.m_http.send(e, a, i, t)
        }
        onComplete(e) {
            "string" == typeof e && (e = JSON.parse(e)),
            this.m_complete.runWith([e])
        }
        onError(e) {
            if (!e.includes("Request was aborted by user") && 0 < this.m_retryTimes)
                return this.m_retryTimes--,
                void Laya.timer.once(this.m_retryInterval, this, this.doSend);
            this.m_error.runWith([{
                code: 5,
                message: e
            }])
        }
    }
    class i {
        static get(e, i) {
            e = "CAT_" + e;
            e = Laya.LocalStorage.getJSON(e);
            return e ? i ? e[i] || "" : e : ""
        }
        static set(i, a, t) {
            i = "CAT_" + i;
            let o = a;
            if (t) {
                let e = Laya.LocalStorage.getJSON(i) || {};
                e[t] = a,
                o = e
            }
            Laya.LocalStorage.setJSON(i, o)
        }
    }
    class s {
        static formatURIParam(e) {
            if (!e)
                return "";
            let i = [];
            for (var a in e)
                i.push(a + "=" + encodeURIComponent(e[a]));
            return i.join("&")
        }
        static getScreenInfo() {
            var e = Laya.stage.width
              , i = Laya.stage.height
              , a = Laya.stage.designWidth
              , t = Laya.stage.designHeight
              , o = i / e
              , s = t / a;
            let r = e
              , n = i;
            return s <= o ? r = i / s : n = e * s,
            {
                stageRate: o,
                stageWidth: e,
                stageHeight: i,
                designRate: s,
                designWidth: a,
                designHeight: t,
                realWidth: r,
                realHeight: n
            }
        }
        static getMajorNum(e) {
            e = e.split(".");
            return parseInt(e[0] || "0", 10)
        }
        static setLanguage(e) {
            e ? (s.language = e,
            i.set("ttfLan", e)) : console.log("language invalue")
        }
        static getLanguage() {
            if (s.language)
                return s.language;
            var e = i.get("ttfLan");
            return e ? s.language = e : 1
        }
        static getLanguageName() {
            return {
                1: "en",
                2: "tc",
                3: "jp",
                4: "vi",
                5: "ko",
                6: "fr",
                7: "ptbr",
                8: "tr",
                9: "ru",
                10: "es",
                11: "th",
                12: "ind"
            }[s.getLanguage()] || "en"
        }
    }
    s.language = 0;
    class W {
        constructor() {
            this.m_sex = 0,
            this.m_newNickName = "",
            this.m_isNew = !1
        }
        get sex() {
            return this.m_sex
        }
        set sex(e) {
            this.m_sex = e
        }
        get newNickName() {
            return this.m_newNickName
        }
        set newNickName(e) {
            this.m_newNickName = e
        }
        get isNew() {
            return this.m_isNew
        }
        set isNew(e) {
            this.m_isNew = e
        }
        get loginData() {
            return this.m_loginData
        }
        set loginData(e) {
            this.m_loginData = e
        }
        get localAccount() {
            return i.get("LOGIN_INFO" + o.channelId)
        }
        set localAccount(e) {
            i.set("LOGIN_INFO" + o.channelId, e)
        }
        reqLoginByAccount(a, t) {
            var e = {
                channelId: o.channelId,
                bcId: o.bcId,
                name: a,
                password: t
            }
              , i = o.loginUrl + "/login";
            return d.request(i, e, "post", "json").then(e=>{
                var i = !e.code
                  , i = (this.isNew = !!e.isNew,
                i && (this.localAccount = {
                    channelId: o.channelId,
                    account: a,
                    pwd: t
                },
                o.addr = e.addr,
                this.loginData = e),
                {
                    success: i,
                    isNew: this.isNew,
                    code: e.code
                });
                return i
            }
            )
        }
        reqLoginBySdk() {
            return window.mbplatform.login({}).then(e=>{
                if (!e.success)
                    return {
                        success: !1,
                        code: 91,
                        msg: e.msg
                    };
                delete e.success;
                var i = e.deviceId;
                delete e.deviceId;
                let a = {
                    channelId: window.mbplatform.channelId,
                    bcId: o.bcId,
                    data: e,
                    language: s.getLanguageName()
                };
                i && (a.deviceId = i);
                e = o.loginUrl + "/pflogin";
                return d.request(e, a, "post", "json").then(e=>{
                    var i = !e.code
                      , i = (this.isNew = !!e.isNew,
                    i && (o.addr = e.addr,
                    this.loginData = e,
                    window.mbplatform.loginSucc(e)),
                    82 == e.code && window.mbplatform.loginFail(),
                    {
                        success: i,
                        isNew: this.isNew,
                        code: e.code,
                        msg: "ErrorCode is " + e.code
                    });
                    return i
                }
                )
            }
            )
        }
        reqRegister(e, i) {
            let a = {
                channelId: o.channelId,
                bcId: o.bcId,
                name: e,
                password: i
            };
            e = window.GameUrlParas || {},
            e.inviter && (a.inviter = e.inviter),
            e.share && (a.info = e.share),
            e.fromtfid && (a.info = e.fromtfid),
            i = o.loginUrl + "/register";
            return d.request(i, a, "post", "json").then(e=>e)
        }
    }
    class e {
        static get packageMgr() {
            return e._packageMgr
        }
        static get loginMgr() {
            return e._loginMgr
        }
        static init() {
            e._packageMgr = new D,
            e._loginMgr = new W
        }
    }
    function H(e, i) {
        return typeof e === l && -1 !== T(i).indexOf(T(e))
    }
    function z(e, i) {
        if (typeof e === l)
            return e = e.replace(/^\s\s*/, "").replace(/\s\s*$/, ""),
            typeof i == U ? e : e.substring(0, 255)
    }
    function a(e, i) {
        for (var a, t, o, s, r, n = 0; n < i.length && !s; ) {
            for (var l = i[n], d = i[n + 1], c = a = 0; c < l.length && !s; )
                if (s = l[c++].exec(e))
                    for (t = 0; t < d.length; t++)
                        r = s[++a],
                        typeof (o = d[t]) == B && 0 < o.length ? 2 === o.length ? typeof o[1] == P ? this[o[0]] = o[1].call(this, r) : this[o[0]] = o[1] : 3 === o.length ? typeof o[1] != P || o[1].exec && o[1].test ? this[o[0]] = r ? r.replace(o[1], o[2]) : void 0 : this[o[0]] = r ? o[1].call(this, r, o[2]) : void 0 : 4 === o.length && (this[o[0]] = r ? o[3].call(this, r.replace(o[1], o[2])) : void 0) : this[o] = r || void 0;
            n += 2
        }
    }
    function r(e, i) {
        for (var a in i)
            if (typeof i[a] == B && 0 < i[a].length) {
                for (var t = 0; t < i[a].length; t++)
                    if (H(i[a][t], e))
                        return "?" === a ? void 0 : a
            } else if (H(i[a], e))
                return "?" === a ? void 0 : a;
        return e
    }
    let P = "function"
      , U = "undefined"
      , B = "object"
      , l = "string"
      , c = "model"
      , w = "name"
      , b = "type"
      , g = "vendor"
      , u = "version"
      , m = "architecture"
      , h = "console"
      , p = "mobile"
      , f = "tablet"
      , v = "smarttv"
      , _ = "wearable"
      , y = "Amazon"
      , L = "Apple"
      , G = "ASUS"
      , j = "BlackBerry"
      , k = "Browser"
      , x = "Chrome"
      , N = "Firefox"
      , S = "Google"
      , V = "Huawei"
      , O = "LG"
      , E = "Microsoft"
      , F = "Motorola"
      , I = "Opera"
      , C = "Samsung"
      , A = "Sony"
      , K = "Xiaomi"
      , J = "Zebra"
      , Z = "Facebook"
      , $ = {
        "1.0": "/8",
        1.2: "/1",
        1.3: "/3",
        "2.0": "/412",
        "2.0.2": "/416",
        "2.0.3": "/417",
        "2.0.4": "/419",
        "?": "/"
    }
      , X = {
        ME: "4.90",
        "NT 3.11": "NT3.51",
        "NT 4.0": "NT4.0",
        2e3: "NT 5.0",
        XP: ["NT 5.1", "NT 5.2"],
        Vista: "NT 6.0",
        7: "NT 6.1",
        8: "NT 6.2",
        8.1: "NT 6.3",
        10: ["NT 6.4", "NT 10.0"],
        RT: "ARM"
    }
      , T = function(e) {
        return e.toLowerCase()
    };
    class R {
        constructor() {
            if (this.getResult = function() {
                return {
                    ua: this._ua,
                    browser: this.getBrowser(),
                    engine: this.getEngine(),
                    os: this.getOS(),
                    device: this.getDevice(),
                    cpu: this.getCPU()
                }
            }
            ,
            R._instance)
                return R._instance;
            this.regexes = {
                browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [u, [w, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [u, [w, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [w, u], [/opios[\/ ]+([\w\.]+)/i], [u, [w, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [u, [w, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i, /(weibo)__([\d\.]+)/i], [w, u], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [u, [w, "UC" + k]], [/\bqbcore\/([\w\.]+)/i], [u, [w, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [u, [w, "WeChat"]], [/konqueror\/([\w\.]+)/i], [u, [w, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [u, [w, "IE"]], [/yabrowser\/([\w\.]+)/i], [u, [w, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[w, /(.+)/, "$1 Secure " + k], u], [/\bfocus\/([\w\.]+)/i], [u, [w, N + " Focus"]], [/\bopt\/([\w\.]+)/i], [u, [w, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [u, [w, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [u, [w, "Dolphin"]], [/coast\/([\w\.]+)/i], [u, [w, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [u, [w, "MIUI " + k]], [/fxios\/([-\w\.]+)/i], [u, [w, N]], [/\bqihu|(qi?ho?o?|360)browser/i], [[w, "360 " + k]], [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i], [[w, /(.+)/, "$1 " + k], u], [/(comodo_dragon)\/([\w\.]+)/i], [[w, /_/g, " "], u], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [w, u], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i], [w], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[w, Z], u], [/safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [w, u], [/\bgsa\/([\w\.]+) .*safari\//i], [u, [w, "GSA"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [u, [w, x + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[w, x + " WebView"], u], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [u, [w, "Android " + k]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [w, u], [/version\/([\w\.]+) .*mobile\/\w+ (safari)/i], [u, [w, "Mobile Safari"]], [/version\/([\w\.]+) .*(mobile ?safari|safari)/i], [u, w], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [w, [u, r, $]], [/(webkit|khtml)\/([\w\.]+)/i], [w, u], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[w, "Netscape"], u], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [u, [w, N + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i], [w, u]],
                cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[m, "amd64"]], [/(ia32(?=;))/i], [[m, T]], [/((?:i[346]|x)86)[;\)]/i], [[m, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[m, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[m, "armhf"]], [/windows (ce|mobile); ppc;/i], [[m, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[m, /ower/, "", T]], [/(sun4\w)[;\)]/i], [[m, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[m, T]]],
                device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [g, C], [b, f]], [/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [g, C], [b, p]], [/\((ip(?:hone|od)[\w ]*);/i], [c, [g, L], [b, p]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [g, L], [b, f]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [g, V], [b, f]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i], [c, [g, V], [b, p]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [g, K], [b, p]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [g, K], [b, f]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [g, "OPPO"], [b, p]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [g, "Vivo"], [b, p]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [g, "Realme"], [b, p]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [g, F], [b, p]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [g, F], [b, f]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [g, O], [b, f]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [g, O], [b, p]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [g, "Lenovo"], [b, f]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [g, "Nokia"], [b, p]], [/(pixel c)\b/i], [c, [g, S], [b, f]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [g, S], [b, p]], [/droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [g, A], [b, p]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [g, A], [b, f]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [g, "OnePlus"], [b, p]], [/(alexa)webm/i, /(kf[a-z]{2}wi)( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [g, y], [b, f]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [g, y], [b, p]], [/(playbook);[-\w\),; ]+(rim)/i], [c, g, [b, f]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [g, j], [b, p]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [g, G], [b, f]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [g, G], [b, p]], [/(nexus 9)/i], [c, [g, "HTC"], [b, f]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i], [g, [c, /_/g, " "], [b, p]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [g, "Acer"], [b, f]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [g, "Meizu"], [b, p]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [g, "Sharp"], [b, p]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [g, c, [b, p]], [/(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [g, c, [b, f]], [/(surface duo)/i], [c, [g, E], [b, f]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [g, "Fairphone"], [b, p]], [/(u304aa)/i], [c, [g, "AT&T"], [b, p]], [/\bsie-(\w*)/i], [c, [g, "Siemens"], [b, p]], [/\b(rct\w+) b/i], [c, [g, "RCA"], [b, f]], [/\b(venue[\d ]{2,7}) b/i], [c, [g, "Dell"], [b, f]], [/\b(q(?:mv|ta)\w+) b/i], [c, [g, "Verizon"], [b, f]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [g, "Barnes & Noble"], [b, f]], [/\b(tm\d{3}\w+) b/i], [c, [g, "NuVision"], [b, f]], [/\b(k88) b/i], [c, [g, "ZTE"], [b, f]], [/\b(nx\d{3}j) b/i], [c, [g, "ZTE"], [b, p]], [/\b(gen\d{3}) b.+49h/i], [c, [g, "Swiss"], [b, p]], [/\b(zur\d{3}) b/i], [c, [g, "Swiss"], [b, f]], [/\b((zeki)?tb.*\b) b/i], [c, [g, "Zeki"], [b, f]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[g, "Dragon Touch"], c, [b, f]], [/\b(ns-?\w{0,9}) b/i], [c, [g, "Insignia"], [b, f]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [g, "NextBook"], [b, f]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[g, "Voice"], c, [b, p]], [/\b(lvtel\-)?(v1[12]) b/i], [[g, "LvTel"], c, [b, p]], [/\b(ph-1) /i], [c, [g, "Essential"], [b, p]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [g, "Envizen"], [b, f]], [/\b(trio[-\w\. ]+) b/i], [c, [g, "MachSpeed"], [b, f]], [/\btu_(1491) b/i], [c, [g, "Rotor"], [b, f]], [/(shield[\w ]+) b/i], [c, [g, "Nvidia"], [b, f]], [/(sprint) (\w+)/i], [g, c, [b, p]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [g, E], [b, p]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [g, J], [b, f]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [g, J], [b, p]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [g, c, [b, h]], [/droid.+; (shield) bui/i], [c, [g, "Nvidia"], [b, h]], [/(playstation [345portablevi]+)/i], [c, [g, A], [b, h]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [g, E], [b, h]], [/smart-tv.+(samsung)/i], [g, [b, v]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [g, C], [b, v]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[g, O], [b, v]], [/(apple) ?tv/i], [g, [c, L + " TV"], [b, v]], [/crkey/i], [[c, x + "cast"], [g, S], [b, v]], [/droid.+aft(\w)( bui|\))/i], [c, [g, y], [b, v]], [/\(dtv[\);].+(aquos)/i], [c, [g, "Sharp"], [b, v]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i], [[g, z], [c, z], [b, v]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[b, v]], [/((pebble))app/i], [g, c, [b, _]], [/droid.+; (glass) \d/i], [c, [g, S], [b, _]], [/droid.+; (wt63?0{2,3})\)/i], [c, [g, J], [b, _]], [/(quest( 2)?)/i], [c, [g, Z], [b, _]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [g, [b, "embedded"]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [b, p]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [b, f]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[b, f]], [/(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i], [[b, p]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [g, "Generic"]]],
                engine: [[/windows.+ edge\/([\w\.]+)/i], [u, [w, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [u, [w, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i], [w, u], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [u, w]],
                os: [[/microsoft (windows) (vista|xp)/i], [w, u], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [w, [u, r, X]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[w, "Windows"], [u, r, X]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /cfnetwork\/.+darwin/i], [[u, /_/g, "."], [w, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[w, "Mac OS"], [u, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86)/i], [u, w], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [w, u], [/\(bb(10);/i], [u, [w, j]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [u, [w, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [u, [w, N + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [u, [w, "webOS"]], [/crkey\/([\d\.]+)/i], [u, [w, x + "cast"]], [/(cros) [\w]+ ([\w\.]+\w)/i], [[w, "Chromium OS"], u], [/(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [w, u], [/(sunos) ?([\w\.\d]*)/i], [[w, "Solaris"], u], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i, /(unix) ?([\w\.]*)/i], [w, u]]
            },
            this._ua = typeof window != U && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : "",
            R._instance = this
        }
        getBrowser() {
            var e, i = {
                name: void 0,
                version: void 0
            };
            return a.call(i, this._ua, this.regexes.browser),
            i.major = typeof (e = i.version) === l ? e.replace(/[^\d\.]/g, "").split(".")[0] : void 0,
            i
        }
        getCPU() {
            var e = {
                architecture: void 0
            };
            return a.call(e, this._ua, this.regexes.cpu),
            e
        }
        getDevice() {
            var e = {
                vendor: void 0,
                model: void 0,
                type: void 0
            };
            return a.call(e, this._ua, this.regexes.device),
            e
        }
        getEngine() {
            var e = {
                name: void 0,
                version: void 0
            };
            return a.call(e, this._ua, this.regexes.engine),
            e
        }
        getOS() {
            var e = {
                name: void 0,
                version: void 0
            };
            return a.call(e, this._ua, this.regexes.os),
            e
        }
    }
    class M {
        static init() {
            let a = Laya.Stage.prototype.setScreenSize;
            Laya.Stage.prototype.setScreenSize = function(e, i) {
                this._screenMode = e / i < 1 ? Laya.Stage.SCREEN_VERTICAL : Laya.Stage.SCREEN_HORIZONTAL,
                a.call(this, e, i)
            }
            ,
            Object.assign(o, window.MConfig),
            M.initEngine(),
            Laya.URL.exportSceneToJson = !0,
            o.basePath && (Laya.URL.basePath = o.basePath),
            window.mbplatform.init(o.channelId, o.bcId),
            e.init(),
            t.init(),
            M.gameDispatcher = n.gameDispatcher = t.gameDispatcher
        }
        static initEngine() {
            M.useWebGL1() && (Config.useWebGL2 = !1),
            Config.isAntialias = !1,
            Laya.init(560, 1120, Laya.WebGL),
            Laya.stage.useRetinalCanvas = !1,
            Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL,
            Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE,
            Laya.stage.alignH = Laya.Stage.ALIGN_CENTER,
            Laya.Loader._ktxDic = o.ktxConfig,
            Laya.WorkerLoader.enable = o.worker,
            M.canAdaptScreen() ? (Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO,
            Laya.timer.callLater(null, M.adaptScreen)) : (console.log("showall"),
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL,
            M.adaptOffsetWidth = n.adaptOffsetWidth = 0,
            M.adaptOffsetHeight = n.adaptOffsetHeight = 0)
        }
        static canAdaptScreen() {
            return !0
        }
        static adaptScreen() {
            var e = Laya.stage.designWidth
              , i = Laya.stage.designHeight
              , a = Laya.Browser.clientWidth * Laya.Browser.pixelRatio
              , t = Laya.Browser.clientHeight * Laya.Browser.pixelRatio
              , o = t / a;
            console.log("screenWidth==>" + a),
            console.log("screenHeight==>" + t),
            console.log("stageWidth==>" + Laya.stage.width),
            console.log("stageHeight==>" + Laya.stage.height),
            console.log("dt==>" + o);
            let s = 0
              , r = 0;
            2 <= o ? (console.log("fixedauto"),
            s = Laya.stage.height - i) : 1.3 <= o ? (console.log("fixedauto"),
            r = Laya.stage.width - e) : (console.log("showall"),
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL),
            M.adaptOffsetWidth = n.adaptOffsetWidth = r,
            M.adaptOffsetHeight = n.adaptOffsetHeight = s,
            Laya.timer.once(500, null, ()=>{
                Laya.stage.screenAdaptationEnabled = !1
            }
            )
        }
        static useWebGL1() {
            let e = new R
              , i = (console.log(e.getResult()),
            e.getOS());
            var a = i.name.toLowerCase();
            return "ios" == a && 15 == s.getMajorNum(i.version) || "mac os" == a
        }
    }
    M.adaptOffsetWidth = 0,
    M.adaptOffsetHeight = 0,
    M.init();
    class q {
    }
    return q.BLOCK_MAIN = 0,
    q.BLOCK_SUB1 = 1,
    q.BLOCK_SUB2 = 2,
    q.CHANNEL_LOCAL = 0,
    q.CHANNEL_TGBOT = 1,
    q.LOAD_CODE = 1,
    q.LOAD_CFG = 2,
    q.LOAD_NET = 3,
    n.HttpRequest = d,
    n.LocalStorage = i,
    n.LoginManager = W,
    n.MConfig = o,
    n.MConst = q,
    n.MEvent = t,
    n.Manager = e,
    n.Mmobay = M,
    n.PackageManager = D,
    n.UAParser = R,
    n.Utils = s,
    n
}({});

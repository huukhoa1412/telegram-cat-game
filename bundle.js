!function () {
    "use strict";
    class n {
        static get(e, t, i) {
            return i ? Laya.Pool.getItemByCreateFun(e, i) : Laya.Pool.getItemByClass(e, t)
        }
        static put(e, t) {
            t && Laya.Pool.recover(e, t)
        }
    }
    class F {
        constructor() {
            this._urls = [],
                this._reference = 0,
                this._activeTime = 0
        }
        static create(e) {
            let t = n.get(F._sign, F);
            return t.setData(e),
                t
        }
        setData(e) {
            this._urls = e
        }
        destroy() {
            this._urls.forEach(e => {
                Laya.loader.clearRes(e)
            }
            ),
                this._urls = [],
                this._reference = 0,
                this._activeTime = 0,
                n.put(F._sign, this)
        }
        canDestroy(e) {
            return !(0 < this._reference) && !(e - this._activeTime < 1e5)
        }
        addReference() {
            this._reference += 1,
                this._activeTime = Date.newDate().getTime()
        }
        removeReference() {
            --this._reference
        }
    }
    F._sign = "p_ResInfo";
    class a extends Laya.Animation {
        static registerTimer() {
            Laya.timer.loop(6e4, null, a.checkUnusedRes)
        }
        static checkUnusedRes() {
            if (a._resRef.size) {
                var t, i, s = Date.newDate().getTime();
                let e = a._resRef;
                for ([t, i] of e)
                    i.canDestroy(s) && (i.destroy(),
                        e.delete(t))
            }
        }
        static addResRef(e) {
            let t = a._resRef.get(e);
            t || (t = F.create([e]),
                a._resRef.set(e, t)),
                t.addReference()
        }
        static removeResRef(e) {
            let t = a._resRef.get(e);
            t && t.removeReference()
        }
        static create() {
            return n.get(a._sign, a)
        }
        loadAtlas(e, t = null, i = "") {
            return a.addResRef(e),
                this._skin = e,
                super.loadAtlas(e, t, i),
                this
        }
        recover() {
            a.removeResRef(this._skin),
                this.destroyed || (this.clear(),
                    this.offAll(),
                    this.removeSelf(),
                    this._skin = null,
                    n.put(a._sign, this))
        }
        destroy(e) {
            a.removeResRef(this._skin),
                super.destroy(e)
        }
    }
    a._resRef = new Map,
        a._sign = "p_Animation",
        a.registerTimer();
    class G extends Laya.UIComponent {
        constructor(e = !1) {
            super(),
                this._autoPlay = !1,
                this._loopCount = 0,
                this._completedLoop = 0,
                this._autoRemove = !1,
                this._noAdjustSize = !1,
                this._baseScaleX = 1,
                this._baseScaleY = 1,
                this._aniScaleX = 1,
                this._aniScaleY = 1,
                this._initBaseScale = !1,
                this._noAdjustSize = e;
            this.ani = new a;
            this.addChild(this.ani)
        }
        get loopCount() {
            return this._loopCount
        }
        set loopCount(e) {
            this._completedLoop = 0,
                this.ani.off(Laya.Event.COMPLETE, this, this.onLoopComplete),
                0 < e && this.ani.on(Laya.Event.COMPLETE, this, this.onLoopComplete),
                this._loopCount = e
        }
        get autoRemove() {
            return this._autoRemove
        }
        set autoRemove(e) {
            this._autoRemove = e
        }
        get autoPlay() {
            return this._autoPlay
        }
        set autoPlay(e) {
            this._autoPlay != e && (this._autoPlay = e,
                (this.ani.autoPlay = e) || (this.ani.graphics = null))
        }
        get isPlaying() {
            return this.ani.isPlaying
        }
        get skin() {
            return this._skin
        }
        set skin(e) {
            this._skin != e && (this._removeAsset(this._skin),
                "" != (this._skin = e) && (this._addAsset(e),
                    Laya.loader.loadP(e, null, Laya.Loader.ATLAS, 2).then(() => {
                        this.setAtlas(e)
                    }
                    )))
        }
        get miniAniScaleX() {
            return this._aniScaleX
        }
        get miniAniScaleY() {
            return this._aniScaleY
        }
        set scaleAniX(e) {
            this._baseScaleX = e,
                this.scaleX = this._aniScaleX * this._baseScaleX
        }
        get scaleAniX() {
            return this._baseScaleX
        }
        set scaleAniY(e) {
            this._baseScaleY = e,
                this.scaleY = this._aniScaleY * this._baseScaleY
        }
        get scaleAniY() {
            return this._baseScaleY
        }
        _addAsset(e) { }
        _removeAsset(e) { }
        setAtlas(t) {
            if (!this.destroyed) {
                var i = Laya.Loader.getRes(t);
                if (i) {
                    let e = 1;
                    for (var s in i.mc) {
                        s = i.mc[s];
                        this.ani.interval = 1e3 / s.frameRate,
                            s.scale && (e = parseFloat(s.scale));
                        break
                    }
                    this._aniScaleX = this._aniScaleY = e,
                        this._initBaseScale || (this._baseScaleX = this.scaleX,
                            this._baseScaleY = this.scaleY,
                            this._initBaseScale = !0),
                        this.scaleAniX = this._baseScaleX,
                        this.scaleAniY = this._baseScaleY,
                        this._noAdjustSize || this.adjustBoundSize(i),
                        this.ani.frames = a.createFrames(t, ""),
                        this.autoPlay || (this.ani.graphics = null),
                        this.event(Laya.Event.LOADED)
                }
            }
        }
        adjustBoundSize(e) {
            let t = 0
                , i = 0;
            for (var s in e.res) {
                s = e.res[s];
                t = Math.max(t, s.w),
                    i = Math.max(i, s.h)
            }
            this.width = this.width || t,
                this.height = this.height || i,
                this.ani.x = this.width / 2,
                this.ani.y = this.height / 2
        }
        play(e) {
            this.ani.play(e)
        }
        gotoAndStop(e) {
            this.ani.gotoAndStop(e)
        }
        stop() {
            this.ani.stop(),
                this.ani.graphics = null
        }
        clear() {
            this._skin = "",
                this.ani.clear()
        }
        onLoopComplete() {
            this._completedLoop++,
                0 < this._loopCount && this._completedLoop >= this._loopCount && Laya.timer.callLater(this, () => {
                    this.stop(),
                        this.event(Laya.Event.COMPLETE),
                        this._autoRemove && this.removeSelf()
                }
                )
        }
        get animation() {
            return this.ani
        }
        destroy(e = !0) {
            this.scaleX = 1,
                this.scaleY = 1,
                this._aniScaleX = 1,
                this._aniScaleY = 1,
                this._baseScaleX = 1,
                this._baseScaleY = 1,
                this._initBaseScale = !1,
                this.offAll(),
                this.clear(),
                super.destroy(e)
        }
    }
    class B {
        constructor(e) {
            this._downMode = !1,
                this._clicked = !1,
                this.outed = !1,
                this.canceled = !1,
                this.scale = .9,
                this.button = e
        }
        static create(e) {
            return new B(e)
        }
        onEvent(e) {
            let t = e.type;
            t === Laya.Event.MOUSE_DOWN ? this.promise = this.scaleDown().then(() => { }
            ) : t === Laya.Event.MOUSE_OUT || t === Laya.Event.MOUSE_UP ? (this.outed = !0,
                this.promise && this.promise.then(() => this.scaleUp())) : t === Laya.Event.CLICK && (this._clicked = !0,
                    this.promise && this.promise.then(() => !this.outed && this.scaleUp()).then(() => {
                        this._clicked = !1,
                            this.doClick()
                    }
                    )),
                this.promise && this.promise.then(() => {
                    if (!this.canceled) {
                        let e = this.button;
                        e.selected || e.setState(Laya.Button.stateMap[t])
                    }
                }
                )
        }
        scaleDown() {
            return this.downMode = !0,
                Promise.resolve(void 0)
        }
        scaleUp() {
            return this.downMode = !1,
                Promise.resolve(void 0)
        }
        get downMode() {
            return this._downMode
        }
        set downMode(e) {
            let t = this.button;
            var i, s, a, n, o, r, l;
            t.parent && this._downMode != e && (this._downMode = e,
                t.parent,
                i = t.left,
                s = t.right,
                a = t.top,
                n = t.bottom,
                t.top = t.bottom = t.left = t.right = NaN,
                e ? (this._oldPivotX = t.pivotX,
                    this._oldPivotY = t.pivotY,
                    e = .5 * t.width,
                    l = .5 * t.height,
                    o = (e - this._oldPivotX) * t.scaleX,
                    r = (l - this._oldPivotY) * t.scaleY,
                    t.pivot(e, l),
                    t.pos(t.x + o, t.y + r),
                    t.set_scaleX(t.scaleX * this.scale),
                    t.set_scaleY(t.scaleY * this.scale)) : (t.set_scaleX(t.scaleX / this.scale),
                        t.set_scaleY(t.scaleY / this.scale),
                        e = (this._oldPivotX - t.pivotX) * t.scaleX,
                        l = (this._oldPivotY - t.pivotY) * t.scaleY,
                        t.pivot(this._oldPivotX, this._oldPivotY),
                        t.pos(t.x + e, t.y + l),
                        t.left = i,
                        t.right = s,
                        t.top = a,
                        t.bottom = n))
        }
        cancel() {
            this.downMode && (this._clicked && this.doClick(),
                this.downMode = !1)
        }
        doClick() {
            if (!this.downMode) {
                let e = this.button;
                e.toggle && (e.selected = !e.selected),
                    e.clickHandler && e.clickHandler.run()
            }
        }
    }
    class o extends Laya.Button {
        constructor() {
            super(...arguments),
                this._enableAnimating = !0,
                this._reversed = !1,
                this._reverseDirection = o.REVERSE_HORIZONTAL,
                this.enableLongPress = !1
        }
        onAwake() {
            super.onAwake(),
                this.text.wordWrap = !0,
                this.text.x += 15
        }
        get enableAnimating() {
            return this._enableAnimating
        }
        set enableAnimating(e) {
            this._enableAnimating = e
        }
        set image(e) {
            if (this._imageSkin != e) {
                if (!this._image) {
                    let e = this._image = new Laya.Image;
                    e.anchorX = e.anchorY = .5,
                        e.centerX = -0,
                        e.centerY = -8,
                        this.addChild(e)
                }
                this._imageSkin = e,
                    this._image.skin = e,
                    Laya.timer.callLater(this, this.changeImages)
            }
        }
        get image() {
            return this._imageSkin
        }
        get imageItem() {
            return this._image
        }
        get effectOn() {
            return this._effectOn
        }
        set effectOn(e) {
            this._effectOn != e && (this._effectOn = e,
                Laya.timer.callLater(this, this.updateEffect))
        }
        get effect() {
            return this._effect
        }
        set effect(e) {
            this._effect != e && (this._effect = e,
                Laya.timer.callLater(this, this.updateEffect))
        }
        get effectAutoScale() {
            return this._effectAutoScale
        }
        set effectAutoScale(e) {
            this._effectAutoScale = e
        }
        get effectLayer() {
            return this._effectLayer
        }
        set effectLayer(e) {
            this._effectLayer != e && (this._effectLayer = e,
                Laya.timer.callLater(this, this.updateEffect))
        }
        get reverseDirection() {
            return this._reverseDirection
        }
        set reverseDirection(e) {
            this._reverseDirection != e && (this._reverseDirection = e)
        }
        get reversed() {
            return this._reversed
        }
        set reversed(e) {
            this._reversed != e && (this._reversed = e)
        }
        updateEffect() {
            if (this._effect)
                if (this._effectOn) {
                    var t = this._effectLayer || o.LAYER_BOTTOM;
                    let e = this._effectAni;
                    e || ((e = this._effectAni = new G).centerX = e.centerY = 0,
                        t == o.LAYER_TOP ? this.addChild(e) : t == o.LAYER_BOTTOM && this.addChildAt(e, 0)),
                        e.autoPlay = !0,
                        e.skin != this._effect && (e.skin = this._effect,
                            this._effectAutoScale && e.once(Laya.Event.LOADED, this, () => {
                                e.scaleX = this.width / e.width,
                                    e.scaleY = this.height / e.height
                            }
                            ))
                } else {
                    let e = this._effectAni;
                    e && (e.autoPlay = !1)
                }
            else
                this._effectAni && (this._effectAni.autoPlay = !1)
        }
        onMouse(e) {
            this.enableAnimating ? !1 === this.toggle && this._selected || (this._mouseClick || (this._mouseClick = B.create(this)),
                e.type !== Laya.Event.MOUSE_DOWN && e.type !== Laya.Event.MOUSE_OVER || this._mouseClick.cancel(),
                this._mouseClick.onEvent(e),
                this.enableLongPress && e.type == Laya.Event.MOUSE_DOWN && e.stopPropagation()) : super.onMouse(e)
        }
        changeImages() {
            if (!this.destroyed) {
                let e = Laya.Loader.getRes(this._imageSkin);
                var t, i, s;
                e && (e.$_GID || (e.$_GID = Laya.Utils.getGID()),
                    t = e.$_GID,
                    (i = Laya.WeakObject.I.get(t)) ? this._imageSources = i : (this._imageSources = [e],
                        i = Laya.Loader.getRes(this.getStateRes(this._imageSkin, "down")),
                        s = Laya.Loader.getRes(this.getStateRes(this._imageSkin, "select")),
                        i && this._imageSources.push(i),
                        s && (i || this._imageSources.push(e),
                            this._imageSources.push(s)),
                        Laya.WeakObject.I.set(t, this._imageSources)))
            }
        }
        changeClips() {
            if (!this.destroyed && this._skin) {
                let e = Laya.Loader.getRes(this._skin);
                var t, i, s, a, n;
                e && (t = e.sourceWidth,
                    i = e.sourceHeight,
                    e.$_GID || (e.$_GID = Laya.Utils.getGID()),
                    s = e.$_GID,
                    (a = Laya.WeakObject.I.get(s)) ? this._sources = a : (this._sources = [e],
                        a = Laya.Loader.getRes(this.getStateRes(this._skin, "down")),
                        n = Laya.Loader.getRes(this.getStateRes(this._skin, "select")),
                        a && this._sources.push(a),
                        n && (a || this._sources.push(e),
                            this._sources.push(n)),
                        Laya.WeakObject.I.set(s, this._sources)),
                    this._autoSize ? (this._bitmap.width = this.width || t,
                        this._bitmap.height = this.height || i,
                        this._text && (this._text.width = this._bitmap.width - 30,
                            this._text.height = this._bitmap.height)) : this._text && (this._text.x = t))
            }
        }
        setState(e) {
            this.state = e
        }
        changeState() {
            var e;
            this.destroyed || (this._stateChanged = !1,
                this.runCallLater(this.changeClips),
                this._sources && (e = this._sources.length,
                    e = this._state < e ? this._state : e - 1,
                    e = this._sources[e],
                    this._bitmap.source = e),
                this.runCallLater(this.changeImages),
                this._imageSources && this._image && (e = this._imageSources.length,
                    e = this._state < e ? this._state : e - 1,
                    e = this._imageSources[e],
                    this._image.source = e),
                this.label && this._sources && (e = this._sources.length,
                    e = this._state < e ? this._state : e - 1,
                    this._text.color = this._labelColors[e],
                    this._strokeColors && (this._text.strokeColor = this._strokeColors[e])))
        }
        getStateRes(e, t) {
            var i = e.lastIndexOf(".");
            return i < 0 ? e : e.substr(0, i) + "$" + t + e.substr(i)
        }
        destroy(e = !0) {
            Laya.timer.clearAll(this),
                super.destroy(e)
        }
    }
    o.REVERSE_HORIZONTAL = "horizontal",
        o.REVERSE_VERTICAL = "vertical",
        o.LAYER_TOP = "top",
        o.LAYER_BOTTOM = "bottom";
    class q extends Laya.CheckBox {
    }
    class U extends Laya.ComboBox {
    }
    class O extends Laya.HBox {
        constructor() {
            super(),
                this.filterVisible = !1,
                this.enable = !0,
                this.filterHandler = new Laya.Handler(this, this._defaultFilter)
        }
        sortItem(e) {
            this.sortHandler && this.sortHandler.runWith([e])
        }
        _defaultFilter(e) {
            return !!e && !(this.filterVisible && !e.visible)
        }
        changeItems() {
            if (this.enable) {
                this._itemChanged = !1;
                let i = []
                    , s = 0;
                for (let e = 0, t = this.numChildren; e < t; e++) {
                    var n = this.getChildAt(e);
                    this.filterHandler.runWith(n) && (i.push(n),
                        s = this.height || Math.max(s, n.height * n.scaleY))
                }
                this.sortItem(i);
                let a = 0;
                for (let t = 0, e = i.length; t < e; t++) {
                    let e = i[t];
                    e.x = a,
                        a += e.width * e.scaleX + this._space,
                        this._align == O.TOP ? e.y = 0 : this._align == O.MIDDLE ? e.y = .5 * (s - e.height * e.scaleY) : this._align == O.BOTTOM && (e.y = s - e.height * e.scaleY)
                }
                this.event(Laya.Event.RESIZE),
                    this.onCompResize()
            }
        }
        get contentWidth() {
            return this.measureWidth
        }
        get contentHeight() {
            return this.measureHeight
        }
        commitMeasure() {
            super.commitMeasure(),
                this.runCallLater(this.changeItems)
        }
    }
    class H extends Laya.VBox {
        constructor() {
            super(),
                this.filterVisible = !1,
                this.enable = !0,
                this.filterHandler = new Laya.Handler(this, this._defaultFilter)
        }
        sortItem(e) {
            this.sortHandler && this.sortHandler.runWith([e])
        }
        _defaultFilter(e) {
            return !!e && !(this.filterVisible && !e.visible)
        }
        changeItems() {
            if (this.enable) {
                this._itemChanged = !1;
                let i = []
                    , s = 0;
                for (let e = 0, t = this.numChildren; e < t; e++) {
                    var a = this.getChildAt(e);
                    this.filterHandler.runWith(a) && (i.push(a),
                        s = this.width || Math.max(s, a.width * a.scaleX))
                }
                this.sortItem(i);
                var n = 0;
                for (let t = 0, e = i.length; t < e; t++) {
                    let e = i[t];
                    e.y = n,
                        n += e.height * e.scaleY + this._space,
                        this._align == H.LEFT ? e.x = 0 : this._align == H.CENTER ? e.x = .5 * (s - e.width * e.scaleX) : this._align == H.RIGHT && (e.x = s - e.width * e.scaleX)
                }
                this.event(Laya.Event.RESIZE),
                    this.onCompResize()
            }
        }
        get contentWidth() {
            return this.measureWidth
        }
        get contentHeight() {
            return this.measureHeight
        }
        commitMeasure() {
            super.commitMeasure(),
                this.runCallLater(this.changeItems)
        }
    }
    function W(s) {
        for (var t in s.on(Laya.Event.CLICK, s, (t, i) => {
            var s = i.target.name;
            if (s) {
                let e = t["onClick" + s];
                e && e.call(t, i)
            }
        }
            , [s]),
            s)
            if (s.hasOwnProperty(t)) {
                if (t.includes("m_chb_")) {
                    let e = s[t];
                    var i = t.replace("m_chb_", "")
                        , i = s["onSelect" + i];
                    i && (e.clickHandler = Laya.Handler.create(s, i, [e], !1))
                }
                if (t.includes("m_cob_")) {
                    let e = s[t];
                    var i = t.replace("m_cob_", "")
                        , a = s["onSelect" + i];
                    a && (e.selectHandler = Laya.Handler.create(s, a, null, !1))
                }
                if (t.includes("m_lst_")) {
                    let e = s[t];
                    a = t.replace("m_lst_", "");
                    let i = s["onSelect" + a];
                    i && (e.selectHandler = Laya.Handler.create(s, i, null, !1)),
                        e.renderHandler = Laya.Handler.create(s, (e, t) => {
                            e.dataChanged && e.dataChanged(t)
                        }
                            , null, !1),
                        (i = s["onClick" + a]) && (e.mouseHandler = Laya.Handler.create(s, (e, t) => {
                            e.type == Laya.Event.CLICK && i && i.apply(s, [e, t])
                        }
                            , null, !1)),
                        e.scrollBar && (e.scrollBar.elasticDistance = 100,
                            e.scrollBar.elasticBackTime = 200,
                            e.scrollBar.hide = !0)
                }
                if (t.includes("m_sli_")) {
                    let e = s[t];
                    var n = t.replace("m_sli_", "")
                        , n = s["onChange" + n];
                    n && (e.changeHandler = Laya.Handler.create(s, n, null, !1))
                }
                if (t.includes("m_rg_")) {
                    let e = s[t];
                    var n = t.replace("m_rg_", "")
                        , o = s["onSelect" + n];
                    o && (e.selectHandler = Laya.Handler.create(s, o, null, !1))
                }
                if (t.includes("m_tab_")) {
                    let e = s[t];
                    var o = t.replace("m_tab_", "")
                        , r = s["onSelect" + o];
                    r && (e.selectHandler = Laya.Handler.create(s, r, null, !1))
                }
                if (t.includes("m_pan_")) {
                    let e = s[t];
                    e.vScrollBar && (e.vScrollBar.elasticDistance = 100,
                        e.vScrollBar.elasticBackTime = 200,
                        e.vScrollBar.hide = !0),
                        e.hScrollBar && (e.hScrollBar.elasticDistance = 100,
                            e.hScrollBar.elasticBackTime = 200,
                            e.hScrollBar.hide = !0)
                }
            }
    }
    function V(t) {
        for (var i in t)
            if (t.hasOwnProperty(i)) {
                if (i.includes("m_chb_")) {
                    let e = t[i];
                    e.clickHandler && (e.clickHandler.recover(),
                        e.clickHandler = null)
                }
                if (i.includes("m_cob_")) {
                    let e = t[i];
                    e.selectHandler && (e.selectHandler.recover(),
                        e.selectHandler = null)
                }
                if (i.includes("m_lst_")) {
                    let e = t[i];
                    e.renderHandler && (e.renderHandler.recover(),
                        e.renderHandler = null),
                        e.selectHandler && (e.selectHandler.recover(),
                            e.selectHandler = null),
                        e.mouseHandler && (e.mouseHandler.recover(),
                            e.mouseHandler = null)
                }
                if (i.includes("m_sli_")) {
                    let e = t[i];
                    e.changeHandler && (e.changeHandler.recover(),
                        e.changeHandler = null)
                }
                if (i.includes("m_rg_")) {
                    let e = t[i];
                    e.selectHandler && (e.selectHandler.recover(),
                        e.selectHandler = null)
                }
                if (i.includes("m_tab_")) {
                    let e = t[i];
                    e.selectHandler && (e.selectHandler.recover(),
                        e.selectHandler = null)
                }
            }
    }
    let Y = new Laya.EventDispatcher;
    class X extends Laya.Scene {
        onAwake() {
            super.onAwake(),
                this.registerModelEvents(!0),
                W(this)
        }
        onDestroy() {
            super.onDestroy(),
                this.registerModelEvents(!1),
                V(this)
        }
        registerModelEvents(t) {
            this._modelEvents && this._modelEvents.length && this._modelEvents.forEach(e => {
                t ? Y.on(e.eventType, this, e.handler) : Y.off(e.eventType, this, e.handler)
            }
            )
        }
    }
    class z extends Laya.View {
        constructor() {
            super(...arguments),
                this._preFuncs = [],
                this._preUrls = []
        }
        get assetCollector() {
            return this._assetCollector
        }
        set assetCollector(e) {
            this._assetCollector = e
        }
        onAwake() {
            super.onAwake(),
                this.adaptBg(),
                this.registerModelEvents(!0),
                W(this)
        }
        onDestroy() {
            super.onDestroy(),
                this.registerModelEvents(!1),
                this.cancelLoadRes(),
                Laya.Tween.clearAll(this),
                V(this)
        }
        openView() {
            return new Promise((e, t) => {
                this.addPreFunc(() => this.loadViewComplete()),
                    this.addPreFunc(() => this.loadPreRes());
                let i = [];
                this._preFuncs.forEach(e => i.push(e())),
                    Promise.all(i).then(() => {
                        (this.destroyed ? t : e)()
                    }
                    ).catch(e => {
                        console.error(e),
                            t()
                    }
                    )
            }
            )
        }
        loadP(e, t, i, s, a) {
            return Laya.loader.loadP(e, null, t, i, s, a)
        }
        registerModelEvents(t) {
            this._modelEvents && this._modelEvents.length && this._modelEvents.forEach(e => {
                t ? Y.on(e.eventType, this, e.handler) : Y.off(e.eventType, this, e.handler)
            }
            )
        }
        addPreRes(e) {
            Array.isArray(e) ? this._preUrls = e : this._preUrls.push(e)
        }
        addPreFunc(e) {
            this._preFuncs.pushOnce(e)
        }
        loadViewComplete() {
            return this._viewCreated ? Promise.resolve(this) : new Promise((e, t) => {
                this.once("onViewCreated", this, () => e(this))
            }
            )
        }
        loadPreRes() {
            return this._preUrls.length ? new Promise((e, t) => {
                this.loadP(this._preUrls, null, 0).then(() => {
                    this._preUrls = null,
                        e()
                }
                )
            }
            ) : Promise.resolve()
        }
        cancelLoadRes() {
            this._preUrls && (Laya.loader.cancelLoadByUrls(this._preUrls),
                this._preUrls = null)
        }
        adaptBg() {
            let e = this.m_img_AdaptBg;
            var t;
            e && (t = Mmobay.Utils.getScreenInfo(),
                e.size(t.stageWidth, t.stageHeight),
                e.centerX = e.centerY = 0,
                e.mouseEnabled = !0,
                e.mouseThrough = !1)
        }
    }
    const j = {};
    var c, $, r;
    (t = c = c || {})[t.Fight = 0] = "Fight",
        t[t.Main = 1] = "Main",
        t[t.Secondary = 2] = "Secondary",
        t[t.Fixui = 3] = "Fixui",
        t[t.Popup = 4] = "Popup",
        t[t.Effect = 5] = "Effect",
        t[t.Toast = 6] = "Toast",
        t[t.Loading = 7] = "Loading",
        t[t.System = 8] = "System",
        (t = $ = $ || {})[t.Yes = 1] = "Yes",
        t[t.No = 2] = "No",
        t[t.YesNo = 3] = "YesNo",
        (t = r = r || {})[t.None = 0] = "None",
        t[t.Yes = 1] = "Yes",
        t[t.No = 2] = "No",
        t[t.Skip = 3] = "Skip";
    class J extends Laya.UIComponent {
        constructor(e) {
            super(),
                this.size(560, 1120),
                this.centerX = this.centerY = 0,
                this.name = e.name,
                this.zOrder = e.zOrder,
                this.mouseThrough = !0,
                this._layer = e.layer
        }
        get layer() {
            return this._layer
        }
    }
    class s {
        constructor() {
            this._mainDlgs = [],
                this._secondaryDlgs = [],
                this._popupDlgs = []
        }
        static get instance() {
            return s._instance
        }
        static init() {
            let e = [{
                name: "fight",
                layer: c.Fight,
                zOrder: 1100
            }, {
                name: "main",
                layer: c.Main,
                zOrder: 1200
            }, {
                name: "secondary",
                layer: c.Secondary,
                zOrder: 1300
            }, {
                name: "fixui",
                layer: c.Fixui,
                zOrder: 1400
            }, {
                name: "popup",
                layer: c.Popup,
                zOrder: 1500
            }, {
                name: "effect",
                layer: c.Effect,
                zOrder: 1600
            }, {
                name: "toast",
                layer: c.Toast,
                zOrder: 1700
            }, {
                name: "loading",
                layer: c.Loading,
                zOrder: 1800
            }, {
                name: "system",
                layer: c.System,
                zOrder: 1900
            }]
                , t = (e.forEach(e => {
                    var t = new J(e);
                    Laya.stage.addChild(t),
                        this._containers[e.layer] = t
                }
                ),
                    s._instance = new s);
            t.createMask(),
                t.crateFixui()
        }
        static add2Container(e, t) {
            let i = s._containers[t];
            i && i.addChild(e)
        }
        get fightLayer() {
            return s._containers[c.Fight]
        }
        get mainLayer() {
            return s._containers[c.Main]
        }
        get secondaryLayer() {
            return s._containers[c.Secondary]
        }
        get fixuiLayer() {
            return s._containers[c.Fixui]
        }
        get popupLayer() {
            return s._containers[c.Popup]
        }
        get effectLayer() {
            return s._containers[c.Effect]
        }
        get systemLayer() {
            return s._containers[c.System]
        }
        enableShield(e) {
            if (e) {
                if (!this._boxShield) {
                    let e = this._boxShield = new Laya.Box;
                    e.zOrder = 2e3,
                        e.size(Laya.stage.width, Laya.stage.height),
                        e.centerX = e.centerY = 0,
                        e.mouseEnabled = !0
                }
                Laya.stage.addChild(this._boxShield)
            } else
                this._boxShield && this._boxShield.removeSelf()
        }
        show(t, i = c.Popup, e = j) {
            if (t && !t.destroyed)
                if (i == c.Main)
                    this.add2Main(t, e);
                else if (i == c.Secondary)
                    this.add2Secondary(t, e);
                else if (i == c.Popup)
                    this.add2Popup(t, e);
                else {
                    let e = s._containers[i];
                    e.addChild(t)
                }
        }
        close(t, e = r.None, i) {
            if (t && !t.destroyed) {
                var s = t.parent;
                if (s)
                    "secondary" == s.name ? this.checkSecondary(t) : "popup" == s.name && this.checkPopup(t);
                else {
                    for (let e = 0; e < this._secondaryDlgs.length; e++)
                        if (t == this._secondaryDlgs[e]) {
                            this._secondaryDlgs.splice(e, 1);
                            break
                        }
                    for (let e = 0; e < this._popupDlgs.length; e++)
                        if (t == this._popupDlgs[e]) {
                            this._popupDlgs.splice(e, 1);
                            break
                        }
                }
                t.event(Laya.Event.CLOSE, i ? [e, i] : e),
                    t.destroy()
            }
        }
        clearMain() {
            let e = this._mainDlgs;
            e.forEach(e => {
                e.destroy()
            }
            ),
                this._mainDlgs.length = 0
        }
        add2Main(e, t) {
            let i = this._mainDlgs.pop();
            i && i.destroy(),
                this.mainLayer.addChild(e),
                this._mainDlgs.push(e)
        }
        add2Secondary(e, i) {
            if (e.hitTestPrior = !1,
                i.isInstant) {
                var s = this._secondaryDlgs.length;
                for (let t = 0; t < s; t++) {
                    let e = this._secondaryDlgs[t];
                    if (e instanceof i.cf) {
                        this._secondaryDlgs.splice(t, 1),
                            e.destroy();
                        break
                    }
                }
            }
            if (i.hideCurrent) {
                var t = this._secondaryDlgs.length;
                let e = this._secondaryDlgs[t - 1];
                e && e.removeSelf()
            }
            this.secondaryLayer.addChild(e),
                this._secondaryDlgs.push(e),
                this.mainLayer.removeSelf()
        }
        add2Popup(e, t) {
            if (e.hitTestPrior = !1,
                t.clearPopup)
                this._popupDlgs.forEach(e => {
                    e.event(Laya.Event.CLOSE, r.None),
                        e.destroy()
                }
                ),
                    this._popupDlgs = [];
            else {
                var i = this._popupDlgs.length;
                let e = this._popupDlgs[i - 1];
                t.retainPopup ? e && (e.zOrder = -1) : e && e.removeSelf()
            }
            this.popupLayer.addChild(e),
                this._popupDlgs.push(e),
                e.zOrder = this._popupDlgs.length,
                t.showEffect && Laya.Tween.from(e, {
                    alpha: 0,
                    scaleX: .8,
                    scaleY: .8
                }, 200, Laya.Ease.backOut),
                this._boxMask.visible = !0
        }
        checkSecondary(t) {
            for (let e = 0; e < this._secondaryDlgs.length; e++)
                if (t == this._secondaryDlgs[e]) {
                    this._secondaryDlgs.splice(e, 1);
                    break
                }
            var e = this._secondaryDlgs.length
                , e = this._secondaryDlgs[e - 1];
            e && this.secondaryLayer.addChild(e),
                0 != this._secondaryDlgs.length || this.mainLayer.parent || Laya.stage.addChild(this.mainLayer)
        }
        getCurSecondaryDlg() {
            var e = this._secondaryDlgs.length;
            return this._secondaryDlgs[e - 1] || null
        }
        checkPopup(t) {
            for (let e = 0; e < this._popupDlgs.length; e++)
                if (t == this._popupDlgs[e]) {
                    this._popupDlgs.splice(e, 1);
                    break
                }
            var i = this._popupDlgs.length;
            if (i) {
                let e = this._popupDlgs[i - 1];
                e.zOrder = i,
                    this.popupLayer.addChild(e)
            } else
                this._boxMask.visible = !1
        }
        removeTopPopup() {
            var e = this._popupDlgs.length
                , e = this._popupDlgs[e - 1];
            e.closeOnSide && this.close(e)
        }
        removeAllPopup() {
            this._popupDlgs.forEach(e => {
                e.event(Laya.Event.CLOSE, r.None),
                    e.destroy()
            }
            ),
                this._popupDlgs = [],
                this._boxMask.visible = !1
        }
        removeAllsecondary() {
            this._secondaryDlgs.forEach(e => {
                e.event(Laya.Event.CLOSE, r.None),
                    e.destroy()
            }
            ),
                this._secondaryDlgs = [],
                this.checkSecondary(null)
        }
        createMask() {
            let e = new Laya.Box;
            e.size(Laya.stage.width + 2, Laya.stage.height),
                e.bgColor = "#000000",
                e.zOrder = 0,
                e.alpha = .7,
                e.centerX = e.centerY = 0,
                e.visible = !1,
                e.mouseThrough = !1,
                e.mouseEnabled = !0,
                e.on(Laya.Event.CLICK, this, this.removeTopPopup),
                this._boxMask = e,
                this.popupLayer.addChild(e)
        }
        crateFixui() {
            if (!(Mmobay.adaptOffsetHeight <= 0)) {
                let e = .5 * Mmobay.adaptOffsetHeight
                    , t = (e < 80 && (e = 80),
                        new Laya.Box)
                    , i = (t.size(560, e),
                        t.centerX = 0,
                        t.top = -e,
                        t.on(Laya.Event.CLICK, this, () => {
                            console.log("click top fixui")
                        }
                        ),
                        this.fixuiLayer.addChild(t),
                        new Laya.Image("cat/ui_comm/s9_po9.png"))
                    , s = (i.sizeGrid = "1,1,1,1",
                        i.left = i.right = 0,
                        i.top = i.bottom = -2,
                        t.addChild(i),
                        new Laya.Image("cat/ui_comm/fix_flower.png"))
                    , a = (s.bottom = 0,
                        s.left = 65,
                        s.scaleX = -1,
                        t.addChild(s),
                        new Laya.Image("cat/ui_comm/fix_flower.png"))
                    , n = (a.bottom = 0,
                        a.right = 0,
                        t.addChild(a),
                        new Laya.Box);
                n.size(560, e),
                    n.centerX = 0,
                    n.bottom = -e,
                    n.on(Laya.Event.CLICK, this, () => {
                        console.log("click bottom fixui")
                    }
                    ),
                    this.fixuiLayer.addChild(n),
                    (i = new Laya.Image("cat/ui_comm/s9_po9.png")).sizeGrid = "1,1,1,1",
                    i.left = i.right = 0,
                    i.top = i.bottom = -1,
                    n.addChild(i),
                    (s = new Laya.Image("cat/ui_comm/fix_flower.png")).scaleX = -1,
                    s.left = 65,
                    s.top = 0,
                    n.addChild(s),
                    (a = new Laya.Image("cat/ui_comm/fix_flower.png")).top = 0,
                    a.right = 0,
                    n.addChild(a)
            }
        }
    }
    s._containers = {},
        window.DialogManager = s;
    class K extends Laya.UIComponent {
        constructor(t, e = 0, i) {
            super();
            let s = 560
                , a = (0 < Mmobay.adaptOffsetWidth && (s += Mmobay.adaptOffsetWidth),
                    this.size(s, 72),
                    this.top = 0,
                    this.centerX = 0,
                    new o("cat/ui_comm/img_public_btn_back.png"));
            if (a.stateNum = 1,
                a.left = 7,
                a.centerY = 0,
                a.name = "Back",
                this.addChild(a),
                !i && t) {
                let e = new Laya.Label(t);
                e.fontSize = 24,
                    e.x += 10,
                    e.color = "#ffffff",
                    e.centerX = e.centerY = 0,
                    e.bold = !0,
                    e.wordWrap = !0,
                    e.width = 390,
                    e.align = "center",
                    this.addChild(e),
                    this._txtInfo = e
            }
            this.mouseThrough = !0
        }
        update(e) {
            this._txtInfo.text = e
        }
    }
    class Z extends z {
        constructor() {
            super(...arguments),
                this.m_closeOnSide = !0
        }
        static get manager() {
            return s.instance
        }
        get closeOnSide() {
            return this.m_closeOnSide
        }
        set closeOnSide(e) {
            this.m_closeOnSide = e
        }
        showDialog(e, t) {
            this.closeOnSide = t.closeOnSide,
                Z.manager.show(this, e, t)
        }
        closeDialog(e = r.No, t) {
            Z.manager.close(this, e, t)
        }
        wait() {
            return new Promise((i, e) => {
                this.once(Laya.Event.CLOSE, this, (e, t) => {
                    i({
                        type: e,
                        data: t
                    })
                }
                )
            }
            )
        }
        checkOpen() {
            return !0
        }
        addTitle(e, t, i) {
            this._title || (e = new K(e, !!t, i),
                this._title = e,
                this.addChild(e))
        }
        updateTitle(e) {
            this._title && this._title.update(e)
        }
        onClickClose(e) {
            this.closeDialog()
        }
        onClickBack(e) {
            this.closeDialog()
        }
        onClickHelp(e) { }
    }
    var e, t = z, i = Z, l = Laya.ClassUtils.regClass, h = e = e || {};
    h = (h = h.cat || (h.cat = {})).views || (h.views = {});
    {
        h = h.common || (h.common = {});
        class ai extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/BuyItemDlg")
            }
        }
        h.BuyItemDlgUI = ai,
            l("ui.cat.views.common.BuyItemDlgUI", ai);
        class ni extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/CommRewardDlg")
            }
        }
        h.CommRewardDlgUI = ni,
            l("ui.cat.views.common.CommRewardDlgUI", ni);
        class oi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/CountView")
            }
        }
        h.CountViewUI = oi,
            l("ui.cat.views.common.CountViewUI", oi);
        class ri extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/FingerView")
            }
        }
        h.FingerViewUI = ri,
            l("ui.cat.views.common.FingerViewUI", ri);
        class li extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/FishCoinView")
            }
        }
        h.FishCoinViewUI = li,
            l("ui.cat.views.common.FishCoinViewUI", li);
        class hi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/LoadingView")
            }
        }
        h.LoadingViewUI = hi,
            l("ui.cat.views.common.LoadingViewUI", hi);
        class ci extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/LvView")
            }
        }
        h.LvViewUI = ci,
            l("ui.cat.views.common.LvViewUI", ci);
        class mi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/MsgBox")
            }
        }
        h.MsgBoxUI = mi,
            l("ui.cat.views.common.MsgBoxUI", mi);
        class di extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/NewView")
            }
        }
        h.NewViewUI = di,
            l("ui.cat.views.common.NewViewUI", di);
        class _i extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/SystemNotice")
            }
        }
        h.SystemNoticeUI = _i,
            l("ui.cat.views.common.SystemNoticeUI", _i);
        class ui extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/ToastView")
            }
        }
        h.ToastViewUI = ui,
            l("ui.cat.views.common.ToastViewUI", ui);
        class gi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/common/WifiView")
            }
        }
        h.WifiViewUI = gi,
            l("ui.cat.views.common.WifiViewUI", gi)
    }
    h = e = e || {};
    h = (h = h.cat || (h.cat = {})).views || (h.views = {});
    {
        h = h.entrance || (h.entrance = {});
        class pi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/entrance/GameEntrance")
            }
        }
        h.GameEntranceUI = pi,
            l("ui.cat.views.entrance.GameEntranceUI", pi)
    }
    h = e = e || {};
    h = (h = h.cat || (h.cat = {})).views || (h.views = {});
    {
        h = h.fish || (h.fish = {});
        class Ci extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishAutoDlg")
            }
        }
        h.FishAutoDlgUI = Ci,
            l("ui.cat.views.fish.FishAutoDlgUI", Ci);
        class yi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishDlg")
            }
        }
        h.FishDlgUI = yi,
            l("ui.cat.views.fish.FishDlgUI", yi);
        class fi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishHistoryCellView")
            }
        }
        h.FishHistoryCellViewUI = fi,
            l("ui.cat.views.fish.FishHistoryCellViewUI", fi);
        class vi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishItemView")
            }
        }
        h.FishItemViewUI = vi,
            l("ui.cat.views.fish.FishItemViewUI", vi);
        class bi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishRankCellView")
            }
        }
        h.FishRankCellViewUI = bi,
            l("ui.cat.views.fish.FishRankCellViewUI", bi);
        class ki extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishRankDlg")
            }
        }
        h.FishRankDlgUI = ki,
            l("ui.cat.views.fish.FishRankDlgUI", ki);
        class Si extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishRewardDetailCellView")
            }
        }
        h.FishRewardDetailCellViewUI = Si,
            l("ui.cat.views.fish.FishRewardDetailCellViewUI", Si);
        class wi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishRewardDetailDlg")
            }
        }
        h.FishRewardDetailDlgUI = wi,
            l("ui.cat.views.fish.FishRewardDetailDlgUI", wi);
        class xi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishRewardDlg")
            }
        }
        h.FishRewardDlgUI = xi,
            l("ui.cat.views.fish.FishRewardDlgUI", xi);
        class Ri extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishRewardRuleDlg")
            }
        }
        h.FishRewardRuleDlgUI = Ri,
            l("ui.cat.views.fish.FishRewardRuleDlgUI", Ri);
        class Li extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishRuleDlg")
            }
        }
        h.FishRuleDlgUI = Li,
            l("ui.cat.views.fish.FishRuleDlgUI", Li);
        class Di extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishSuccDlg")
            }
        }
        h.FishSuccDlgUI = Di,
            l("ui.cat.views.fish.FishSuccDlgUI", Di);
        class Ti extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/fish/FishUpgradeDlg")
            }
        }
        h.FishUpgradeDlgUI = Ti,
            l("ui.cat.views.fish.FishUpgradeDlgUI", Ti)
    }
    h = e = e || {};
    h = (h = h.cat || (h.cat = {})).views || (h.views = {});
    {
        h = h.home || (h.home = {});
        class Ei extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/AutoDlg")
            }
        }
        h.AutoDlgUI = Ei,
            l("ui.cat.views.home.AutoDlgUI", Ei);
        class Ii extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/FirstRechargeDlg")
            }
        }
        h.FirstRechargeDlgUI = Ii,
            l("ui.cat.views.home.FirstRechargeDlgUI", Ii);
        class Ai extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/OffLineDlg")
            }
        }
        h.OffLineDlgUI = Ai,
            l("ui.cat.views.home.OffLineDlgUI", Ai);
        class Mi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/OfficeDlg")
            }
        }
        h.OfficeDlgUI = Mi,
            l("ui.cat.views.home.OfficeDlgUI", Mi);
        class Ni extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/RandomEventsDlg")
            }
        }
        h.RandomEventsDlgUI = Ni,
            l("ui.cat.views.home.RandomEventsDlgUI", Ni);
        class Pi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/ShopCellView")
            }
        }
        h.ShopCellViewUI = Pi,
            l("ui.cat.views.home.ShopCellViewUI", Pi);
        class Fi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/ShopDlg")
            }
        }
        h.ShopDlgUI = Fi,
            l("ui.cat.views.home.ShopDlgUI", Fi);
        class Gi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/SpeedDlg")
            }
        }
        h.SpeedDlgUI = Gi,
            l("ui.cat.views.home.SpeedDlgUI", Gi);
        class Bi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/SumCatView")
            }
        }
        h.SumCatViewUI = Bi,
            l("ui.cat.views.home.SumCatViewUI", Bi);
        class qi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/home/UpGradeDlg")
            }
        }
        h.UpGradeDlgUI = qi,
            l("ui.cat.views.home.UpGradeDlgUI", qi)
    }
    h = e = e || {};
    h = (h = h.cat || (h.cat = {})).views || (h.views = {});
    {
        h = h.recharge || (h.recharge = {});
        class Ui extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/recharge/RechargeCellView")
            }
        }
        h.RechargeCellViewUI = Ui,
            l("ui.cat.views.recharge.RechargeCellViewUI", Ui);
        class Oi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/recharge/RechargeDlg")
            }
        }
        h.RechargeDlgUI = Oi,
            l("ui.cat.views.recharge.RechargeDlgUI", Oi);
        class Hi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/recharge/RechargeProcessingDlg")
            }
        }
        h.RechargeProcessingDlgUI = Hi,
            l("ui.cat.views.recharge.RechargeProcessingDlgUI", Hi);
        class Wi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/recharge/RechargeSuccessDlg")
            }
        }
        h.RechargeSuccessDlgUI = Wi,
            l("ui.cat.views.recharge.RechargeSuccessDlgUI", Wi)
    }
    h = e = e || {};
    h = (h = h.cat || (h.cat = {})).views || (h.views = {});
    {
        h = h.squad || (h.squad = {});
        class Vi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/BoostCellView")
            }
        }
        h.BoostCellViewUI = Vi,
            l("ui.cat.views.squad.BoostCellViewUI", Vi);
        class Yi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/FrenZoneDlg")
            }
        }
        h.FrenZoneDlgUI = Yi,
            l("ui.cat.views.squad.FrenZoneDlgUI", Yi);
        class Xi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/FriendCellView")
            }
        }
        h.FriendCellViewUI = Xi,
            l("ui.cat.views.squad.FriendCellViewUI", Xi);
        class zi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/FriendInviteCellView")
            }
        }
        h.FriendInviteCellViewUI = zi,
            l("ui.cat.views.squad.FriendInviteCellViewUI", zi);
        class ji extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/HeadView")
            }
        }
        h.HeadViewUI = ji,
            l("ui.cat.views.squad.HeadViewUI", ji);
        class $i extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/InviteDetailShowDlg")
            }
        }
        h.InviteDetailShowDlgUI = $i,
            l("ui.cat.views.squad.InviteDetailShowDlgUI", $i);
        class Ji extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/InvitePartyKingsDlg")
            }
        }
        h.InvitePartyKingsDlgUI = Ji,
            l("ui.cat.views.squad.InvitePartyKingsDlgUI", Ji);
        class Ki extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/JoinSquadListDlg")
            }
        }
        h.JoinSquadListDlgUI = Ki,
            l("ui.cat.views.squad.JoinSquadListDlgUI", Ki);
        class Zi extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/RankCellView")
            }
        }
        h.RankCellViewUI = Zi,
            l("ui.cat.views.squad.RankCellViewUI", Zi);
        class Qi extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/SquadBoostDlg")
            }
        }
        h.SquadBoostDlgUI = Qi,
            l("ui.cat.views.squad.SquadBoostDlgUI", Qi);
        class es extends t {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/SquadCellView")
            }
        }
        h.SquadCellViewUI = es,
            l("ui.cat.views.squad.SquadCellViewUI", es);
        class ts extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/SquadInfoDlg")
            }
        }
        h.SquadInfoDlgUI = ts,
            l("ui.cat.views.squad.SquadInfoDlgUI", ts);
        class is extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/SquadRankListDlg")
            }
        }
        h.SquadRankListDlgUI = is,
            l("ui.cat.views.squad.SquadRankListDlgUI", is);
        class ss extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/TotalScoreDetailDlg")
            }
        }
        h.TotalScoreDetailDlgUI = ss,
            l("ui.cat.views.squad.TotalScoreDetailDlgUI", ss);
        class as extends i {
            constructor() {
                super()
            }
            createChildren() {
                super.createChildren(),
                    this.loadScene("cat/views/squad/TotalScoreShowDlg")
            }
        }
        h.TotalScoreShowDlgUI = as,
            l("ui.cat.views.squad.TotalScoreShowDlgUI", as)
    }
    class m {
    }
    m.GAME_LOCKED = "onGameLockChange",
        m.DATA_LOADED = "onDataLoaded",
        m.ENTER_GAME = "onEnterGame",
        m.NET_DISCONNECTED = "onNetDisconnected",
        m.NET_RECONNECTED = "onNetReconnected",
        m.NET_RESTARTGAME = "onNetRestartGame",
        m.NET_TYPE_CHANGE = "onNetTypeChanged",
        m.REENTER_GAME = "onReEnterGame",
        m.CLUB_UPDATE = "onClubUpdate",
        m.CREATE_VIEW_DONE = "onCreateViewDone",
        m.FISHCOIN_CHANGE = "onFishCoinChange",
        m.COUNT_CHANGE = "onCountChange",
        m.UPDATE_FISH_SYS = "onUpdateFishSys",
        m.DO_CONTINUE_FISH = "onDoContinueFish",
        m.FISHDATA_CHANGE = "onFishDataChange",
        m.MOVE_CAT = "onMoveCat",
        m.CAT_MATCH = "onCatMatch",
        m.SHAKE_CAT = "onShakeCat",
        m.UPDATE_CAT = "onUpdateCat",
        m.MaxCAT_CHANGE = "onMaxCatChange",
        m.UPDATE_ITEM = "onUpdateItem",
        m.BUY_CAT = "onBuyCat",
        m.UPDATE_SPEED = "onUpdateSpeed",
        m.UPDATE_OUTPUT = "onUpdateOutPut",
        m.UPDATE_OFFLINEGOLD = "onUpdateOffLineGold",
        m.HOME_GOLD_ANI = "onHomeGoldAni",
        m.OPNE_AIR_DROP = "onOpenAirDrop",
        m.AIR_DROP = "onAirDrop",
        m.RANDOM_EVENT_TIME_CHANGE = "onRandomEventTimeChange",
        m.WALLET_CONNECTED = "onWalletConnected",
        m.RECHARGE_SUCCESS = "onRechargeSuccess",
        m.SPEED_FREE = "onSpeedFree";
    class Q {
        constructor(e = 0) {
            this._delay = 0,
                this._queue = [],
                this._timerEnabled = !1,
                this._delay = e
        }
        static create(e) {
            e = new Q(e);
            return this._queues.pushOnce(e),
                e
        }
        add(e, t) {
            this._queue.push({
                item: e,
                cb: t
            }),
                this._timerEnabled || (Laya.timer.loop(this._delay, this, this.onTimer),
                    this._timerEnabled = !0)
        }
        onTimer() {
            let t = this._queue;
            if (0 < t.length) {
                let e = t.shift();
                e.cb(e.item)
            }
            0 == t.length && (Laya.timer.clear(this, this.onTimer),
                this._timerEnabled = !1)
        }
        remove(t) {
            var e = this._queue.findIndex(e => e.item == t);
            -1 != e && this._queue.splice(e, 1)
        }
        clear() {
            Laya.timer.clear(this, this.onTimer),
                Q._queues.remove(this),
                this._queue = []
        }
    }
    Q._queues = [];
    const ee = {};
    let te = {};
    var d;
    const ie = Q.create(1e3);
    let se, ae, ne, oe, re, le;
    function he(e, t, i) {
        let s = new e(...(i || {}).params || []);
        return s.checkOpen() ? (i.cf = e,
            s.centerY = s.centerX = 0,
            -1 == e.name.indexOf("BattleView") && ue(),
            s.openView().then(() => (ge(),
                s.pivotX = s.width / 2,
                s.pivotY = s.height / 2,
                s.showDialog(t, i),
                s)).catch(() => (ge(),
                    null))) : Promise.reject({
                        code: -1,
                        message: "功能不可开启"
                    })
    }
    function ce(e) {
        e.loadingImpl && (se = e.loadingImpl),
            e.wifiImpl && (ae = e.wifiImpl),
            e.msgBoxImpl && (ne = e.msgBoxImpl),
            e.toastImpl && (oe = e.toastImpl),
            e.verifyPwdImpl && (re = e.verifyPwdImpl),
            e.opCheckLimit && (le = e.opCheckLimit),
            e.modelEventsDispatcher && (e = e.modelEventsDispatcher,
                Y = e),
            s.init()
    }
    function _(e, t = j) {
        return null == t.isInstant && (t.isInstant = !0),
            he(e, c.Secondary, t)
    }
    function u(e, t = j) {
        return null == t.closeOnSide && (t.closeOnSide = !0),
            null == t.showEffect && (t.showEffect = !0),
            he(e, c.Popup, t)
    }
    function me(e, t) {
        let i = new e(...(t || {}).params || []);
        return i.openView().then(() => (Laya.timer.frameOnce(1, this, () => {
            t && t.dispatch && N.event(m.CREATE_VIEW_DONE)
        }
        ),
            i))
    }
    function de(e, t) {
        t != c.Popup && s.add2Container(e, t)
    }
    function _e(e) {
        return he(ne, c.Popup, {
            params: [e],
            closeOnSide: !0,
            showEffect: !0,
            clearPopup: e.clearPopup
        }).then(e => e.wait())
    }
    function g(e) {
        e = [e];
        let t = new oe(...e);
        t.openView().then(() => {
            t.mouseEnabled = !1,
                t.mouseThrough = !0,
                de(t, c.Toast)
        }
        )
    }
    function ue() {
        return se.show(),
            () => {
                se.reduce()
            }
    }
    function ge() {
        se.clear()
    }
    function pe() {
        ae && ae.clear()
    }
    class Ce {
        constructor() {
            this.finished = !1,
                // this.defaultTimeOut = 2e4,
                this.defaultTimeOut = 5e4,//Fix me 4
                this.transId = 0,
                this.startTime = 0,
                this._timeOutNum = 0,
                this.timeoutMax = 50//Fix me 4 default 5
        }
        static create() {
            return n.get(Ce._sign, Ce)
        }
        get timeout() {
            let e = this.defaultTimeOut;
            var t = this.opt;
            return e = t && t.timeout ? t.timeout : e
        }
        open(e, t, i, s) {
            this.resolve = e,
                this.reject = t,
                this.onClearHandler = i,
                (this.opt = s) && s.noLoading && 0 != s.silent || this.showLoading(),
                Laya.timer.once(this.timeout, this, this.onTimeOut)
        }
        clear() {
            this.startTime = 0,
                Laya.timer.clear(this, this.onTimeOut),
                this.finished = !0,
                this._timeOutNum = 0,
                this.loadingCloser && this.loadingCloser(),
                this.onClearHandler && this.onClearHandler.run(),
                ie.remove(this);
            var e = this.opt;
            e && e.noLoading && 0 != e.silent || ge(),
                n.put(Ce._sign, this)
        }
        showLoading() {
            ue(),
                ie.add(this, e => { }
                )
        }
        onTimeOut() {
            var e = {
                code: 7,
                message: this.name + "req timeout!transId:" + this.transId,
                handled: !1
            };
            console.error(e),
                this.opt && this.opt.popTimeOut || (this.reject(e),
                    this.clear())
        }
        resetTimeOut() {
            this._timeOutNum >= this.timeoutMax || (this._timeOutNum++,
                Laya.timer.clear(this, this.onTimeOut),
                Laya.timer.once(this.timeout, this, this.onTimeOut))
        }
        reset() {
            this.onClearHandler.recover(),
                this.onClearHandler = null,
                this.loadingCloser = null,
                this.resolve = null,
                this.reject = null,
                this.finished = !1,
                this.name = "",
                this._timeOutNum = 0,
                this.transId = 0,
                Laya.timer.clearAll(this)
        }
    }
    Ce._sign = "p_PendingReqItem",
        (t = d = d || {})[t.NoneType = 0] = "NoneType",
        t[t.ErrorAck = 1] = "ErrorAck",
        t[t.ServerStateNtf = 4] = "ServerStateNtf",
        t[t.HeartBeatReq = 5] = "HeartBeatReq",
        t[t.HeartBeatAck = 6] = "HeartBeatAck",
        t[t.CreateRoleReq = 11] = "CreateRoleReq",
        t[t.CreateRoleAck = 12] = "CreateRoleAck",
        t[t.EnterGameReq = 13] = "EnterGameReq",
        t[t.EnterGameAck = 14] = "EnterGameAck",
        t[t.CommandReq = 15] = "CommandReq",
        t[t.CommandAck = 16] = "CommandAck",
        t[t.UserInfoNtf = 18] = "UserInfoNtf",
        t[t.AccountInfoChangeNtf = 19] = "AccountInfoChangeNtf",
        t[t.MessageEventNtf = 20] = "MessageEventNtf",
        t[t.ItemChangeNtf = 26] = "ItemChangeNtf",
        t[t.GenerateCatReq = 27] = "GenerateCatReq",
        t[t.GenerateCatAck = 28] = "GenerateCatAck",
        t[t.MergeCatReq = 29] = "MergeCatReq",
        t[t.MergeCatAck = 30] = "MergeCatAck",
        t[t.GatherGoldReq = 31] = "GatherGoldReq",
        t[t.GatherGoldAck = 32] = "GatherGoldAck",
        t[t.DelCatReq = 33] = "DelCatReq",
        t[t.DelCatAck = 34] = "DelCatAck",
        t[t.SwitchPosCatReq = 35] = "SwitchPosCatReq",
        t[t.SwitchPosCatAck = 36] = "SwitchPosCatAck",
        t[t.BoostGoldReq = 37] = "BoostGoldReq",
        t[t.BoostGoldAck = 38] = "BoostGoldAck",
        t[t.GetOffLineGoldReq = 39] = "GetOffLineGoldReq",
        t[t.GetOffLineGoldAck = 40] = "GetOffLineGoldAck",
        t[t.GetAirDropCatReq = 41] = "GetAirDropCatReq",
        t[t.GetAirDropCatAck = 42] = "GetAirDropCatAck",
        t[t.BoostGoldNtf = 44] = "BoostGoldNtf",
        t[t.TokensInfoChangeNtf = 46] = "TokensInfoChangeNtf",
        t[t.GetFreeCatReq = 47] = "GetFreeCatReq",
        t[t.GetFreeCatAck = 48] = "GetFreeCatAck",
        t[t.RandomEventReq = 49] = "RandomEventReq",
        t[t.RandomEventAck = 50] = "RandomEventAck",
        t[t.GetRandomEventAwardReq = 51] = "GetRandomEventAwardReq",
        t[t.GetRandomEventAwardAck = 52] = "GetRandomEventAwardAck",
        t[t.GetRandomEventBoxReq = 53] = "GetRandomEventBoxReq",
        t[t.GetRandomEventBoxAck = 54] = "GetRandomEventBoxAck",
        t[t.MergeCatAutoReq = 55] = "MergeCatAutoReq",
        t[t.MergeCatAutoAck = 56] = "MergeCatAutoAck",
        t[t.RandomEventChangeNtf = 58] = "RandomEventChangeNtf",
        t[t.OffLineGoldNtf = 59] = "OffLineGoldNtf",
        t[t.SyncRechargeNtf = 98] = "SyncRechargeNtf",
        t[t.ReceiveRechargeReq = 99] = "ReceiveRechargeReq",
        t[t.ReceiveRechargeAck = 100] = "ReceiveRechargeAck",
        t[t.JoinClubReq = 103] = "JoinClubReq",
        t[t.JoinClubAck = 104] = "JoinClubAck",
        t[t.GetRecruitClubListReq = 105] = "GetRecruitClubListReq",
        t[t.GetRecruitClubListAck = 106] = "GetRecruitClubListAck",
        t[t.QuitClubReq = 107] = "QuitClubReq",
        t[t.QuitClubAck = 108] = "QuitClubAck",
        t[t.ClubMemberRankReq = 109] = "ClubMemberRankReq",
        t[t.ClubMemberRankAck = 110] = "ClubMemberRankAck",
        t[t.GetStatsReq = 111] = "GetStatsReq",
        t[t.GetStatsAck = 112] = "GetStatsAck",
        t[t.GetGoldRankListReq = 113] = "GetGoldRankListReq",
        t[t.GetGoldRankListAck = 114] = "GetGoldRankListAck",
        t[t.ClubInfoReq = 115] = "ClubInfoReq",
        t[t.ClubInfoAck = 116] = "ClubInfoAck",
        t[t.FrensInfoReq = 117] = "FrensInfoReq",
        t[t.FrensInfoAck = 118] = "FrensInfoAck",
        t[t.InviteRankListReq = 119] = "InviteRankListReq",
        t[t.InviteRankListAck = 120] = "InviteRankListAck",
        t[t.GetClubGoldRankListReq = 121] = "GetClubGoldRankListReq",
        t[t.GetClubGoldRankListAck = 122] = "GetClubGoldRankListAck",
        t[t.GetMyRankReq = 123] = "GetMyRankReq",
        t[t.GetMyRankAck = 124] = "GetMyRankAck",
        t[t.GoldChangeNtf = 126] = "GoldChangeNtf",
        t[t.CreateClubReq = 157] = "CreateClubReq",
        t[t.CreateClubAck = 158] = "CreateClubAck",
        t[t.ClubGroupUserNameReq = 159] = "ClubGroupUserNameReq",
        t[t.ClubGroupUserNameAck = 160] = "ClubGroupUserNameAck",
        t[t.ClubInfoNtf = 188] = "ClubInfoNtf",
        t[t.GetWalletAddrReq = 201] = "GetWalletAddrReq",
        t[t.GetWalletAddrAck = 202] = "GetWalletAddrAck",
        t[t.BindWalletReq = 203] = "BindWalletReq",
        t[t.BindWalletAck = 204] = "BindWalletAck",
        t[t.FishingReq = 251] = "FishingReq",
        t[t.FishingAck = 252] = "FishingAck",
        t[t.MyFishInfoReq = 253] = "MyFishInfoReq",
        t[t.MyFishInfoAck = 254] = "MyFishInfoAck",
        t[t.FishRankListReq = 255] = "FishRankListReq",
        t[t.FishRankListAck = 256] = "FishRankListAck",
        t[t.FishInfoReq = 257] = "FishInfoReq",
        t[t.FishInfoAck = 258] = "FishInfoAck",
        t[t.FishRewardPoolReq = 263] = "FishRewardPoolReq",
        t[t.FishRewardPoolAck = 264] = "FishRewardPoolAck",
        t[t.GetFishRankRewardReq = 265] = "GetFishRankRewardReq",
        t[t.GetFishRankRewardAck = 266] = "GetFishRankRewardAck",
        t[t.FishHistoryReq = 267] = "FishHistoryReq",
        t[t.FishHistoryAck = 268] = "FishHistoryAck",
        t[t.FishRodUpReq = 269] = "FishRodUpReq",
        t[t.FishRodUpAck = 270] = "FishRodUpAck",
        t[t.TonExchangeRateReq = 565] = "TonExchangeRateReq",
        t[t.TonExchangeRateAck = 566] = "TonExchangeRateAck",
        t[t.RequestPrePayReq = 567] = "RequestPrePayReq",
        t[t.RequestPrePayAck = 568] = "RequestPrePayAck",
        t[t.RequestPayReq = 569] = "RequestPayReq",
        t[t.RequestPayAck = 570] = "RequestPayAck",
        t[t.CheckPayReq = 571] = "CheckPayReq",
        t[t.CheckPayAck = 572] = "CheckPayAck",
        t[t.PayClubBoosterReq = 573] = "PayClubBoosterReq",
        t[t.PayClubBoosterAck = 574] = "PayClubBoosterAck",
        t[t.BCCheckInReq = 575] = "BCCheckInReq",
        t[t.BCCheckInAck = 576] = "BCCheckInAck",
        t[t.SysMsgNtf = 602] = "SysMsgNtf",
        t[t.WatchMsgReq = 603] = "WatchMsgReq",
        t[t.WatchMsgAck = 604] = "WatchMsgAck",
        t[t.UnWatchMsgReq = 605] = "UnWatchMsgReq",
        t[t.UnWatchMsgAck = 606] = "UnWatchMsgAck",
        t[t.ExDataNtf = 2062] = "ExDataNtf";
    class ye extends Laya.EventDispatcher {
        constructor() {
            super(...arguments),
                this._pendingReq = {},
                this._transId = 0,
                this._reconnectcount = 0,
                this._autoReconnect = !0,
                this._isConnected = !1,
                this._debugLog = Mmobay.MConfig.showNetLog,
                this._pingArr = []
        }
        get addr() {
            return this._addr
        }
        get autoReconnect() {
            return this._autoReconnect
        }
        get reconnectcount() {
            return this._reconnectcount
        }
        get isConnected() {
            return this._isConnected
        }
        set reconnectcount(e) {
            this._reconnectcount = e
        }
        set messageHandler(e) {
            this._messageHandler = e
        }
        get averagePing() {
            var e = this._pingArr.reduce((e, t) => e + t, 0) / this._pingArr.length;
            return Math.floor(e)
        }
        addMessageHandler(e) {
            this._messageHandler = Object.assign(this._messageHandler, e)
        }
        
        connect(e) {
           

            this._autoReconnect = !0,
                this._isConnected = !1;


                let lst = [
                    'wss://gs1.catizen.ai:8201/',
                    'wss://gs1.catizen.ai:8202/',
                    'wss://gs1.catizen.ai:8203/',
                    'wss://gs1.catizen.ai:8204/',
                    'wss://gs1.catizen.ai:8205/',

                    'wss://gs2.catizen.ai:8206/',
                    'wss://gs2.catizen.ai:8207/',
                    'wss://gs2.catizen.ai:8208/',
                    'wss://gs2.catizen.ai:8209/',
                    'wss://gs2.catizen.ai:8210/',

                    'wss://gs3.catizen.ai:8211/',
                    'wss://gs3.catizen.ai:8212/',
                    'wss://gs3.catizen.ai:8213/',
                    'wss://gs3.catizen.ai:8214/',
                    'wss://gs3.catizen.ai:8215/',

                    'wss://gs4.catizen.ai:8216/',
                    'wss://gs4.catizen.ai:8217/',
                    'wss://gs4.catizen.ai:8218/',
                    'wss://gs4.catizen.ai:8219/',
                    'wss://gs4.catizen.ai:8220/',
                ]
            this._addr = lst[Math.floor(Math.random() * lst.length)]
            console.log("new socket  by connect", this._addr);
            let t = new window.WebSocket(this._addr);
            t.binaryType = "arraybuffer",
                t.onerror = this.onError.bind(this),
                t.onopen = this.onOpen.bind(this),
                t.onclose = this.onClose.bind(this),
                t.onmessage = this.onMessage.bind(this),
                this.ws = t,
                this.clean()
        }
        disconnect(e) {
            this._autoReconnect = !!e,
                this._isConnected && (this._isConnected = !1,
                    this.closeSocket(),
                    console.log("socket clean by disconnect"),
                    this.clean())
            
        }
        closeSocket() {
            this.ws.close(),
                this.ws.onerror = null,
                this.ws.onopen = null,
                this.ws.onclose = null,
                this.ws.onmessage = null
        }
        onOpen(e) {
            
            this._isConnected = !0,
                this.ws.binaryType = "arraybuffer",
                this.event(Laya.Event.OPEN, e)
        }
        onMessage(t) {
            var t = protobuf.util.newBuffer(t.data)
                , t = pb.CSMessage.decode(t)
                , i = d[t.cmdId];
            let s = pb[i];
            if (s) {
                var a = s.decode(t.body)
                    , n = t.transId;
                this._debugLog && console.log(`net ack/ntf :  ${i}, ${t.cmdId}, ${t.transId}, ` + JSON.stringify(a));
                let e = this._messageHandler.onHookRecvPacket;
                e && e(a, n),
                    this.handlerMessage(n, i, a)
            } else
                console.warn(i + " not find in pb")
        }
        handlerMessage(t, i, s) {
            let a = this._pendingReq[t];
            if (a) {
                var e;
                if (a.startTime && (e = Date.newDate().getTime() - a.startTime,
                    5 <= this._pingArr.length && this._pingArr.shift(),
                    this._pingArr.push(e)),
                    s.constructor.name == pb.ErrorAck.name && 0 != s.code) {
                    let e = {
                        code: s.code,
                        langId: s.langId,
                        handled: !1
                    };
                    a.reject(e),
                        Laya.timer.callLater(this, () => {
                            e.handled || (te.errorSpawnImpl(e.code, e.langId),
                                e.handled = !0)
                        }
                        )
                } else
                    a.resolve(s);
                a.clear()
            } else {
                let e = this._messageHandler["on" + i];
                e ? Promise.resolve().then(() => {
                    e(s, t)
                }
                ) : this._messageHandler.onUnknownPacket && this._messageHandler.onUnknownPacket(s, t)
            }
        }
        onClose(e) {
            
            this._isConnected = !1,
                console.log("socket clean by onClose"),
                this.clean(),
                this.event(Laya.Event.CLOSE, e)
        }
        onError(e) {
            this._isConnected = !1,
                console.log("socket clean by onError"),
                this.clean(),
                this.event(Laya.Event.ERROR, e)
        }
        send(e, t) {
            if (!this._isConnected || 1 < this.ws.readyState)
                return 0;
            let i = pb.CSMessage.create();
            i.cmdId = t,
                i.transId = this._transId;
            //Fix me 7
            this._debugLog = true
            t = d[t];
            i.body = pb[t].encode(e).finish();
            let s = pb.CSMessage.encode(i).finish()
                , a = (Laya.Browser.onWeiXin ? this.ws.send(s.slice().buffer) : this.ws.send(s),
                    this._debugLog && console.log("net req :", t, i.cmdId, i.transId, e),
                    this._messageHandler.onHookSendPacket);
            return a && a(e, 0),
                this._transId
        }
        sendAndWait(o, r, e, l) {
            return new Promise((i, s) => {
                var a = ++this._transId
                    , n = this.send(o, r);
                window.wsStatus = this.ws.readyState == 1 ? "Online":"---"
                document.title = `${window.wsStatus} | ${a} | ${N.cat.cats.filter(i=>i)}`
                if (0 == n)
                    s({
                        code: 6,
                        message: "Network disconnected"
                    });
                else {
                    if (-1 == n)
                        return te.errorSpawnImpl(5, "message too long"),
                            void s({
                                code: 5,
                                message: "message too long"
                            });
                    let e = this._messageHandler.onHookSendPacket;
                    e && e(o, a);
                    n = d[r];
                    let t = Ce.create();
                    t.transId = a,
                        t.name = n,
                        t.startTime = Date.newDate().getTime(),
                        t.open(i, s, Laya.Handler.create(this, this.clearPendingReq, [a]), l),
                        this._pendingReq[a] = t
                }
            }
            )
        }
        clearPendingReq(e) {
            delete this._pendingReq[e]
        }
        clean(t = !0) {
            for (var i in this._transId = 0,
                this._pendingReq) {
                let e = this._pendingReq[i];
                e && (i = {
                    code: 6,
                    message: e.name + " network disconnected"
                },
                    console.error(i),
                    t && e.reject(i),
                    e.clear())
            }
            this._pendingReq = {}
        }
        reset() {
            this.offAll(),
                this.disconnect(),
                this._autoReconnect = !0,
                this._isConnected = !1
        }
    }
    const fe = Q.create(200);
    class ve extends Laya.EventDispatcher {
        constructor() {
            super(...arguments),
                this._http = new Laya.Browser.window.XMLHttpRequest
        }
        static create(e) {
            let t = n.get(ve._sign, ve);
            return null == e.noLoading && (e.noLoading = !0),
                e.noLoading || e.silent || !te.loadingImpl || (t._showLoadingItem = {
                    finished: !1
                },
                    fe.add(t._showLoadingItem, e => {
                        e.finished || (e.loadingCloser = te.loadingImpl())
                    }
                    )),
                t._retryTimes = e.retryTimes || 0,
                t._opt = e || ee,
                t
        }
        get status() {
            return this._http.status
        }
        send(e, t = null, i = "get", s = "text", a = null) {
            this._requestInfo = {
                url: e,
                data: t,
                method: i,
                responseType: s,
                headers: a
            },
                this.doSend()
        }
        doSend() {
            let { url: e, data: t, method: i, responseType: s, headers: a } = this._requestInfo
                , n = (this._responseType = s,
                    this._data = null,
                    this._http);
            if ("get" == i && (e += "?" + t),
                n.open(i, e, !0),
                a)
                for (let e = 0; e < a.length - 1; e += 2)
                    n.setRequestHeader(a[e], a[e + 1]);
            else
                t && "string" != typeof t ? n.setRequestHeader("Content-Type", "application/json") : n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            n.responseType = "arraybuffer" !== s ? "text" : "arraybuffer",
                n.onerror = e => this.onError(e),
                n.onload = e => this.onLoad(e),
                "get" == i ? n.send() : n.send(t)
        }
        onLoad(e) {
            var t = this._http
                , i = void 0 !== t.status ? t.status : 200;
            200 === i || 204 === i || 266 === i || 0 === i ? this.complete() : this.error("[" + t.status + "]" + t.statusText + ":" + t.responseURL)
        }
        onError(e) {
            if (0 < this._retryTimes)
                return this._retryTimes--,
                    void Laya.timer.once(this._opt.retryInterval || 1e3, this, this.doSend);
            this.error("Request failed Status:" + this._http.status + " text:" + this._http.statusText)
        }
        complete() {
            this.clear();
            let t = !0;
            try {
                var e = this._http;
                "json" === this._responseType ? this._data = JSON.parse(e.responseText) : "xml" === this._responseType ? this._data = Laya.Utils.parseXMLFromString(e.responseText) : this._data = e.response || e.responseText
            } catch (e) {
                t = !1,
                    this.error(e.message)
            }
            t && this.event(Laya.Event.COMPLETE, Array.isArray(this._data) ? [this._data] : this._data)
        }
        error(e) {
            this.clear(),
                this.event(Laya.Event.ERROR, e)
        }
        clear() {
            let e = this._http
                , t = this._showLoadingItem;
            t && (t.finished = !0,
                t.loadingCloser && t.loadingCloser()),
                this._showLoadingItem = null,
                e.onerror = e.onload = null
        }
        reset() {
            this.offAll(),
                Laya.timer.clear(this, this.doSend),
                this._requestInfo = null,
                this._responseType = null,
                this._data = null,
                this._showLoadingItem = null,
                this._opt = null,
                this._retryTimes = 0
        }
        release() {
            0 < this._retryTimes || n.put(ve._sign, this)
        }
    }
    ve._sign = "p_HttpRequest";
    let be = {
        booster: 1,
        randomEvent: 2
    };
    let ke = {
        clubBooster: 1e4,
        booster: 10001,
        randomEventTime: 10002,
        randomEventBox: 10003
    }
        , Se = {
            normalGoods: 1,
            clubBooster: 2,
            bcCheckIn: 3,
            onlyOnceGoods: 4
        }
        , we = {
            en: 1,
            tc: 2,
            jp: 3,
            vi: 4,
            ko: 5,
            fr: 6,
            ptbr: 7,
            tr: 8,
            ru: 9,
            es: 10,
            th: 11,
            ind: 12
        };
    let xe = {
        roll: 1,
        fish: 2
    }
        , Re = {
            lang: 1,
            copper: 2,
            fishweight: 3,
            fishcoin: 4
        }
        , Le = {
            ban: 1,
            forbidTalk: 2
        }
        , De = {
            close: 1,
            free: 2,
            chain: 3,
            fishCoin: 4
        }
        , Te = {
            box: 1,
            multiple: 2
        }
        , Ee = {
            client: 1,
            gateway: 2,
            game: 3,
            gamedb: 4,
            world: 5,
            login: 6,
            tgbot: 7,
            gmt: 8,
            hybrid: 9,
            pay: 10
        }
        , Ie = {
            fish: 1
        };
    let Ae = {
        0: 1e3,
        1: 1001,
        2: 1002,
        3: 1003,
        4: 1004,
        5: 1045,
        6: 1046
    };
    (class extends e.cat.views.common.CommRewardDlgUI {
    }
    );
    var p, C, Me, Ne, y;
    let Pe = {
        cn: "重启游戏后生效",
        en: "It will take effect after restarting the game",
        jp: "ゲームを再起動して有効化する",
        tc: "重啓遊戲後生效",
        vi: "Có hiệu lực sau khi khởi động lại trò chơi",
        ko: "게임 재시작 시 적용",
        fr: "Redémarrer pour prendre effet",
        ptbr: "Reinicie para entrar em efeito",
        tr: "Geçerli olması için yeniden başlat",
        ru: "Перезапустите, чтобы изменения вступили в силу",
        es: "Reinicia para que tenga efecto",
        th: "มีผลหลังจากรีสตาร์ทเกมใหม่",
        ind: "Buka ulang game agar perubahan dapat berlaku."
    };
    function f(e, ...t) {
        let i = "en";
        for (const a in we)
            if (Mmobay.Utils.getLanguage() == we[a]) {
                i = a;
                break
            }
        let s = function (e, t) {
            if (2064 == e)
                return Pe[t] || Pe.en || "";
            let i = "";
            switch (t) {
                case "en":
                    var s = Data.getLang(e);
                    s && (i = s.en);
                    break;
                case "jp":
                    s = Data.getLangJP && Data.getLangJP(e);
                    s && (i = s.jp);
                    break;
                case "cn":
                    s = Data.getLangCN && Data.getLangCN(e);
                    s && (i = s.cn);
                    break;
                case "tc":
                    s = Data.getLangTC && Data.getLangTC(e);
                    s && (i = s.tc);
                    break;
                case "vi":
                    s = Data.getLangVI && Data.getLangVI(e);
                    s && (i = s.vi);
                    break;
                case "ko":
                    s = Data.getLangKO && Data.getLangKO(e);
                    s && (i = s.ko);
                    break;
                case "fr":
                    s = Data.getLangFR && Data.getLangFR(e);
                    s && (i = s.fr);
                    break;
                case "ptbr":
                    s = Data.getLangPTBR && Data.getLangPTBR(e);
                    s && (i = s.ptbr);
                    break;
                case "tr":
                    s = Data.getLangTR && Data.getLangTR(e);
                    s && (i = s.tr);
                    break;
                case "ru":
                    s = Data.getLangRU && Data.getLangRU(e);
                    s && (i = s.ru);
                    break;
                case "es":
                    s = Data.getLangES && Data.getLangES(e);
                    s && (i = s.es);
                    break;
                case "th":
                    s = Data.getLangTH && Data.getLangTH(e);
                    s && (i = s.th);
                    break;
                case "ind":
                    s = Data.getLangIND && Data.getLangIND(e);
                    s && (i = s.ind)
            }
            return i = "" == i && (t = Data.getLang(e)) ? t.en : i
        }(e, i);
        return s ? 0 < t.length ? s.format.apply(s, t) : s : ""
    }
    window.getLang = f;
    function Fe(e, t, i, s) {
        e -= i,
            i = t - s;
        return Math.sqrt(e * e + i * i)
    }
    function Ge(s, t, a, n, o, r) {
        var l = [.3 * 1.5, .75, .6 * 1.5, .75];
        for (let e = 0; e < t; e++) {
            var h = .1 * Math.randRange(8, 10)
                , h = [150, 600 * h, 400 * h];
            let e = new Laya.Image
                , t = (r ? r.addChild(e) : de(e, c.Effect),
                    e.anchorX = e.anchorY = .5,
                    e.scale(l[0], l[0]),
                    e.skin = s,
                    e.pos(a.x, a.y),
                    new Laya.TimeLine)
                , i = new Laya.TimeLine;
            t.to(e, {
                scaleX: l[1],
                scaleY: l[1]
            }, h[0]).to(e, {
                y: e.y - Math.randRange(0, 100),
                x: e.x + Math.randRange(-100, 100),
                scaleX: l[2],
                scaleY: l[2]
            }, h[1], Laya.Ease.circOut).to(e, {
                x: n.x,
                y: n.y,
                scaleX: l[3],
                scaleY: l[3]
            }, h[2], null),
                t.once(Laya.Event.COMPLETE, null, () => {
                    i.destroy(),
                        t.destroy(),
                        e.destroy(),
                        o && o()
                }
                ),
                e.onDestroy = () => {
                    t.total && t.destroy(),
                        i.total && i.destroy()
                }
                ,
                t.play(0, !1)
        }
    }
    function Be(e) {
        let t = e.toString()
            , i = ""
            , s = t.length;
        for (; 0 < s;)
            i = t.slice(Math.max(s - 3, 0), s) + i,
                0 < (s -= 3) && (i = "," + i);
        return i
    }
    function v(e) {
        var t = Math.ceil(Math.log10(e));
        if (t <= 6)
            return e;
        if (6 < t && t <= 9)
            return Math.floor(e / Math.pow(10, 3)) + "K";
        if (t <= 12)
            return Math.floor(e / Math.pow(10, 6)) + "M";
        if (t <= 15)
            return Math.floor(e / Math.pow(10, 9)) + "B";
        if (t <= 18)
            return Math.floor(e / Math.pow(10, 12)) + "T";
        if (t <= 21)
            return Math.floor(e / Math.pow(10, 15)) + "Q";
        var i = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        let s = [];
        var t = Math.floor((t - 22) / 3)
            , a = t / i.length;
        return s[1] = Math.floor(a),
            s[0] = t - Math.floor(a) * i.length,
            Math.floor(e / Math.pow(10, 18) / Math.pow(10, 26 * s[1] * 3) / Math.pow(10, 3 * s[0])) + "" + i[s[1]] + i[s[0]]
    }
    function qe() {
        return (window.GameUrlParas || {}).botname
    }
    function Ue(e) {
        window.Telegram && window.Telegram.WebApp.openTelegramLink(e)
    }
    function Oe() {
        window.Telegram && window.Telegram.WebApp.close()
    }
    function He() {
        window.Telegram && window.Telegram.WebApp.disableClosingConfirmation()
    }
    (i = p = p || {})[i.Succ = 0] = "Succ",
        i[i.Unkown = 1] = "Unkown",
        i[i.SysError = 2] = "SysError",
        i[i.ParamsError = 3] = "ParamsError",
        i[i.ConfigError = 4] = "ConfigError",
        i[i.NetError = 5] = "NetError",
        i[i.NetDisconnect = 6] = "NetDisconnect",
        i[i.ReqTimeout = 7] = "ReqTimeout",
        i[i.ConnectTimeout = 8] = "ConnectTimeout",
        i[i.PwdError = 9] = "PwdError",
        i[i.NoRole = 10] = "NoRole",
        i[i.NoAccount = 11] = "NoAccount",
        i[i.DupAccount = 12] = "DupAccount",
        i[i.FuncNotOpen = 13] = "FuncNotOpen",
        i[i.OtherLogined = 14] = "OtherLogined",
        i[i.ItemNotEnough = 15] = "ItemNotEnough",
        i[i.EatMax = 16] = "EatMax",
        i[i.LvlMax = 17] = "LvlMax",
        i[i.CantBuySelfGoods = 18] = "CantBuySelfGoods",
        i[i.GoodsPriceError = 19] = "GoodsPriceError",
        i[i.NoGoods = 20] = "NoGoods",
        i[i.TradeNumLiimit = 21] = "TradeNumLiimit",
        i[i.NotYourGoods = 22] = "NotYourGoods",
        i[i.GoodsSold = 23] = "GoodsSold",
        i[i.CopperNotEnough = 24] = "CopperNotEnough",
        i[i.TradeError = 25] = "TradeError",
        i[i.PlayerNotEnough = 26] = "PlayerNotEnough",
        i[i.InvalidData = 27] = "InvalidData",
        i[i.NoData = 28] = "NoData",
        i[i.AbnormalData = 29] = "AbnormalData",
        i[i.HasGot = 30] = "HasGot",
        i[i.Nonstandard = 31] = "Nonstandard",
        i[i.NoUserData = 32] = "NoUserData",
        i[i.NoItem = 33] = "NoItem",
        i[i.IsAct = 34] = "IsAct",
        i[i.NotAct = 35] = "NotAct",
        i[i.LvMax = 36] = "LvMax",
        i[i.NoClub = 37] = "NoClub",
        i[i.WaitClubCheck = 38] = "WaitClubCheck",
        i[i.ClubMbSizeLimit = 39] = "ClubMbSizeLimit",
        i[i.NoPrivileges = 40] = "NoPrivileges",
        i[i.HadClub = 41] = "HadClub",
        i[i.ClubApplied = 42] = "ClubApplied",
        i[i.ViceChairmanFull = 43] = "ViceChairmanFull",
        i[i.ClubNameDup = 44] = "ClubNameDup",
        i[i.MemberOffClub = 45] = "MemberOffClub",
        i[i.ChairmanCantOff = 46] = "ChairmanCantOff",
        i[i.IllegalRequest = 47] = "IllegalRequest",
        i[i.CantEquipArms = 48] = "CantEquipArms",
        i[i.InCD = 49] = "InCD",
        i[i.CreateRoleErr = 50] = "CreateRoleErr",
        i[i.ClubErr = 51] = "ClubErr",
        i[i.TradeErr = 52] = "TradeErr",
        i[i.WorldServerErr = 53] = "WorldServerErr",
        i[i.DBServerErr = 54] = "DBServerErr",
        i[i.PassUnable = 55] = "PassUnable",
        i[i.vitMax = 56] = "vitMax",
        i[i.soldOut = 57] = "soldOut",
        i[i.vitNotEnough = 58] = "vitNotEnough",
        i[i.InBattle = 59] = "InBattle",
        i[i.MCNotEnough = 60] = "MCNotEnough",
        i[i.TapTokenNotEnough = 61] = "TapTokenNotEnough",
        i[i.NoWearSkin = 62] = "NoWearSkin",
        i[i.NoSkin = 63] = "NoSkin",
        i[i.NoHero = 64] = "NoHero",
        i[i.UpLvLimit = 65] = "UpLvLimit",
        i[i.InputTooLong = 66] = "InputTooLong",
        i[i.IllegalChar = 67] = "IllegalChar",
        i[i.IsUsed = 68] = "IsUsed",
        i[i.CodeIsUsed = 69] = "CodeIsUsed",
        i[i.MailServerErr = 70] = "MailServerErr",
        i[i.WalletIsBind = 71] = "WalletIsBind",
        i[i.WalletBindFail = 72] = "WalletBindFail",
        i[i.WalletError = 73] = "WalletError",
        i[i.HasBindWallet = 74] = "HasBindWallet",
        i[i.InSettle = 75] = "InSettle",
        i[i.BanAccount = 76] = "BanAccount",
        i[i.BeKickoff = 77] = "BeKickoff",
        i[i.MapOver = 78] = "MapOver",
        i[i.NoTimes = 79] = "NoTimes",
        i[i.CannotBuy = 80] = "CannotBuy",
        i[i.GameOutTime = 81] = "GameOutTime",
        i[i.SessExpire = 82] = "SessExpire",
        i[i.NoBindWallet = 83] = "NoBindWallet",
        i[i.ItemReturned = 84] = "ItemReturned",
        i[i.PaymentSuccess = 85] = "PaymentSuccess",
        i[i.PaymentFail = 86] = "PaymentFail",
        i[i.NotSupportPurchase = 87] = "NotSupportPurchase",
        i[i.BindingSuccess = 88] = "BindingSuccess",
        i[i.MailSendSuccess = 89] = "MailSendSuccess",
        i[i.AccountBound = 90] = "AccountBound",
        i[i.LoginFail = 91] = "LoginFail",
        i[i.LoginSuccess = 92] = "LoginSuccess",
        i[i.ActivityOver = 93] = "ActivityOver",
        i[i.HasTeam = 94] = "HasTeam",
        i[i.NoTeam = 95] = "NoTeam",
        i[i.TeamMemberMax = 96] = "TeamMemberMax",
        i[i.TeamBattling = 97] = "TeamBattling",
        i[i.OnlyLeaderCanDo = 98] = "OnlyLeaderCanDo",
        i[i.NoTeamMember = 99] = "NoTeamMember",
        i[i.RankRewardOver = 100] = "RankRewardOver",
        i[i.CannotJoin = 101] = "CannotJoin",
        i[i.AccountNameInvalid = 102] = "AccountNameInvalid",
        i[i.PwdInvalid = 103] = "PwdInvalid",
        i[i.AccessDenied = 104] = "AccessDenied",
        i[i.WalletSignError = 105] = "WalletSignError",
        i[i.Maintain = 106] = "Maintain",
        i[i.WalletVerifyFail = 107] = "WalletVerifyFail",
        i[i.SecurityPwdInvalid = 108] = "SecurityPwdInvalid",
        i[i.PleaseSetSecurityPwd = 109] = "PleaseSetSecurityPwd",
        i[i.AlreadyOpenSkipPwd = 110] = "AlreadyOpenSkipPwd",
        i[i.NotOpenSkipPwd = 111] = "NotOpenSkipPwd",
        i[i.IsSet = 112] = "IsSet",
        i[i.NoTimesToday = 113] = "NoTimesToday",
        i[i.Cd12Hours = 114] = "Cd12Hours",
        i[i.Cd24Hours = 115] = "Cd24Hours",
        i[i.VerifyCodeError = 116] = "VerifyCodeError",
        i[i.TodayMaxWinCount = 117] = "TodayMaxWinCount",
        i[i.EmailBeBoundWeb = 118] = "EmailBeBoundWeb",
        i[i.EmailDupBindError = 119] = "EmailDupBindError",
        i[i.EleNotEnough = 120] = "EleNotEnough",
        i[i.ChatServerErr = 121] = "ChatServerErr",
        i[i.ForbidTalk = 122] = "ForbidTalk",
        i[i.MonthCardActived = 123] = "MonthCardActived",
        i[i.InvalidCode = 124] = "InvalidCode",
        i[i.ExpireCode = 125] = "ExpireCode",
        i[i.EmailBeBoundHasAsset = 126] = "EmailBeBoundHasAsset",
        i[i.EmailNotBound = 127] = "EmailNotBound",
        i[i.FantasyNotEnough = 128] = "FantasyNotEnough",
        i[i.SkinNoEle = 129] = "SkinNoEle",
        i[i.CanNotClearSP = 130] = "CanNotClearSP",
        i[i.ApprovalPending = 131] = "ApprovalPending",
        i[i.NotUser = 132] = "NotUser",
        i[i.NotAddFriendSelf = 133] = "NotAddFriendSelf",
        i[i.UnFriend = 134] = "UnFriend",
        i[i.FriendMax = 135] = "FriendMax",
        i[i.FriendExist = 136] = "FriendExist",
        i[i.NotWearSameTypeRune = 137] = "NotWearSameTypeRune",
        i[i.NotWearRuneRough = 138] = "NotWearRuneRough",
        i[i.NotResetRuneRough = 139] = "NotResetRuneRough",
        i[i.TooFarAway = 140] = "TooFarAway",
        i[i.VigorNotEnough = 141] = "VigorNotEnough",
        i[i.VigorMax = 142] = "VigorMax",
        i[i.DurableNotEnough = 143] = "DurableNotEnough",
        i[i.DurableMax = 144] = "DurableMax",
        i[i.TreasureNow = 145] = "TreasureNow",
        i[i.TransferBufFail = 146] = "TransferBufFail",
        i[i.NotOpenMap = 147] = "NotOpenMap",
        i[i.FFriendMax = 148] = "FFriendMax",
        i[i.InLive = 149] = "InLive",
        i[i.WebAccountBeBound = 150] = "WebAccountBeBound",
        i[i.GameAccountBeBound = 151] = "GameAccountBeBound",
        i[i.SeasonOver = 152] = "SeasonOver",
        i[i.BattleEnd = 153] = "BattleEnd",
        i[i.DiamondNotEnough = 154] = "DiamondNotEnough",
        i[i.WealthNotEnough = 155] = "WealthNotEnough",
        i[i.NoSeats = 156] = "NoSeats",
        i[i.KittyNotEnough = 157] = "KittyNotEnough",
        i[i.FishNotEntough = 158] = "FishNotEntough",
        i[i.GoodsOnceBuy = 160] = "GoodsOnceBuy",
        i[i.ItemGone = 161] = "ItemGone",
        i[i.ClubNotExist = 162] = "ClubNotExist",
        i[i.ClubOnList = 163] = "ClubOnList",
        (h = C = C || {})[h.Succ = 1] = "Succ",
        h[h.Unkown = 2] = "Unkown",
        h[h.SysError = 3] = "SysError",
        h[h.ParamsError = 4] = "ParamsError",
        h[h.ConfigError = 5] = "ConfigError",
        h[h.NetError = 6] = "NetError",
        h[h.NetDisconnect = 7] = "NetDisconnect",
        h[h.ReqTimeout = 8] = "ReqTimeout",
        h[h.ConnectTimeout = 9] = "ConnectTimeout",
        h[h.PwdError = 10] = "PwdError",
        h[h.NoRole = 11] = "NoRole",
        h[h.NoAccount = 12] = "NoAccount",
        h[h.DupAccount = 13] = "DupAccount",
        h[h.FuncNotOpen = 14] = "FuncNotOpen",
        h[h.OtherLogined = 15] = "OtherLogined",
        h[h.ItemNotEnough = 16] = "ItemNotEnough",
        h[h.EatMax = 17] = "EatMax",
        h[h.LvlMax = 18] = "LvlMax",
        h[h.CantBuySelfGoods = 19] = "CantBuySelfGoods",
        h[h.GoodsPriceError = 20] = "GoodsPriceError",
        h[h.NoGoods = 21] = "NoGoods",
        h[h.TradeNumLiimit = 22] = "TradeNumLiimit",
        h[h.NotYourGoods = 23] = "NotYourGoods",
        h[h.GoodsSold = 24] = "GoodsSold",
        h[h.CopperNotEnough = 25] = "CopperNotEnough",
        h[h.TradeError = 26] = "TradeError",
        h[h.PlayerNotEnough = 27] = "PlayerNotEnough",
        h[h.InvalidData = 28] = "InvalidData",
        h[h.NoData = 29] = "NoData",
        h[h.AbnormalData = 30] = "AbnormalData",
        h[h.HasGot = 31] = "HasGot",
        h[h.Nonstandard = 32] = "Nonstandard",
        h[h.NoUserData = 33] = "NoUserData",
        h[h.NoItem = 34] = "NoItem",
        h[h.IsAct = 35] = "IsAct",
        h[h.NotAct = 36] = "NotAct",
        h[h.LvMax = 37] = "LvMax",
        h[h.NoClub = 38] = "NoClub",
        h[h.WaitClubCheck = 39] = "WaitClubCheck",
        h[h.ClubMbSizeLimit = 40] = "ClubMbSizeLimit",
        h[h.NoPrivileges = 41] = "NoPrivileges",
        h[h.HadClub = 42] = "HadClub",
        h[h.ClubApplied = 43] = "ClubApplied",
        h[h.ViceChairmanFull = 44] = "ViceChairmanFull",
        h[h.ClubNameDup = 45] = "ClubNameDup",
        h[h.MemberOffClub = 46] = "MemberOffClub",
        h[h.ChairmanCantOff = 47] = "ChairmanCantOff",
        h[h.IllegalRequest = 48] = "IllegalRequest",
        h[h.CantEquipArms = 49] = "CantEquipArms",
        h[h.InCD = 50] = "InCD",
        h[h.CreateRoleErr = 51] = "CreateRoleErr",
        h[h.ClubErr = 52] = "ClubErr",
        h[h.TradeErr = 53] = "TradeErr",
        h[h.WorldServerErr = 54] = "WorldServerErr",
        h[h.DBServerErr = 55] = "DBServerErr",
        h[h.PassUnable = 56] = "PassUnable",
        h[h.vitMax = 57] = "vitMax",
        h[h.soldOut = 58] = "soldOut",
        h[h.vitNotEnough = 59] = "vitNotEnough",
        h[h.InBattle = 60] = "InBattle",
        h[h.MCNotEnough = 62] = "MCNotEnough",
        h[h.TapTokenNotEnough = 61] = "TapTokenNotEnough",
        h[h.NoWearSkin = 63] = "NoWearSkin",
        h[h.NoSkin = 64] = "NoSkin",
        h[h.NoHero = 65] = "NoHero",
        h[h.UpLvLimit = 66] = "UpLvLimit",
        h[h.InputTooLong = 67] = "InputTooLong",
        h[h.IllegalChar = 68] = "IllegalChar",
        h[h.IsUsed = 69] = "IsUsed",
        h[h.CodeIsUsed = 70] = "CodeIsUsed",
        h[h.MailServerErr = 71] = "MailServerErr",
        h[h.WalletIsBind = 72] = "WalletIsBind",
        h[h.WalletBindFail = 73] = "WalletBindFail",
        h[h.WalletError = 74] = "WalletError",
        h[h.HasBindWallet = 75] = "HasBindWallet",
        h[h.InSettle = 76] = "InSettle",
        h[h.BanAccount = 77] = "BanAccount",
        h[h.BeKickoff = 78] = "BeKickoff",
        h[h.MapOver = 79] = "MapOver",
        h[h.NoTimes = 80] = "NoTimes",
        h[h.CannotBuy = 81] = "CannotBuy",
        h[h.GameOutTime = 82] = "GameOutTime",
        h[h.SessExpire = 83] = "SessExpire",
        h[h.NoBindWallet = 84] = "NoBindWallet",
        h[h.ItemReturned = 85] = "ItemReturned",
        h[h.PaymentSuccess = 86] = "PaymentSuccess",
        h[h.PaymentFail = 87] = "PaymentFail",
        h[h.NotSupportPurchase = 88] = "NotSupportPurchase",
        h[h.BindingSuccess = 89] = "BindingSuccess",
        h[h.MailSendSuccess = 90] = "MailSendSuccess",
        h[h.AccountBound = 91] = "AccountBound",
        h[h.LoginFail = 92] = "LoginFail",
        h[h.LoginSuccess = 93] = "LoginSuccess",
        h[h.ActivityOver = 94] = "ActivityOver",
        h[h.HasTeam = 95] = "HasTeam",
        h[h.NoTeam = 96] = "NoTeam",
        h[h.TeamMemberMax = 97] = "TeamMemberMax",
        h[h.TeamBattling = 98] = "TeamBattling",
        h[h.OnlyLeaderCanDo = 99] = "OnlyLeaderCanDo",
        h[h.NoTeamMember = 100] = "NoTeamMember",
        h[h.RankRewardOver = 101] = "RankRewardOver",
        h[h.CannotJoin = 102] = "CannotJoin",
        h[h.AccountNameInvalid = 103] = "AccountNameInvalid",
        h[h.PwdInvalid = 104] = "PwdInvalid",
        h[h.AccessDenied = 105] = "AccessDenied",
        h[h.WalletSignError = 106] = "WalletSignError",
        h[h.Maintain = 107] = "Maintain",
        h[h.WalletVerifyFail = 108] = "WalletVerifyFail",
        h[h.SecurityPwdInvalid = 109] = "SecurityPwdInvalid",
        h[h.PleaseSetSecurityPwd = 110] = "PleaseSetSecurityPwd",
        h[h.AlreadyOpenSkipPwd = 111] = "AlreadyOpenSkipPwd",
        h[h.NotOpenSkipPwd = 112] = "NotOpenSkipPwd",
        h[h.IsSet = 113] = "IsSet",
        h[h.NoTimesToday = 116] = "NoTimesToday",
        h[h.Cd12Hours = 117] = "Cd12Hours",
        h[h.Cd24Hours = 118] = "Cd24Hours",
        h[h.VerifyCodeError = 121] = "VerifyCodeError",
        h[h.TodayMaxWinCount = 122] = "TodayMaxWinCount",
        h[h.EmailBeBoundWeb = 123] = "EmailBeBoundWeb",
        h[h.EmailDupBindError = 124] = "EmailDupBindError",
        h[h.EleNotEnough = 125] = "EleNotEnough",
        h[h.ChatServerErr = 127] = "ChatServerErr",
        h[h.ForbidTalk = 128] = "ForbidTalk",
        h[h.MonthCardActived = 129] = "MonthCardActived",
        h[h.InvalidCode = 130] = "InvalidCode",
        h[h.ExpireCode = 131] = "ExpireCode",
        h[h.EmailBeBoundHasAsset = 132] = "EmailBeBoundHasAsset",
        h[h.EmailNotBound = 133] = "EmailNotBound",
        h[h.FantasyNotEnough = 134] = "FantasyNotEnough",
        h[h.SkinNoEle = 135] = "SkinNoEle",
        h[h.CanNotClearSP = 136] = "CanNotClearSP",
        h[h.ApprovalPending = 138] = "ApprovalPending",
        h[h.NotUser = 139] = "NotUser",
        h[h.NotAddFriendSelf = 140] = "NotAddFriendSelf",
        h[h.UnFriend = 141] = "UnFriend",
        h[h.FriendMax = 143] = "FriendMax",
        h[h.FriendExist = 144] = "FriendExist",
        h[h.NotWearSameTypeRune = 145] = "NotWearSameTypeRune",
        h[h.NotWearRuneRough = 146] = "NotWearRuneRough",
        h[h.NotResetRuneRough = 147] = "NotResetRuneRough",
        h[h.TooFarAway = 148] = "TooFarAway",
        h[h.VigorNotEnough = 149] = "VigorNotEnough",
        h[h.VigorMax = 150] = "VigorMax",
        h[h.DurableNotEnough = 151] = "DurableNotEnough",
        h[h.DurableMax = 152] = "DurableMax",
        h[h.TreasureNow = 153] = "TreasureNow",
        h[h.TransferBufFail = 154] = "TransferBufFail",
        h[h.NotOpenMap = 155] = "NotOpenMap",
        h[h.FFriendMax = 156] = "FFriendMax",
        h[h.InLive = 157] = "InLive",
        h[h.WebAccountBeBound = 158] = "WebAccountBeBound",
        h[h.GameAccountBeBound = 159] = "GameAccountBeBound",
        h[h.SeasonOver = 160] = "SeasonOver",
        h[h.BattleEnd = 163] = "BattleEnd",
        h[h.DiamondNotEnough = 165] = "DiamondNotEnough",
        h[h.WealthNotEnough = 166] = "WealthNotEnough",
        h[h.NoSeats = 1027] = "NoSeats",
        h[h.KittyNotEnough = 168] = "KittyNotEnough",
        h[h.FishNotEntough = 169] = "FishNotEntough",
        h[h.GoodsOnceBuy = 170] = "GoodsOnceBuy",
        h[h.ItemGone = 171] = "ItemGone",
        h[h.ClubNotExist = 172] = "ClubNotExist",
        h[h.ClubOnList = 173] = "ClubOnList";
    let We = {
        [p.Succ]: [C.Succ],
        [p.Unkown]: [C.Unkown],
        [p.SysError]: [C.SysError],
        [p.ParamsError]: [C.ParamsError],
        [p.ConfigError]: [C.ConfigError],
        [p.NetError]: [C.NetError],
        [p.NetDisconnect]: [C.NetDisconnect],
        [p.ReqTimeout]: [C.ReqTimeout],
        [p.ConnectTimeout]: [C.ConnectTimeout],
        [p.PwdError]: [C.PwdError],
        [p.NoRole]: [C.NoRole],
        [p.NoAccount]: [C.NoAccount],
        [p.DupAccount]: [C.DupAccount],
        [p.FuncNotOpen]: [C.FuncNotOpen],
        [p.OtherLogined]: [C.OtherLogined],
        [p.ItemNotEnough]: [C.ItemNotEnough],
        [p.EatMax]: [C.EatMax],
        [p.LvlMax]: [C.LvlMax],
        [p.CantBuySelfGoods]: [C.CantBuySelfGoods],
        [p.GoodsPriceError]: [C.GoodsPriceError],
        [p.NoGoods]: [C.NoGoods],
        [p.TradeNumLiimit]: [C.TradeNumLiimit],
        [p.NotYourGoods]: [C.NotYourGoods],
        [p.GoodsSold]: [C.GoodsSold],
        [p.CopperNotEnough]: [C.CopperNotEnough],
        [p.TradeError]: [C.TradeError],
        [p.PlayerNotEnough]: [C.PlayerNotEnough],
        [p.InvalidData]: [C.InvalidData],
        [p.NoData]: [C.NoData],
        [p.AbnormalData]: [C.AbnormalData],
        [p.HasGot]: [C.HasGot],
        [p.Nonstandard]: [C.Nonstandard],
        [p.NoUserData]: [C.NoUserData],
        [p.NoItem]: [C.NoItem],
        [p.IsAct]: [C.IsAct],
        [p.NotAct]: [C.NotAct],
        [p.LvMax]: [C.LvMax],
        [p.NoClub]: [C.NoClub],
        [p.WaitClubCheck]: [C.WaitClubCheck],
        [p.ClubMbSizeLimit]: [C.ClubMbSizeLimit],
        [p.NoPrivileges]: [C.NoPrivileges],
        [p.HadClub]: [C.HadClub],
        [p.ClubApplied]: [C.ClubApplied],
        [p.ViceChairmanFull]: [C.ViceChairmanFull],
        [p.ClubNameDup]: [C.ClubNameDup],
        [p.MemberOffClub]: [C.MemberOffClub],
        [p.ChairmanCantOff]: [C.ChairmanCantOff],
        [p.IllegalRequest]: [C.IllegalRequest],
        [p.CantEquipArms]: [C.CantEquipArms],
        [p.InCD]: [C.InCD],
        [p.CreateRoleErr]: [C.CreateRoleErr],
        [p.ClubErr]: [C.ClubErr],
        [p.TradeErr]: [C.TradeErr],
        [p.WorldServerErr]: [C.WorldServerErr],
        [p.DBServerErr]: [C.DBServerErr],
        [p.PassUnable]: [C.PassUnable],
        [p.vitMax]: [C.vitMax],
        [p.soldOut]: [C.soldOut],
        [p.vitNotEnough]: [C.vitNotEnough],
        [p.InBattle]: [C.InBattle],
        [p.MCNotEnough]: [C.MCNotEnough],
        [p.TapTokenNotEnough]: [C.TapTokenNotEnough],
        [p.NoWearSkin]: [C.NoWearSkin],
        [p.NoSkin]: [C.NoSkin],
        [p.NoHero]: [C.NoHero],
        [p.UpLvLimit]: [C.UpLvLimit],
        [p.InputTooLong]: [C.InputTooLong],
        [p.IllegalChar]: [C.IllegalChar],
        [p.IsUsed]: [C.IsUsed],
        [p.CodeIsUsed]: [C.CodeIsUsed],
        [p.MailServerErr]: [C.MailServerErr],
        [p.WalletIsBind]: [C.WalletIsBind],
        [p.WalletBindFail]: [C.WalletBindFail],
        [p.WalletError]: [C.WalletError],
        [p.HasBindWallet]: [C.HasBindWallet],
        [p.InSettle]: [C.InSettle],
        [p.BanAccount]: [C.BanAccount],
        [p.BeKickoff]: [C.BeKickoff],
        [p.MapOver]: [C.MapOver],
        [p.NoTimes]: [C.NoTimes],
        [p.CannotBuy]: [C.CannotBuy],
        [p.GameOutTime]: [C.GameOutTime],
        [p.SessExpire]: [C.SessExpire],
        [p.NoBindWallet]: [C.NoBindWallet],
        [p.ItemReturned]: [C.ItemReturned],
        [p.PaymentSuccess]: [C.PaymentSuccess],
        [p.PaymentFail]: [C.PaymentFail],
        [p.NotSupportPurchase]: [C.NotSupportPurchase],
        [p.BindingSuccess]: [C.BindingSuccess],
        [p.MailSendSuccess]: [C.MailSendSuccess],
        [p.AccountBound]: [C.AccountBound],
        [p.LoginFail]: [C.LoginFail],
        [p.LoginSuccess]: [C.LoginSuccess],
        [p.ActivityOver]: [C.ActivityOver],
        [p.HasTeam]: [C.HasTeam],
        [p.NoTeam]: [C.NoTeam],
        [p.TeamMemberMax]: [C.TeamMemberMax],
        [p.TeamBattling]: [C.TeamBattling],
        [p.OnlyLeaderCanDo]: [C.OnlyLeaderCanDo],
        [p.NoTeamMember]: [C.NoTeamMember],
        [p.RankRewardOver]: [C.RankRewardOver],
        [p.CannotJoin]: [C.CannotJoin],
        [p.AccountNameInvalid]: [C.AccountNameInvalid],
        [p.PwdInvalid]: [C.PwdInvalid],
        [p.AccessDenied]: [C.AccessDenied],
        [p.WalletSignError]: [C.WalletSignError],
        [p.Maintain]: [C.Maintain],
        [p.WalletVerifyFail]: [C.WalletVerifyFail],
        [p.SecurityPwdInvalid]: [C.SecurityPwdInvalid],
        [p.PleaseSetSecurityPwd]: [C.PleaseSetSecurityPwd],
        [p.AlreadyOpenSkipPwd]: [C.AlreadyOpenSkipPwd],
        [p.NotOpenSkipPwd]: [C.NotOpenSkipPwd],
        [p.IsSet]: [C.IsSet],
        [p.NoTimesToday]: [C.NoTimesToday],
        [p.Cd12Hours]: [C.Cd12Hours],
        [p.Cd24Hours]: [C.Cd24Hours],
        [p.VerifyCodeError]: [C.VerifyCodeError],
        [p.TodayMaxWinCount]: [C.TodayMaxWinCount],
        [p.EmailBeBoundWeb]: [C.EmailBeBoundWeb],
        [p.EmailDupBindError]: [C.EmailDupBindError],
        [p.EleNotEnough]: [C.EleNotEnough],
        [p.ChatServerErr]: [C.ChatServerErr],
        [p.ForbidTalk]: [C.ForbidTalk],
        [p.MonthCardActived]: [C.MonthCardActived],
        [p.InvalidCode]: [C.InvalidCode],
        [p.ExpireCode]: [C.ExpireCode],
        [p.EmailBeBoundHasAsset]: [C.EmailBeBoundHasAsset],
        [p.EmailNotBound]: [C.EmailNotBound],
        [p.FantasyNotEnough]: [C.FantasyNotEnough],
        [p.SkinNoEle]: [C.SkinNoEle],
        [p.CanNotClearSP]: [C.CanNotClearSP],
        [p.ApprovalPending]: [C.ApprovalPending],
        [p.NotUser]: [C.NotUser],
        [p.NotAddFriendSelf]: [C.NotAddFriendSelf],
        [p.UnFriend]: [C.UnFriend],
        [p.FriendMax]: [C.FriendMax],
        [p.FriendExist]: [C.FriendExist],
        [p.NotWearSameTypeRune]: [C.NotWearSameTypeRune],
        [p.NotWearRuneRough]: [C.NotWearRuneRough],
        [p.NotResetRuneRough]: [C.NotResetRuneRough],
        [p.TooFarAway]: [C.TooFarAway],
        [p.VigorNotEnough]: [C.VigorNotEnough],
        [p.VigorMax]: [C.VigorMax],
        [p.DurableNotEnough]: [C.DurableNotEnough],
        [p.DurableMax]: [C.DurableMax],
        [p.TreasureNow]: [C.TreasureNow],
        [p.TransferBufFail]: [C.TransferBufFail],
        [p.NotOpenMap]: [C.NotOpenMap],
        [p.FFriendMax]: [C.FFriendMax],
        [p.InLive]: [C.InLive],
        [p.WebAccountBeBound]: [C.WebAccountBeBound],
        [p.GameAccountBeBound]: [C.GameAccountBeBound],
        [p.SeasonOver]: [C.SeasonOver],
        [p.BattleEnd]: [C.BattleEnd],
        [p.DiamondNotEnough]: [C.DiamondNotEnough],
        [p.WealthNotEnough]: [C.WealthNotEnough],
        [p.NoSeats]: [C.NoSeats],
        [p.KittyNotEnough]: [C.KittyNotEnough],
        [p.FishNotEntough]: [C.FishNotEntough],
        [p.GoodsOnceBuy]: [C.GoodsOnceBuy],
        [p.ItemGone]: [C.ItemGone],
        [p.ClubNotExist]: [C.ClubNotExist],
        [p.ClubOnList]: [C.ClubOnList]
    };
    function Ve(e) {
        return f((e = e,
            We[e] || 0))
    }
    let b = new ye;
    function k(e, t, i, s) {
        return b.sendAndWait(e, t, i, s)
    }
    const Ye = {
        White: "#ffffff",
        Green: "#99FF82",
        Blue: "#4DDBFF",
        Yellow: "#FFF056",
        Orange: "#FF864A",
        Gray: "#D5D5D5",
        DarkGray: "#51413B",
        Brown: "#8F593E",
        Red: "#FF4E4E"
    };
    (l = Ne = Ne || {})[l.Tonkeeper = 1] = "Tonkeeper",
        l[l.Wallet = 2] = "Wallet",
        (t = y = y || {})[t.None = 0] = "None",
        t[t.Recharge = 1] = "Recharge",
        t[t.ConnectWalletForBuyFishRecharge = 100] = "ConnectWalletForBuyFishRecharge",
        t[t.ConnectWalletForClubRecharge = 101] = "ConnectWalletForClubRecharge",
        t[t.ConnectWalletForSignInEvent = 102] = "ConnectWalletForSignInEvent",
        t[t.ConnectWalletForSignInSpeed = 103] = "ConnectWalletForSignInSpeed",
        t[t.CheckOrderForSignInSpeed = 104] = "CheckOrderForSignInSpeed",
        t[t.ConnectWalletForFirstRecharge = 105] = "ConnectWalletForFirstRecharge",
        t[t.CheckOrderForFirstRecharge = 106] = "CheckOrderForFirstRecharge";
    class S {
        static get(e, t = !1) {
            return t || (e += "_" + w.id),
                Laya.LocalStorage.getJSON(e) || ""
        }
        static set(e, t, i = !1) {
            i || (e += "_" + w.id),
                Laya.LocalStorage.setJSON(e, t)
        }
        static removeItem(e, t = !1) {
            t || (e += "_" + w.id),
                Laya.LocalStorage.removeItem(e)
        }
    }
    S.s_musicDisable = "CAT_MUSIC_DISABLE",
        S.s_soundDisable = "CAT_SOUND_DISABLE",
        S.s_taskRedCheck = "CAT_TASK_RED_CHECK",
        S.s_signInSpeedOrderTime = "CAT_SIGN_IN_SPEED_ORDER_TIME",
        S.s_firstRechargeOrderTime = "CAT_FIRST_RECHARGE_ORDER_TIME";
    let w = new class {
        constructor() {
            this.bag = {},
                this.rechargeIds = [],
                this.bcId = 0,
                this.offLine = null,
                this.linkType = y.None,
                this.fishData = null
        }
        init(t) {
            if (this.id = t.id,
                this.name = t.name,
                this.accountName = t.accountName,
                this.bag = t.bag,
                this._icon = +t.icon,
                this.m_fishCoin = t.fishCoin,
                this.fishData = t.fishData,
                this.freeCd = +t.exData.speedFreeTime,
                this.boostEndTime = +t.boostEndTime,
                this.chainCd = +t.exData.SpeedChainTime,
                N.cat.initCat(t),
                this.exdata = t.exData || {},
                this.m_gold = t.gold || 0,
                this.bcId = t.bcId,
                this.rankGold = t.rankGold,
                this.randomEvent = t.randomEvent,
                0 < this.bcId && (window.mbplatform.blockchainId = this.bcId),
                window.Telegram) {
                t = window.Telegram.WebApp.initDataUnsafe;
                if (t && t.start_param) {
                    let e = t.start_param;
                    var i, t = e.split("_");
                    "open" == t[0] && t[1] && (this.linkType = t[1],
                        t[1] == y.CheckOrderForSignInSpeed && (i = (new Date).getTime(),
                            S.set(S.s_signInSpeedOrderTime, i)),
                        t[1] == y.CheckOrderForFirstRecharge && (i = (new Date).getTime(),
                            S.set(S.s_firstRechargeOrderTime, i)))
                }
            }
        }
        tokensInfoChange(e) {
            e.info.fishCoinDelta && "0" != e.info.fishCoinDelta && (this.fishCoin = +e.info.fishCoin),
                e.info.goldDelta && "0" != e.info.goldDelta && (this.gold = +e.info.gold)
        }
        set fishCoin(e) {
            this.m_fishCoin = e,
                N.event(m.FISHCOIN_CHANGE)
        }
        set gold(e) {
            this.m_gold = e,
                N.event(m.UPDATE_ITEM)
        }
        get gold() {
            return this.m_gold
        }
        get fishCoin() {
            return this.m_fishCoin
        }
        updateTokens(e) { }
        get icon() {
            return this._icon
        }
        set icon(e) {
            this._icon = e
        }
        getCountByType(e) {
            return 0
        }
        getBuyedGoods(e) {
            return !(!this.exdata || !this.exdata.buyGoods) && 0 < this.exdata.buyGoods[e]
        }
        addBuyedGoods(e) {
            e <= 0 || (this.exdata.buyGoods || (this.exdata.buyGoods = {}),
                this.exdata.buyGoods[e] ? this.exdata.buyGoods[e] += 1 : this.exdata.buyGoods[e] = 1)
        }
        updateRecharge(e) {
            e && 0 != e.length ? this.rechargeIds = e : this.rechargeIds = [],
                this.checkRecharge()
        }
        checkRecharge() {
            var e;
            this.rechargeIds && 0 != this.rechargeIds.length && (e = this.rechargeIds[0],
                this.receiveRecharge(e).then(e => {
                    this.rechargeIds.splice(0, 1),
                        this.checkRecharge()
                }
                ))
        }
        receiveRecharge(e) {
            let t = pb.ReceiveRechargeReq.create();
            return t.id = e,
                k(t, d.ReceiveRechargeReq, pb.IReceiveRechargeAck).then(e => {
                    this.addBuyedGoods(e.GoodsId);
                    var t = +e.addFishCoin || 0
                        , i = (0 < t && (this.fishCoin = +e.FishCoin || 0,
                            N.event(m.UPDATE_ITEM)),
                            +e.addGold || 0);
                    return i && (this.gold = +e.Gold || 0),
                        t && N.event(m.RECHARGE_SUCCESS, [t, i]),
                        e
                }
                )
        }
        checkFirstReCharge() {
            return !!this.exdata.buyGoods[1001]
        }
        getWalletAddress(e) {
            let t = pb.GetWalletAddrReq.create();
            return t.rawAddress = e,
                k(t, d.GetWalletAddrReq, pb.IGetWalletAddrAck).then(e => e)
        }
        requestPrePay(e) {
            let t = pb.RequestPrePayReq.create();
            return t.id = e,
                k(t, d.RequestPrePayReq, pb.IRequestPrePayAck).then(e => e)
        }
        requestPay(e, t = 1) {
            let i = pb.RequestPayReq.create();
            return i.id = e,
                i.payType = t,
                k(i, d.RequestPayReq, pb.IRequestPayAck)
        }
        BCCheckIn(e) {
            let t = pb.BCCheckInReq.create();
            return t.checkInType = e,
                k(t, d.BCCheckInReq, pb.IBCCheckInAck)
        }
        payClubBooster(e, t, i = 1) {
            let s = pb.PayClubBoosterReq.create();
            return s.clubId = e,
                s.amount = t,
                s.payType = i,
                k(s, d.PayClubBoosterReq, pb.IPayClubBoosterAck)
        }
        serverMessageEvent(e) {
            0 < e.retCode && g(Ve(e.retCode)),
                e.eventType && e.eventType == ke.clubBooster && N.event(m.RECHARGE_SUCCESS)
        }
        getPurchaseGoods() {
            var e = Data.getChannel(Mmobay.MConfig.channelId);
            if (!e)
                return [];
            let t = [];
            for (const n in Data.Recharges) {
                var i, s = Data.getRecharge(+n), a = s.id, s = s[e.name];
                s && s.length && ((i = Data.getGoods(a)).type == Se.normalGoods && t.push({
                    id: a,
                    iconId: +i.iconId,
                    price: +s[1],
                    amount: i.fishCoin,
                    extra: i.extraFishCoin,
                    showDouble: !this.getBuyedGoods(a)
                }))
            }
            return t
        }
        reqRandomEvent() {
            return k(pb.RandomEventReq.create(), d.RandomEventReq, pb.IRandomEventAck).then(e => {
                this.randomEvent = e.randomEventData,
                    N.event(m.RANDOM_EVENT_TIME_CHANGE),
                    N.event(m.UPDATE_SPEED)
            }
            )
        }
        reqGetRandomEventAward(e = De.close) {
            let t = pb.GetRandomEventAwardReq.create();
            return t.opType = e,
                k(t, d.GetRandomEventAwardReq, pb.IGetRandomEventAwardAck).then(e => {
                    this.randomEvent = e.randomEventData,
                        this.fishCoin = +e.fishCoin || 0,
                        N.event(m.UPDATE_ITEM),
                        this.checkRandomBox(),
                        N.event(m.RANDOM_EVENT_TIME_CHANGE),
                        N.event(m.UPDATE_SPEED)
                }
                )
        }
        reqGetRandomEventBox() {
            var e = pb.GetRandomEventBoxReq.create();
            let s = N.cat.cats;
            return k(e, d.GetRandomEventBoxReq, pb.IGetRandomEventBoxAck, {
                noLoading: !0
            }).then(t => {
                this.randomEvent = t.randomEventData;
                let i = 0;
                for (let e = 0; e < t.cats.length; e++)
                    !s[e] && t.cats[e] && (N.cat.airDropMap[e] = 1,
                        N.cat.cats[e] = t.cats[e],
                        Laya.timer.once(50 * i, this, e => {
                            N.event(m.AIR_DROP, [e, !1])
                        }
                            , [e]),
                        i++);
                N.event(m.UPDATE_CAT)
            }
            )
        }
        reqTonExchangeRate() {
            return k(pb.TonExchangeRateReq.create(), d.TonExchangeRateReq, pb.ITonExchangeRateAck).then(e => e)
        }
        reqClubGroupUserName(e) {
            let t = pb.ClubGroupUserNameReq.create();
            return t.groupUserId = e,
                k(t, d.ClubGroupUserNameReq, pb.IClubGroupUserNameAck).then(e => e)
        }
        checkRandomBox() {
            if (w.randomEvent && !(w.randomEvent.boxNum <= 0)) {
                var i = N.cat.cats;
                let t = 0;
                for (let e = 0; e < i.length; e++)
                    i[e] || t++;
                t && this.reqGetRandomEventBox()
            }
        }
        doInviteAction() {
            Laya.Browser.onAndroid && He();
            let e = `https://t.me/${qe()}/gameapp?startapp=`;
            N.club.clubInfo && N.club.clubInfo.id ? e += `r_${N.club.clubInfo.id}_` + this.id : e += "rp_" + this.id;
            var t = encodeURIComponent(`💰Catizen: Unleash, Play, Earn - Where Every Game Leads to an Airdrop Adventure!
🎁Let's play-to-earn aridrop right now!`);
            Ue(`https://t.me/share/url?url=${e}&text=` + t),
                Laya.Browser.onAndroid && Oe()
        }
        doCreateClubAction() {
            He(),
                Ue("https://t.me/" + qe() + "?start=cc"),
                Oe()
        }
        toPremiumTg() {
            He();
            Ue("https://t.me/premium"),
                Oe()
        }
        toSquadChat(e) {
            this.reqClubGroupUserName(e).then(e => {
                He(),
                    Ue("https://t.me/" + e.groupUserName),
                    Oe()
            }
            )
        }
        toTask() {
            Laya.Browser.onPC && He(),
                Ue(`https://t.me/${qe()}/webapp?startapp=open_1001_0`)
        }
    }
        ;
    window.me = w;
    class Xe {
        constructor() {
            this.tapTokenPrice = .013,
                this.mcTokenPrice = .62
        }
        initAccount(e) {
            this.accountId = e.accountId,
                this.accountName = e.name,
                this.status = e.status
        }
        isForbidTalk() {
            return this.status == Le.forbidTalk
        }
        accountInfoChange(e) {
            this.status = e.status
        }
        updateGold(e) {
            e.fishCoin && (w.fishCoin = +e.fishCoin),
                e.gold && (w.gold = +e.gold)
        }
    }
    window.reqTest = function (e, t, i) {
        e = pb[e].create();
        return Object.assign(e, i),
            k(e, t, pb.IBindWalletAck).then(e => {
                console.log(e)
            }
            )
    }
        ;
    class ze {
        updateItem(e) {
            for (var t of e)
                w.bag[t.id] = t.num;
            N.event(m.UPDATE_ITEM)
        }
        getItemNum(e) {
            return w.bag[e] || 0
        }
        showBox(e) { }
        reqBuyItem(e, t) { }
    }
    var je = Laya.SoundManager;
    class x {
        constructor() {
            this._musicDisable = 1,
                this._soundDisable = 1,
                this._musicVolume = 1,
                this._soundVolume = 1
        }
        static get instance() {
            return x._instance || (x._instance = new x),
                x._instance
        }
        init() {
            this._musicDisable = S.get(S.s_musicDisable),
                this._soundDisable = S.get(S.s_soundDisable)
        }
        get lastMusic() {
            return this._lastMusic
        }
        set lastMusic(e) {
            this._lastMusic = e
        }
        get musicEnable() {
            return !this._musicDisable
        }
        set musicEnable(e) {
            this._musicDisable = !e
        }
        get soundEnable() {
            return !this._soundDisable
        }
        set soundEnable(e) {
            this._soundDisable = !e
        }
        get musicVolume() {
            return this._musicVolume
        }
        set musicVolume(e) {
            this._musicVolume = e,
                je.setMusicVolume(e)
        }
        get soundVolume() {
            return this._soundVolume
        }
        set soundVolume(e) {
            this._soundVolume = e,
                je.setSoundVolume(e)
        }
        playMusic(e, t = 0, i) {
            e && this.musicEnable && (this._lastMusic = e,
                e = this.formatUrl(e = "cat/bgm/" + e),
                this._musicChannel && this._musicChannel.url.includes(e) ? this._musicChannel.isStopped && this._musicChannel.resume() : this._musicChannel = je.playMusic(e, t, i))
        }
        playSound(e, t = 1, i) {
            e && this.soundEnable && 0 != this.soundVolume && (e = this.formatUrl(e = "cat/sound/" + e),
                je.playSound(e, t, i))
        }
        pauseMusic() {
            this._musicChannel && this._musicChannel.pause()
        }
        resumeMusic() {
            this._musicChannel && this._musicChannel.resume()
        }
        stopMusic() {
            je.stopMusic(),
                this._musicChannel = null
        }
        stopSound(e) {
            e ? (e = this.formatUrl(e = "cat/sound/" + e),
                je.stopSound(e)) : je.stopAllSound()
        }
        stopAll() {
            je.stopAll(),
                this._musicChannel = null
        }
        formatUrl(e) {
            return e = e.replace(".ogg", "mp3")
        }
    }
    window.sound = je;
    class $e {
        constructor() {
            this.cats = [null, null, null, null, null, null, null, null, null, null, null, null],
                this.goldAniImg = [],
                this.tempGold = 0,
                this.airDropTime = 0,
                this.airDropMap = {},
                this.goldMute = !1,
                this.freeCat = 0,
                this.buyAuto = !1,
                this.isAuto = null,
                this.clickAuto = !1
        }
        initCat(e) {
            var t = e.cats;
            for (let e = 0; e < t.length; e++)
                this.cats[e] = t[e] || null;
            this.buyAuto = !!e.exData.autoMerge,
                null === this.isAuto && (this.isAuto = this.buyAuto),
                this.goldTime = e.goldTime,
                this.freeCat = e.exData.freeCatLvl;
            e = 1e3 * +Data.gameConf.initCfg.gatherGoldTime;
            this.airDropTime = Date.newDate().getTime() / 1e3,
                Laya.timer.clearAll(this),
                Laya.timer.clear(this, this.startLoop),
                Laya.timer.once(1e3 * this.goldTime + e - Date.newDate().getTime(), this, this.startLoop),
                Laya.timer.loop(1e3 * +Data.gameConf.initCfg.airdropCatTime + 1e3, this, this.reqGetAirDropCat)
        }
        startLoop() {
            let e = 1e3 * +Data.gameConf.initCfg.gatherGoldTime;
            this.reqGather().then(() => {
                Laya.timer.once(1e3 * this.goldTime + e - Date.newDate().getTime(), this, this.startLoop)
            }
            )
        }
        getCats() {
            return this.cats
        }
        get nowGenerateCat() {
            var e = Data.getShopCat(this.getMyLv());
            return e ? e.generateLvl : 1
        }
        reqGather() {
            return k(new pb.GatherGoldReq, d.GatherGoldReq, pb.IGatherGoldAck, {
                noLoading: !0
            }).then(e => {
                w.m_gold = +e.gold,
                    this.goldTime = e.goldTime
            }
            )
        }
        reqOff(e) {
            let t = new pb.GetOffLineGoldReq;

            return t.Type = e,
                k(t, d.GetOffLineGoldReq, pb.IGetOffLineGoldAck, {
                    noLoading: !0
                }).then(e => {
                    w.m_gold = +e.gold,
                        this.goldTime = e.goldTime,
                        w.fishCoin = +e.fishCoin,
                        w.offLine = null,
                        N.event(m.HOME_GOLD_ANI)
                }
                )
        }
        reqSumCat(e) {
            let t = new pb.MergeCatReq;
            return t.indexs = e,
                k(t, d.MergeCatReq, pb.IMergeCatAck, {
                    noLoading: !0
                }).then(e => {
                    for (var t of e.cats)
                        if (t > this.getMyLv()) {
                            w.exdata.maxCatLvl = t,
                                N.event("updateShopRed"),
                                N.event(m.UPDATE_CAT),
                                N.event(m.MaxCAT_CHANGE);
                            break
                        }
                    return N.event(m.UPDATE_OUTPUT),
                        e.cats
                }
                )
        }
        reqSwitch(e) {
            let t = new pb.SwitchPosCatReq;
            return t.indexs = e,
                k(t, d.SwitchPosCatReq, pb.ISwitchPosCatAck, {
                    noLoading: !0
                }).then(t => {
                    for (let e = 0; e < t.cats.length; e++)
                        this.cats[e] = t.cats[e] || null;
                    return N.event(m.UPDATE_CAT, [!0]),
                        t
                }
                )
        }
        reqDelCat(e) {
            let t = new pb.DelCatReq;
            return t.indexs = [e],
                k(t, d.DelCatReq, pb.IDelCatAck, {
                    noLoading: !0
                }).then(t => {
                    for (let e = 0; e < t.cats.length; e++)
                        this.cats[e] = t.cats[e] || null;
                    return N.event(m.UPDATE_CAT, [!0]),
                        N.event(m.UPDATE_OUTPUT),
                        Date.newDate().getTime() / 1e3 - this.airDropTime > +Data.gameConf.initCfg.airdropCatTime + 1 && (this.reqGetAirDropCat(),
                            Laya.timer.loop(1e3 * +Data.gameConf.initCfg.airdropCatTime + 1e3, this, this.reqGetAirDropCat)),
                        t
                }
                )
        }
        reqSpeed(e) {
            let t = new pb.BoostGoldReq;
            return t.Type = e,
                k(t, d.BoostGoldReq, pb.IBoostGoldAck).then(e => (w.boostEndTime = e.boostEndTime,
                    w.exdata.speedFreeTime = e.SpeedFreeTime,
                    w.fishCoin = +e.fishCoin,
                    N.event(m.UPDATE_SPEED),
                    N.event(m.UPDATE_ITEM),
                    x.instance.playSound("Speed.mp3"),
                    e))
        }
        reqCreate(t = this.nowGenerateCat, e = !1, i = !1) {
            let s = new pb.GenerateCatReq;
            return s.lvl = t,
                s.Type = i ? 3 : e ? 2 : 1,
                k(s, d.GenerateCatReq, pb.IGenerateCatAck, {
                    noLoading: !0
                }).then(e => (w.m_gold = +e.gold,
                    w.fishCoin = +e.fishCoin,
                    this.cats[e.index || 0] = e.catLvl,
                    i && (this.freeCat = w.exdata.freeCatLvl = 0,
                        N.event("updateShopRed")),
                    w.exdata.catNumFish[t] = e.catNumFish,
                    w.exdata.catNum[t] = e.catNum,
                    N.event(m.UPDATE_CAT, [!0]),
                    N.event(m.BUY_CAT, [e]),
                    N.event(m.UPDATE_OUTPUT),
                    N.event(m.UPDATE_ITEM),
                    x.instance.playSound("airdrop3.mp3"),
                    e))
        }
        getNowPrice() {
            return this.getCatCost(this.nowGenerateCat)
        }
        getMyLv() {
            return w.exdata.maxCatLvl || 1
        }
        getOutPutSpeed() {
            var e = Date.newDate().getTime()
                , t = Data.getFishEvent(1)
                , t = t && t.goldMultiple[w.rankLeague] / 100 || 0;
            return this.getBaseSpeed() * ((1e3 * w.boostEndTime > e ? 2 : 1) * (w.randomEvent && 1e3 * +w.randomEvent.multipleTime > e ? 5 : 1) + (w.fishData && 1e3 * +w.fishData.eventTime > e ? t : 0))
        }
        getBaseSpeed() {
            let e = 0;
            for (var t of this.cats)
                t && (t = Data.getCat(t),
                    e += +t.outGold);
            return e
        }
        getCatCost(e) {
            var t = Data.getCat(e);
            return e > this.getGoldCatLv() ? Math.ceil(+t.baseCostFishCoin * Math.pow(t.priceAddFishCoin, w.exdata.catNumFish[e] || 0)) : Math.ceil(+t.baseCost * Math.pow(t.priceAdd, w.exdata.catNum[e] || 0))
        }
        playCat(t, i, s = "") {
            if (!t || t.skeleton && !t.destroyed) {
                Laya.timer.clearAll(t);
                let e = t.getAniIndexByName(i);
                s.length ? t.play(e, !1, Laya.Handler.create(this, () => {
                    e = t.getAniIndexByName(i),
                        t.play(t.getAniIndexByName(s), !0)
                }
                )) : t.play(e, !0)
            } else
                t._templet && t._templet.once(Laya.Event.COMPLETE, this, () => {
                    let e = t.getAniIndexByName(i);
                    s.length ? t.play(e, !1, Laya.Handler.create(this, () => {
                        e = t.getAniIndexByName(i),
                            t.play(t.getAniIndexByName(s), !0)
                    }
                    )) : t.play(e, !0)
                }
                )
        }
        prepareCat(s, e, t) {
            let a = Data.getCat(e)
                , n = a.oldShowId || a.showId
                , o = ""
                , r = (o = 200 <= +n ? "fat_" : 100 <= +n ? "chubby_" : "thin_",
                    ["Hat", "Body", "Ear_L", "Ear_R", "Eye_White", "Eyes", "Head", "Leg_LB", "Leg_LF", "Leg_RB", "Leg_RF", "Mouth", "Nose", "Tail", "Tongue"])
                , l = 0;
            Laya.loader.load("cat/catImage/cat_" + n + ".atlas", Laya.Handler.create(this, () => {
                for (let i of r) {
                    if (l++,
                        "Hat" == i) {
                        var e = a.hatId;
                        let t = e ? `cat/ui_cat/hat${e}.png` : "cat/ui_cat/hat.png";
                        Laya.loader.load(t, Laya.Handler.create(this, () => {
                            var e = Laya.loader.getRes(t);
                            s.setSlotSkin(o + i, e)
                        }
                        ))
                    } else {
                        e = Laya.loader.getRes("cat/catImage/cat_" + n + "/" + i + ".png");
                        if (!e)
                            continue;
                        s.setSlotSkin(o + i, e)
                    }
                    l == r.length && t && t.run()
                }
            }
            ))
        }
        getFishCoinLv() {
            var e = Data.getShopCat(this.getMyLv());
            return e ? e.fishCoinLvl : 1
        }
        getGoldCatLv() {
            var e = Data.getShopCat(this.getMyLv());
            return e ? e.goldLvl : 1
        }
        checkIsBoost() {
            return 1e3 * w.boostEndTime > Date.newDate().getTime()
        }
        reqGetAirDropCat() {
            if (this.cats.filter(e => !e).length && !(this.checkNew() || w.randomEvent && w.randomEvent.boxNum))
                return k(new pb.GetAirDropCatReq, d.GetAirDropCatReq, pb.IGetAirDropCatAck, {
                    noLoading: !0
                }).then(t => {
                    if (-1 != t.airdropIndex) {
                        if (this.airDropTime = +t.airdropTime,
                            -(this.airDropMap[t.airdropIndex] = 1) != t.airdropIndex) {
                            for (let e = 0; e < t.cats.length; e++)
                                this.cats[e] = t.cats[e] || null;
                            N.event(m.AIR_DROP, t.airdropIndex)
                        }
                        N.event(m.UPDATE_CAT)
                    }
                }
                )
        }
        getCv(e, t) {
            return `${e}_${"male" == t ? "Man" : "Female"}_${["E", "F", "G", "J"][Math.floor(4 * Math.random())]}.mp3`
        }
        checkNew() {
            return "0" == w.rankGold && !this.cats.find(e => !!e)
        }
        reqFreeCat() {
            return k(new pb.GetFreeCatReq, d.GetFreeCatReq, pb.IGetFreeCatAck, {
                noLoading: !0
            }).then(e => {
                this.freeCat = e.catLvl
            }
            )
        }
        reqBuyAuto() {
            return k(new pb.MergeCatAutoReq, d.MergeCatAutoReq, pb.IMergeCatAutoAck, {
                noLoading: !0
            }).then(e => {
                this.buyAuto = !!e.autoMerge,
                    w.exdata.autoMerge = e.autoMerge,
                    N.event("buyAuto")
            }
            )
        }
        doGoldRain(t) {
            for (let e = 0; e < 50; e++) {
                let e = new Laya.Image("cat/ui_item/coin.png");
                this.goldAniImg.push(e),
                    e.y = -50,
                    e.visible = !1,
                    t.addChild(e),
                    this.doGoldAni(e, t)
            }
        }
        doGoldAni(e, t) {
            e.x = Math.ceil(Math.random() * t.width - 20),
                e.alpha = Math.random() + .5,
                e.rotation = 360 * Math.random(),
                e.skewX = 5 * Math.random(),
                Laya.timer.once(2700 * Math.random(), e, () => {
                    e.visible = !0,
                        Laya.Tween.to(e, {
                            y: t.height + 50
                        }, 1e3 * Math.random() + 1500, null, Laya.Handler.create(this, () => {
                            e.y = -50,
                                e.visible = !1,
                                this.doGoldAni(e, t)
                        }
                        ))
                }
                )
        }
        clearGoldRain() {
            for (var e of this.goldAniImg)
                Laya.Tween.clearAll(e),
                    e.destroy();
            this.goldAniImg = []
        }
    }
    class Je {
        constructor() {
            this.m_fishPool = 0
        }
        reqFishRank() {
            return k(new pb.FishRankListReq, d.FishRankListReq, pb.IFishRankListAck).then(e => e.rankList)
        }
        reqMyFishInfo() {
            return k(new pb.MyFishInfoReq, d.MyFishInfoReq, pb.IMyFishInfoAck, {
                noLoading: !0
            }).then(e => e)
        }
        reqFishPool(e = !1) {
            return k(new pb.FishRewardPoolReq, d.FishRewardPoolReq, pb.IFishRewardPoolAck, {
                noLoading: e
            }).then(e => {
                this.m_fishPool = +e.count * N.cat.getBaseSpeed()
            }
            )
        }
        getFishArr() {
            if (this.m_fishs)
                return this.m_fishs;
            for (var e in this.m_fishs = [],
                Data.fishs) {
                e = Data.getFish(+e);
                this.m_fishs.push(e)
            }
            return this.m_fishs
        }
        getRankDetail() {
            if (this.m_fishRewards)
                return this.m_fishRewards;
            for (var e in this.m_fishRewards = [],
                Data.fishSettles) {
                e = Data.getFishSettle(+e);
                this.m_fishRewards.push(e)
            }
            return this.m_fishRewards
        }
        reqFishing(e) {
            let t = pb.FishingReq.create();
            return t.color = e,
                k(t, d.FishingReq, pb.IFishingAck).then(e => (N.bag.updateItem(e.items),
                    w.gold = +e.gold,
                    w.fishCoin = +e.fishCoin,
                    w.fishData = e.fishData,
                    N.event(m.FISHDATA_CHANGE),
                    e))
        }
        reqFishRodUp() {
            return k(pb.FishRodUpReq.create(), d.FishRodUpReq, pb.IFishRodUpAck).then(e => (w.exdata.fishRobLvl = e.FishRodLvl,
                w.fishCoin = +e.fishCoin,
                e))
        }
        formatWeight(e) {
            return 1e3 < e ? e / 1e3 + "T" : e + "KG"
        }
    }
    class Ke {
        reqFrensInfo() {
            return k(pb.FrensInfoReq.create(), d.FrensInfoReq, pb.IFrensInfoAck).then(e => e)
        }
        reqInviteRankList() {
            return k(pb.InviteRankListReq.create(), d.InviteRankListReq, pb.IInviteRankListAck).then(e => e)
        }
    }
    let Ze = new class {
        onErrorAck(e, t) {
            e.code == p.OtherLogined || e.code == p.BanAccount || e.code == p.BeKickoff ? N.login.handleErrorAck(e.code) : e.code == p.Maintain || e.code == p.AccessDenied ? N.login.handleMaintainErrorAck(e.code) : g(Ve(e.code))
        }
        onHookRecvPacket(e, t) {
            N.login.onHookRecvPacket(e, t)
        }
        onHookSendPacket(e, t) {
            N.login.onHookSendPacket(e, t)
        }
        onEnterGameAck(e, t) {
            N.login.onEnterGameAck(e, !0)
        }
        onServerStateNtf(e, t) {
            N.login.onServerState(e.serverType, e.offline)
        }
        onUserInfoNtf(e, t) {
            w.init(e.userInfo)
        }
        onAccountInfoChangeNtf(e, t) {
            N.account.accountInfoChange(e)
        }
        onMessageEventNtf(e) {
            w.serverMessageEvent(e)
        }
        onSyncRechargeNtf(e) {
            w.updateRecharge(e.ids)
        }
        onTokensInfoChangeNtf(e) {
            w.tokensInfoChange(e)
        }
        onClubInfoNtf(e) {
            N.club.clubInfo = e.club
        }
        onGoldChangeNtf(e) {
            N.account.updateGold(e)
        }
        onSysMsgNtf(e) {
            N.sysNotice.updateSys(e)
        }
        onBoostGoldNtf(e) {
            w.exdata.SpeedChainTime = e.SpeedChainTime,
                w.boostEndTime = e.boostEndTime,
                w.exdata.speedFreeTime = e.SpeedFreeTime,
                N.event(m.UPDATE_SPEED)
        }
        onRandomEventChangeNtf(e) {
            w.randomEvent = e.randomEventData,
                N.event(m.RANDOM_EVENT_TIME_CHANGE),
                N.event(m.UPDATE_SPEED),
                w.checkRandomBox()
        }
        onOffLineGoldNtf(e) {
            w.offLine = +e.offGold && v(e.offGold),
                N.event(m.UPDATE_OFFLINEGOLD)
        }
    }
        ;
    var Qe = new class {
        constructor() {
            this._timeMap = {}
        }
        checkLimit(e, t, i = !1) {
            return this._timeMap[e] ? (i && g("operating too frequently"),
                !1) : (this._timeMap[e] = !0,
                    Laya.timer.once(t, this, this.onTimeDelay, [e], !1),
                    !0)
        }
        onTimeDelay(e) {
            delete this._timeMap[e]
        }
    }
        ;
    function et(e, t = 200, i = !1) {
        return Qe.checkLimit(e, t, i)
    }
    function R(e, t, i, s) {
        var a, n = arguments.length, o = n < 3 ? t : null === s ? s = Object.getOwnPropertyDescriptor(t, i) : s;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            o = Reflect.decorate(e, t, i, s);
        else
            for (var r = e.length - 1; 0 <= r; r--)
                (a = e[r]) && (o = (n < 3 ? a(o) : 3 < n ? a(t, i, o) : a(t, i)) || o);
        3 < n && o && Object.defineProperty(t, i, o)
    }
    function L(r, l) {
        const h = "_modelEvents";
        return function (e, t, i) {
            let s;
            if (e.hasOwnProperty(h))
                s = e[h];
            else {
                var a = e[h];
                if (e[h] = s = [],
                    a)
                    for (var n in a) {
                        var o = a[n];
                        o.isPri || (s[n] = o)
                    }
            }
            s.push({
                eventType: r,
                handler: i.value,
                isPri: l
            })
        }
    }
    class tt extends e.cat.views.fish.FishAutoDlgUI {
        onAwake() {
            super.onAwake(),
                this.m_view_Count.setData(1, Math.floor(w.fishCoin / +Data.gameConf.fishCfg.costCoin), 1),
                this.updateView()
        }
        updateView() {
            var e = Math.max(1, this.m_view_Count.count) * +Data.gameConf.fishCfg.costCoin;
            this.m_txt_Sel.text = "/" + e,
                this.m_txt_Num.text = w.fishCoin + "",
                this.m_txt_Num.color = w.fishCoin >= e ? "#764428" : Ye.Red
        }
        onClickAuto() {
            this.closeDialog(this.m_view_Count.count ? r.Yes : r.No, [this.m_rad_Stop.selected, this.m_view_Count.count])
        }
    }
    R([L(m.COUNT_CHANGE)], tt.prototype, "updateView", null);
    class it extends e.cat.views.fish.FishHistoryCellViewUI {
        dataChanged(e) {
            e ? this.dataSource = e : e = this.dataSource,
                Object.assign(this.m_div_Tip.style, {
                    fontSize: 18,
                    bold: !0,
                    color: +e.param[1] == Data.getFish(101).name ? Ye.Yellow : Ye.White,
                    leading: 3,
                    wordWrap: !0,
                    width: 500
                }),
                this.m_div_Tip.innerHTML = N.sysNotice.parseSysMsg(e) + "",
                this.height = this.m_div_Tip.contextHeight + 4
        }
    }
    function st(n, t = "D:HH:MM:ss") {
        n < 0 && (n = 0);
        let e = /D|([HhMs])\1?|S/
            , o = -1
            , r = -1
            , l = []
            , h = [];
        function i(t, e, i) {
            var s = Math.floor(+n / t);
            if (l.push(i),
                h.push(s),
                0 < s ? ((r = -1) == o && (o = i),
                    n = +n % t) : -1 == r && (r = i),
                e) {
                var [t, a = 2] = [s];
                let e = String(t);
                for (; e.length < a;)
                    e = "0" + e;
                return e
            }
            return s + ""
        }
        let s = 0
            , a = !1
            , c = "";
        for (; c != t;)
            "" != c && (t = c),
                c = t.replace(e, e => {
                    switch (s = 0,
                    a = !1,
                    e) {
                        case "D":
                            s = 86400,
                                a = !0;
                            break;
                        case "hh":
                        case "HH":
                            a = !0;
                        case "h":
                        case "H":
                            s = 3600;
                            break;
                        case "MM":
                            a = !0;
                        case "M":
                            s = 60;
                            break;
                        case "ss":
                            a = !0;
                        case "s":
                        case "S":
                            s = 1
                    }
                    return i(s, a, t.indexOf(e))
                }
                );
        let m = ""
            , d = t.indexOf("#");
        if (-1 < d && (m = -1 == o ? t.slice(d, d + 1) : t.slice(d, o)),
            -1 < (d = t.indexOf("&")) && ("" != m && (m += "|"),
                -1 == r ? m += t.slice(d, d + 1) : m += t.slice(r, d + 1)),
            -1 < (d = t.indexOf("@"))) {
            "" != m ? m += "|@" : m += "@";
            for (let e = 0; e < l.length; e++)
                0 == h[e] && (m = (m += "|") + t.slice(l[e], null == l[e + 1] ? d : l[e + 1]))
        }
        e = new RegExp(m, "g");
        let _ = (t = t.replace(e, "")).split(":");
        return 4 == _.length && "00" == _[0] && (_.shift(),
            t = _.join(":")),
            t
    }
    class at {
        constructor(e, t, i, s) {
            this.disposed = !1,
                this._endTime = e,
                this._interval = t,
                this._timeLabel = i,
                this._format = s
        }
        static create(e, t = 1e3, i, s = "D:HH:MM:ss") {
            return new at(e, t, i, s)
        }
        bindLabel(e) {
            this._timeLabel = e
        }
        set endTime(e) {
            this._endTime != e && (this._endTime = e)
        }
        get endTime() {
            return this._endTime
        }
        start() {
            Laya.timer.loop(this._interval, this, this.onTimerLoop),
                this.onTimerLoop()
        }
        onTimerLoop() {
            var e = Date.newDate().getTime();
            let t = this._endTime - e
                , i = (t <= 0 && (Laya.timer.clear(this, this.onTimerLoop),
                    t = 0),
                    t = Math.round(t / 1e3),
                    "");
            if (i = null == this._format ? st(t) : st(t, this._format),
                this._timeLabel) {
                if (this._timeLabel.destroyed)
                    return void this.dispose();
                this._timeLabel.text = i
            }
            this.onTick && this.onTick(t),
                t <= 0 && Laya.timer.once(this._interval || 1e3, this, () => {
                    this.onEnd && this.onEnd(),
                        this.dispose()
                }
                )
        }
        dispose() {
            Laya.timer.clear(this, this.onTimerLoop),
                this._endTime = void 0,
                this._format = void 0,
                this._interval = void 0,
                this._timeLabel = null,
                this.onTick && (this.onTick = null),
                this.onEnd && (this.onEnd = null),
                this.disposed = !0
        }
    }
    class nt extends e.cat.views.fish.FishRewardDetailDlgUI {
        constructor() {
            super(...arguments),
                this.m_sel = 0
        }
        onAwake() {
            super.onAwake(),
                this.updateView(),
                nt.instance = this
        }
        onDestroy() {
            super.onDestroy(),
                nt.instance = null
        }
        updateView() {
            N.fish.reqMyFishInfo().then(e => {
                e = this.getRank(+e.myRank);
                e && this.m_view_Me.dataChanged(null, {
                    settleCfg: e,
                    isSelf: !0
                }),
                    this.m_view_Me.visible = !!e,
                    this.m_txt_No.visible = !e;
                let t = []
                    , i = N.fish.getRankDetail();
                i.forEach(e => {
                    t.push({
                        settleCfg: e,
                        isSelf: !1
                    })
                }
                ),
                    this.m_lst_Rank.array = t
            }
            )
        }
        getRank(e) {
            if (!e || e < 0)
                return null;
            for (var t in Data.fishSettles) {
                t = Data.getFishSettle(+t);
                if (+t.start <= e && +t.end >= e)
                    return t
            }
        }
        onSelectType() {
            this.updateView()
        }
    }
    class ot extends e.cat.views.fish.FishRewardRuleDlgUI {
    }
    class rt extends e.cat.views.fish.FishRankDlgUI {
        onAwake() {
            super.onAwake(),
                N.fish.reqFishRank().then(e => {
                    this.updateView(e)
                }
                )
        }
        onDestroy() {
            super.onDestroy(),
                Laya.timer.clearAll(this),
                this.tick && this.tick.dispose(),
                this.tick_pool && this.tick_pool.dispose()
        }
        updateView(e) {
            this.tick && this.tick.dispose();
            let t = this.tick = at.create((i = Date.getMondayZeroTime().addDays(7).getTime(),
                0 < (s = Date.newDate().getTime() - i) ? (s = Math.ceil(s / 6048e5),
                    Date.getMondayZeroTime().addDays(7 * (s + 1)).getTime()) : i), 1e3, this.m_txt_Time);
            var i, s;
            t.onEnd = () => {
                N.fish.reqFishRank().then(e => {
                    this.updateView(e)
                }
                )
            }
                ,
                t.start();
            let a = [];
            e.forEach(e => {
                a.push({
                    rankData: e,
                    isSelf: !1
                })
            }
            ),
                this.m_lst_Rank.array = a,
                N.fish.reqMyFishInfo().then(e => {
                    this.m_view_Me.visible = e.myRank && 0 < +e.myRank,
                        this.m_txt_No.visible = !this.m_view_Me.visible,
                        this.m_view_Me.visible && this.m_view_Me.dataChanged(null, {
                            rankData: {
                                userId: w.id,
                                rank: e.myRank,
                                score: e.myScore,
                                rankKey: e.myRankKey,
                                name: w.name,
                                icon: w.icon
                            },
                            isSelf: !0
                        })
                }
                ),
                this.updatePool(),
                Laya.timer.loop(1e4, this, () => {
                    this.updatePool(!0)
                }
                )
        }
        updatePool(e = !1) {
            N.fish.reqFishPool(e).then(() => {
                this.checkBonusShow()
            }
            )
        }
        checkBonusShow() {
            if (this.m_txt_BonusNum.text) {
                if (this.m_oldPool != N.fish.m_fishPool) {
                    var i = Date.newDate().addMilliseconds(1e3).getTime();
                    this.tick_pool = at.create(i, 80);
                    let e = 0
                        , t = N.fish.m_fishPool - this.m_oldPool;
                    this.tick_pool.onTick = () => {
                        8 < e ? (this.m_oldPool = N.fish.m_fishPool,
                            this.m_txt_BonusNum.text = v(N.fish.m_fishPool)) : this.m_txt_BonusNum.text = v(this.m_oldPool + t / 8 * e),
                            e++
                    }
                        ,
                        this.tick_pool.start()
                }
            } else
                this.m_oldPool = N.fish.m_fishPool,
                    this.m_txt_BonusNum.text = v(N.fish.m_fishPool)
        }
        onClickDetail() {
            u(nt)
        }
        onClickInfo() {
            u(ot)
        }
    }
    class lt extends e.cat.views.fish.FishRuleDlgUI {
    }
    class ht extends e.cat.views.fish.FishSuccDlgUI {
        constructor(e, t = !1, i = !1) {
            super(),
                this.m_data = null,
                this.m_isAuto = !1,
                this.m_isFomo = !1,
                this.m_data = e,
                this.m_isAuto = t,
                this.m_isFomo = i
        }
        onAwake() {
            super.onAwake(),
                this.showUI(),
                x.instance.playSound("getfish.mp3")
        }
        showUI() {
            var e, t = this.m_data, i = Data.getFish(t.fishId), s = (this.m_txt_Title.text = i && f(i.name),
                Data.getFishEvent(2)), a = s.goldMultiple[w.rankLeague] || 0, s = s.fishCoinMultiple || 0;
            0 < +this.m_data.addFishCoin ? (this.m_txt_FishCoin.text = this.m_isFomo ? "x" + v(+this.m_data.addFishCoin / s) : "x" + v(this.m_data.addFishCoin),
                this.m_box_FishCoin.visible = !0,
                this.m_isFomo && 0 < +s ? (this.m_box_Fomo.visible = !0,
                    this.m_img_GetFish.height = 190,
                    this.m_txt_Fomo.text = "x" + s,
                    this.m_box_GoldT.visible = !0,
                    this.m_img_Total.skin = "cat/ui_item/8.png",
                    this.m_txt_Total.text = v(+this.m_data.addFishCoin),
                    this.height = 820) : (this.height = 730,
                        this.m_img_GetFish.height = 100,
                        this.m_box_Weight.centerY = 0)) : 0 < +this.m_data.addgold ? (this.m_box_Gold.visible = this.m_box_GoldT.visible = !0,
                            this.m_txt_Speed.text = v(N.cat.getBaseSpeed()) + "/s",
                            this.m_img_SpeedBg.width = this.m_txt_Speed.width + 40 + 10,
                            s = Data.getFish(t.fishId).sellWorth,
                            this.m_txt_Times.text = " x" + Math.floor(s / 60),
                            e = w.exdata.fishRobLvl || 0,
                            e = Data.getFishRod(e),
                            this.m_isFomo && e ? (this.height = 920,
                                this.m_img_GetFish.height = 280,
                                this.m_box_Rod.top = 115,
                                this.m_box_Fomo.visible = this.m_box_Rod.visible = !0,
                                this.m_txt_Fomo.text = "x" + a,
                                this.m_txt_Rod.text = "x" + v(e.multiple),
                                this.m_txt_Total.text = v(N.cat.getBaseSpeed() * s * +e.multiple * a)) : this.m_isFomo ? (this.height = 810,
                                    this.m_img_GetFish.height = 190,
                                    this.m_box_Fomo.visible = !0,
                                    this.m_txt_Fomo.text = "x" + a,
                                    this.m_txt_Total.text = v(N.cat.getBaseSpeed() * s * a)) : e ? (this.height = 810,
                                        this.m_img_GetFish.height = 190,
                                        this.m_box_Rod.visible = !0,
                                        this.m_txt_Rod.text = "x" + v(e.multiple),
                                        this.m_txt_Total.text = v(s * N.cat.getBaseSpeed() * +e.multiple)) : (this.height = 730,
                                            this.m_img_GetFish.height = 100,
                                            this.m_box_Rod.visible = !1,
                                            this.m_txt_Total.text = v(s * N.cat.getBaseSpeed()))) : (124 == i.id ? (this.m_txt_TipsNoFish.text = f(1048),
                                                this.m_img_RightCoin.skin = "cat/ui_fish/earn2.png") : 125 == i.id && (this.m_txt_TipsNoFish.text = f(1047),
                                                    this.m_img_RightCoin.skin = "cat/ui_fish/earn3.png"),
                                                this.height = 650,
                                                this.m_img_GetFish.height = 130,
                                                this.m_img_TotalGold.visible = !1,
                                                this.m_txt_TipsNoFish.visible = !0,
                                                this.m_box_Rod.visible = this.m_box_FishCoin.visible = this.m_box_Gold.visible = !1,
                                                this.m_box_Weight.centerY = 0,
                                                this.m_img_LeftCoin.visible = this.m_img_RightCoin.visible = !0),
                this.m_img_Fish.skin = this.m_img_FishSmall.skin = `cat/ui_fish/${t.fishId}.png`,
                this.m_txt_Weight.text = N.fish.formatWeight(t.weight),
                t.newMax == t.myNewMax && t.newMax > t.oldMax ? (this.m_view_New.destroy(),
                    this.m_img_Top.visible = !0) : t.myNewMax > t.myOldMax ? (this.m_img_Top.destroy(),
                        this.m_view_New.visible = !0) : (this.m_img_Top.destroy(),
                            this.m_view_New.destroy()),
                this.m_isAuto ? (this.m_btn_CloseB.visible = !0,
                    this.m_btn_Continue.visible = !1,
                    this.m_box_Continue.visible = !1) : (this.m_txt_Num.text = w.fishCoin + "",
                        this.m_txt_Need.text = "/" + Data.gameConf.fishCfg.costCoin,
                        this.m_btn_CloseB.visible = !1,
                        this.m_btn_Continue.visible = !0,
                        this.m_box_Continue.visible = !0)
        }
        onClickContinue() {
            this.closeDialog(),
                N.event(m.DO_CONTINUE_FISH)
        }
    }
    class ct extends Laya.EventDispatcher {
        constructor() {
            super(...arguments),
                this._isLoading = !1,
                this._isLoaded = !1,
                this._reference = 0,
                this._activeTime = 0
        }
        static registerTimer() {
            Laya.timer.loop(3e4, null, ct.checkUnusedRes)
        }
        static checkUnusedRes() {
            if (ct._resRef.size) {
                var t, i, s = Date.newDate().getTime();
                let e = ct._resRef;
                for ([t, i] of e)
                    i.canDestroy(s) && (i.destroy(),
                        e.delete(t))
            }
        }
        static create(e) {
            let t = ct._resRef.get(e);
            return t || (t = new ct,
                ct._resRef.set(e, t)),
                t.init(e),
                t
        }
        init(e) {
            this._url = e,
                this._reference++,
                this._activeTime = Date.newDate().getTime(),
                this._templet && !this._templet.destroyed || (this._isLoading = !1,
                    this._isLoaded = !1,
                    this._templet = new Laya.SpineTemplet_3_x,
                    this._templet.once(Laya.Event.COMPLETE, this, this.onLoadComplete),
                    this._templet.once(Laya.Event.ERROR, this, this.onLoadError))
        }
        destroy() {
            this.offAll(),
                this._templet && (this._templet.offAll(),
                    this._templet.destroy(),
                    this._templet = null)
        }
        canDestroy(e) {
            return !(0 < this._reference) && !(e - this._activeTime < 6e4)
        }
        recover() {
            this._reference--
        }
        loadAni() {
            this._isLoaded ? this.event(Laya.Event.COMPLETE) : this._isLoading || (this._isLoading = !0,
                this._templet.loadAni(this._url))
        }
        buildSkeleton() {
            return this._templet.buildArmature()
        }
        onLoadComplete() {
            this._isLoading = !1,
                this._isLoaded = !0,
                this._templet.offAll(),
                0 < this._reference && this.event(Laya.Event.COMPLETE)
        }
        onLoadError() {
            this._isLoading = !1,
                this._templet.offAll(),
                0 < this._reference && this.event(Laya.Event.ERROR)
        }
    }
    ct._resRef = new Map,
        ct.registerTimer();
    class D extends Laya.Sprite {
        constructor() {
            super(),
                this._index = -1,
                this._offset = [],
                this.size(100, 100).pivot(50, 50)
        }
        static create(e) {
            let t = n.get(D._sign, D);
            t.setData(e);
            var i = e.px || 0
                , s = e.py || 0
                , a = e.scale || 1;
            return t.pos(i, s),
                t.scale(a, a),
                t.zOrder = e.zOrder || 0,
                e.alpha || 0 == e.alpha ? t.alpha = e.alpha : t.alpha = 1,
                e.parent && e.parent.addChild(t),
                t
        }
        get skeleton() {
            return this._skeleton
        }
        setData(e) {
            this._url = e.url,
                this._autoPlay = !!e.autoPlay,
                this._autoRemove = !!e.autoRemove,
                this._loop = !!e.loop,
                this._rate = e.rate || 1,
                this._offset = e.offset || [],
                this._templet = ct.create(this._url),
                this._templet.once(Laya.Event.COMPLETE, this, this.onLoadComplete),
                this._templet.once(Laya.Event.ERROR, this, this.onLoadError),
                this._templet.loadAni()
        }
        onDestroy() {
            this._templet && (this._templet.off(Laya.Event.COMPLETE, this, this.onLoadComplete),
                this._templet.off(Laya.Event.ERROR, this, this.onLoadError),
                this._templet.recover(),
                this._templet = null),
                this._skeleton = null
        }
        recover() {
            this.destroyed || (this.offAll(),
                this.removeSelf(),
                this._url = null,
                this._rate = 1,
                this._autoPlay = !1,
                this._autoRemove = !1,
                this._loop = !1,
                this._loaded = !1,
                this._index = -1,
                this._settedPos = !1,
                this._offset = [],
                this._playHandler && this._playHandler.recover(),
                this._playHandler = null,
                this._templet && (this._templet.off(Laya.Event.COMPLETE, this, this.onLoadComplete),
                    this._templet.off(Laya.Event.ERROR, this, this.onLoadError),
                    this._templet.recover(),
                    this._templet = null),
                this._skeleton && !this._skeleton.destroyed && this._skeleton.destroy(),
                this._skeleton = null,
                n.put(D._sign, this))
        }
        play(e = 0, t = !1, i = null) {
            this._index == e && this._loop == t || (t && (i = null),
                this._autoPlay = !0,
                this._index = e,
                this._loop = t,
                this._playHandler = i,
                this._play())
        }
        stop() {
            this._skeleton && this._skeleton.stop()
        }
        _play() {
            this._loaded && this._skeleton && ((this._index < 0 || this._index >= this._skeleton.getAnimNum()) && (this._index = 0),
                this._skeleton.play(this._index, this._loop),
                this.event(Laya.Event.START),
                this._settedPos || (this._settedPos = !0,
                    this._offset.length ? this._skeleton.pos(50 - this._offset[0], 100 - this._offset[1]) : this._skeleton.pos(50, 100)))
        }
        onLoadComplete() {
            if (!this.destroyed) {
                this._loaded = !0;
                let e = this._skeleton = this._templet.buildSkeleton();
                e.playbackRate(this._rate),
                    e.on(Laya.Event.STOPPED, this, this.onPlayComplete),
                    this.addChild(e),
                    this._autoPlay && this._play()
            }
        }
        onLoadError() {
            console.log("load spine error==>" + this._url)
        }
        onPlayComplete() {
            if (this._autoRemove && this.recover(),
                this._playHandler) {
                var t = this._playHandler.caller;
                if (t && t.destroyed)
                    return this._playHandler.recover(),
                        void (this._playHandler = null);
                let e = this._playHandler;
                this._playHandler = null,
                    e.run()
            }
        }
        getAniIndexByName(t) {
            return this.skeleton ? this.skeleton.skeleton.data.animations.findIndex(e => e.name == t) : 0
        }
    }
    D._sign = "p_Spine";
    class mt extends e.cat.views.fish.FishRewardDlgUI {
        constructor(e, t) {
            super(),
                this.m_rank = t,
                this.m_data = e
        }
        onAwake() {
            super.onAwake(),
                this.updateView()
        }
        updateView() {
            this.m_txt_Desc.text = f(1037, this.m_rank),
                this.m_txt_BonusNum.text = v(this.m_data)
        }
    }
    class dt extends e.cat.views.recharge.RechargeProcessingDlgUI {
        constructor() {
            super(...arguments),
                this.m_waitTimes = 30
        }
        onAwake() {
            super.onAwake(),
                this.m_txt_Time.text = this.m_waitTimes + "s",
                Laya.timer.loop(1e3, this, this.startWait)
        }
        onDestroy() {
            super.onDestroy(),
                Laya.timer.clear(this, this.startWait)
        }
        onRechargeSuccess() {
            this.closeDialog()
        }
        startWait() {
            this.m_waitTimes--,
                this.m_txt_Time.text = this.m_waitTimes + "s",
                this.m_waitTimes <= 0 && (Laya.timer.clear(this, this.startWait),
                    this.m_txt_Time.visible = !1,
                    this.m_txt_Info.visible = !1,
                    this.m_txt_Timeount.visible = !0)
        }
    }
    R([L(m.RECHARGE_SUCCESS)], dt.prototype, "onRechargeSuccess", null);
    class T extends e.cat.views.recharge.RechargeDlgUI {
        onAwake() {
            super.onAwake(),
                this.m_view_FishCoin.removePlus(),
                this.m_box_Method.size(Laya.stage.width, Laya.stage.height),
                this.m_box_Method.visible = !1,
                this.updateWalletConnect(),
                this.showUI()
        }
        showUI() {
            var e = w.getPurchaseGoods();
            this.m_lst_Goods.array = e
        }
        updateWalletConnect() {
            if (!N.wallet.connected)
                return this.m_btn_WalletAddress.visible = !1,
                    void (this.m_btn_Disconnect.visible = !1);
            N.wallet.getAddress().then(e => {
                var t;
                this.destroyed || (t = e.length,
                    this.m_btn_WalletAddress.visible = !0,
                    this.m_txt_WalletAddress.text = e.substring(0, 4) + "..." + e.substring(t - 4, t))
            }
            )
        }
        onSelectGoods(e) {
            if (-1 != e) {
                let t = this.m_lst_Goods.selectedItem;
                t && (this.m_payingGoods = t,
                    this.m_lst_Goods.selectedIndex = -1,
                    w.requestPrePay(t.id).then(e => {
                        this.m_txt_PriceTon.text = e.tonPrice + "TON",
                            this.m_txt_PriceUsd.text = "= $" + t.price,
                            this.m_box_Method.visible = !0,
                            this.ani1.play(0, !1)
                    }
                    ))
            }
        }
        onClickHideMethod(e) {
            this.m_box_Method.visible = !1
        }
        onClickWalletAddress(e) {
            var t = this.m_btn_Disconnect.visible;
            this.m_btn_Disconnect.visible = !t
        }
        onClickDisconnect(e) {
            N.wallet.disconnect().then(() => {
                Laya.timer.once(100, this, () => {
                    this.updateWalletConnect()
                }
                )
            }
            )
        }
        onClickWalletPay(e) {
            this.m_payingGoods && w.requestPay(this.m_payingGoods.id, 1).then(e => {
                this.m_box_Method.visible = !1,
                    Mmobay.MConfig.channelId != Mmobay.MConst.CHANNEL_LOCAL && (Laya.Browser.onPC && He(),
                        Ue(e.payData.paylink),
                        this.showPayProcessing(3e3))
            }
            )
        }
        onClickTonConnectPay(e) {
            this.m_payingGoods && w.requestPay(this.m_payingGoods.id, 2).then(e => {
                this.m_box_Method.visible = !1,
                    Mmobay.MConfig.channelId != Mmobay.MConst.CHANNEL_LOCAL && (this.m_payData = e.payData,
                        N.wallet.connected ? this.sendTransaction() : this.connectWallet())
            }
            )
        }
        connectWallet() {
            w.linkType = y.ConnectWalletForBuyFishRecharge,
                N.wallet.connect().then(e => {
                    Laya.timer.once(500, this, () => {
                        this.sendTransaction()
                    }
                    )
                }
                )
        }
        sendTransaction() {
            var e, t, i;
            this.m_payData && (e = this.m_payData.amount,
                t = this.m_payData.walletAddress,
                i = this.m_payData.payload,
                N.wallet.sendTransaction(e, t, i).then(() => {
                    this.showPayProcessing()
                }
                ))
        }
        showPayProcessing(e = 100) {
            Laya.timer.once(e, this, () => {
                this.destroyed || u(dt, {
                    retainPopup: !0
                })
            }
            )
        }
    }
    R([L(m.UPDATE_ITEM)], T.prototype, "showUI", null),
        R([L(m.WALLET_CONNECTED)], T.prototype, "updateWalletConnect", null);
    class _t extends e.cat.views.fish.FishItemViewUI {
        constructor(e) {
            super(),
                this.m_data = null,
                this.m_tl = null,
                this.m_data = e
        }
        onDestroy() {
            super.onDestroy(),
                this.m_tl && (this.m_tl.destroy(),
                    this.m_tl = null)
        }
        onAwake() {
            super.onAwake(),
                this.m_img_Fish.skin = `cat/ui_fish/${this.m_data.fishId}.png`,
                124 == this.m_data.fishId ? (this.m_img_Coin.skin = "",
                    this.m_txt_Add.text = f(1048)) : 125 == this.m_data.fishId ? (this.m_img_Coin.skin = "",
                        this.m_txt_Add.text = f(1047)) : 0 < +this.m_data.addFishCoin ? (this.m_txt_Add.text = "+" + v(this.m_data.addFishCoin),
                            this.m_img_Coin.skin = "cat/ui_item/8.png") : (this.m_txt_Add.text = "+" + v(this.m_data.addgold),
                                this.m_img_Coin.skin = "cat/ui_item/coin.png"),
                this.width = this.m_box_Con.width + 5
        }
        doAniShow() {
            this.visible = !0;
            let e = this.m_tl = new Laya.TimeLine;
            var t = this.y;
            e.to(this, {
                y: t - 120
            }, 1500).to(this, {
                y: t - 240,
                alpha: .3
            }, 1500),
                e.on(Laya.Event.COMPLETE, this, () => {
                    this.destroy()
                }
                ),
                e.play()
        }
    }
    class ut extends e.cat.views.fish.FishUpgradeDlgUI {
        onAwake() {
            super.onAwake(),
                this.showUI()
        }
        onDestroy() {
            super.onDestroy()
        }
        showUI() {
            var e = N.cat.getMyLv()
                , t = w.exdata.fishRobLvl || 0
                , i = Data.getFishRod(t)
                , t = Data.getFishRod(t + 1);
            if (!t)
                return this.m_txt_Tips.visible = !0,
                    this.m_txt_Tips.text = "MAX",
                    this.m_txt_Tips.bottom = 100,
                    this.m_txt_Tips.fontSize = 32,
                    this.m_txt_Cur.text = "x" + v(i.multiple),
                    this.m_txt_NextTip.text = this.m_txt_CurTip.text,
                    this.m_img_Cur.visible = !1,
                    this.m_img_Arrow.visible = !1,
                    this.m_btn_Upgrade.visible = !1,
                    this.m_box_Need.visible = !1,
                    void (this.height = 420);
            t && e >= t.catMaxLvl ? (this.m_btn_Upgrade.disabled = !1,
                this.m_txt_Tips.visible = !1,
                this.m_txt_Next.text = "x" + v(t.multiple),
                this.m_txt_Cur.text = "x" + v(i && i.multiple || 0),
                this.m_txt_Num.text = w.fishCoin + "",
                this.m_txt_Need.text = "/" + t.costFishCoin,
                this.m_box_Need.visible = !0) : t && (this.m_box_Need.visible = !1,
                    this.m_txt_Tips.visible = !0,
                    this.m_btn_Upgrade.disabled = !0,
                    this.m_txt_Tips.text = f(1049, t.catMaxLvl),
                    this.m_txt_Next.text = "x" + v(t.multiple),
                    this.m_txt_Cur.text = "x" + v(i && i.multiple || 0))
        }
        onClickUpgrade() {
            N.fish.reqFishRodUp().then(() => {
                g(f(1033)),
                    this.showUI()
            }
            )
        }
    }
    class gt extends e.cat.views.fish.FishDlgUI {
        constructor() {
            super(),
                this.m_tl = null,
                this.isAuto = !1,
                this.autoNumArr = [],
                this.checkStop = !1,
                this.m_ygSpine = null,
                this.m_fomoSpine = null,
                this.m_eventMaxNum = 10,
                this.m_Cfg = [[287, 287, 20, 4], [245, 245, 56, 3], [204, 204, 98, 2], [155, 155, 139, 1], [115, 115, 188, 2], [75, 75, 228, 3], [30, 30, 268, 4]]
        }
        onDestroy() {
            super.onDestroy(),
                this.clearTimeLine(),
                N.cat.goldMute = !1,
                x.instance.playMusic("BGM_Cafe.mp3"),
                N.sysNotice.reqUnWatch(Ie.fish)
        }
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                N.cat.goldMute = !0,
                x.instance.playMusic("BGM_Excavate.mp3"),
                this.m_pan_Panel.elasticEnabled = !1,
                this.ani1.on(Laya.Event.COMPLETE, this, this.doEndFish),
                this.showUI(),
                this.m_txt_Need.text = "/" + Data.gameConf.fishCfg.costCoin,
                N.sysNotice.reqFishHistory().then(e => {
                    for (let t of e.list)
                        me(it, {}).then(e => {
                            this.destroyed ? e.destroy() : (e.dataChanged(t),
                                this.m_box_Vbox.addChild(e))
                        }
                        );
                    N.sysNotice.reqWatch(Ie.fish)
                }
                ),
                this.checkUpGradeShow(),
                this.checkFomoAni()
        }
        showUI() {
            var e = w.fishCoin;
            this.m_txt_Num.text = e + "",
                this.m_btn_Fish.visible = !1,
                this.m_btn_Start.visible = !0,
                this.m_btn_Auto.visible = !0,
                this.m_txt_Gold.text = v(w.gold) || "0",
                this.showFishBait(),
                this.showMyFishInfo()
        }
        showMyFishInfo() {
            N.fish.reqMyFishInfo().then(e => {
                this.destroyed || (this.m_txt_NoRecord.visible = +e.myRank < 0,
                    this.m_box_Rank.visible = 0 < +e.myRank,
                    +e.rewardGold && u(mt, {
                        params: [e.rewardGold, e.rewardRank]
                    }),
                    0 < +e.myRank && (this.m_txt_SelfRank.text = e.myRank + "",
                        this.m_img_FishRank.skin = `cat/ui_fish/${e.myRankKey}.png`,
                        this.m_txt_Weight.text = N.fish.formatWeight(+e.myScore)))
            }
            )
        }
        showFishBait() {
            var e = w.fishCoin;
            this.m_txt_Num.text = e + "",
                this.m_txt_Num.color = e >= +Data.gameConf.fishCfg.costCoin ? Ye.Green : Ye.Red
        }
        showFishAni() {
            this.m_ygSpine || (this.m_ygSpine = D.create({
                url: "cat/spine/yugan.json",
                parent: this.m_box_Ani,
                px: this.m_img_Rod.x,
                py: this.m_img_Rod.y,
                autoPlay: !1
            }));
            let e = this.m_ygSpine;
            this.m_btn_Start.visible = !1,
                this.m_img_Rod.visible = !1,
                this.m_box_Area.visible = !1,
                this.m_btn_Auto.visible = !1,
                this.m_btn_Upgrade.visible = !1,
                this.m_img_RodShine.visible = !1,
                x.instance.playSound("fish1.mp3"),
                e.play(0, !1, Laya.Handler.create(null, () => {
                    this.m_img_Bar.visible = !0,
                        this.m_btn_Fish.visible = !0,
                        this.m_btn_Fish.disabled = !1,
                        this.showBarAni()
                }
                ))
        }
        showBarAni() {
            let e = this.m_img_Icon;
            this.clearTimeLine(),
                this.m_tl = new Laya.TimeLine,
                e.x = 40,
                this.m_tl.to(e, {
                    x: 310
                }, 1e3).to(e, {
                    x: 40
                }, 1e3),
                this.m_tl.play(0, !0)
        }
        doEndFish() {
            var e = this.m_Cfg.find(e => this.m_img_Icon.x > e[0]);
            if (e) {
                let t = 0 < w.fishData.eventCount;
                N.fish.reqFishing(e[3]).then(e => {
                    this.destroyed || (this.showUI(),
                        u(ht, {
                            params: [e, !1, t],
                            closeOnSide: !0
                        }),
                        this.m_btn_Fish.visible = !1,
                        this.m_img_Bar.visible = !1,
                        this.m_btn_Start.visible = !0,
                        this.checkUpGradeShow())
                }
                )
            }
        }
        onClickStart() {
            if (w.fishCoin >= +Data.gameConf.fishCfg.costCoin)
                return this.showFishAni();
            u(T, {
                closeOnSide: !0
            })
        }
        onClickFish() {
            this.m_ygSpine || (this.m_ygSpine = D.create({
                url: "cat/spine/yugan.json",
                parent: this.m_box_Ani,
                px: this.m_img_Rod.x,
                py: this.m_img_Rod.y,
                autoPlay: !1
            }));
            let e = this.m_ygSpine;
            this.m_img_Rod.visible = !1,
                e.play(1, !1, Laya.Handler.create(null, () => { }
                )),
                this.clearTimeLine(),
                this.showArea(),
                this.ani1.play(0, !1),
                this.m_btn_Fish.disabled = !0
        }
        showArea() {
            var e = this.m_Cfg.find(e => this.m_img_Icon.x > e[0]);
            e ? (this.m_box_Area.left = e[1],
                this.m_box_Area.right = e[2],
                this.m_box_Area.visible = !0) : this.m_box_Area.visible = !1
        }
        onClickInfo() {
            u(lt)
        }
        clearTimeLine() {
            this.m_tl && (this.m_tl.destroy(),
                this.m_tl = null)
        }
        addSys(t) {
            if (50 <= this.m_box_Vbox.numChildren) {
                let e = this.m_box_Vbox.removeChildAt(this.m_box_Vbox.numChildren - 1);
                e.destroy()
            }
            me(it, {}).then(e => {
                this.destroyed ? e.destroy() : (e.dataChanged(t),
                    this.m_box_Vbox.addChildAt(e, 0))
            }
            )
        }
        onClickAuto() {
            u(tt).then(e => {
                e.wait().then(t => {
                    if (t.type == r.Yes) {
                        this.isAuto = !0,
                            this.m_btn_Start.visible = !1,
                            this.m_btn_Auto.visible = !1,
                            this.m_box_Auto.visible = !0,
                            this.checkStop = !!t.data[0],
                            this.autoNumArr = [1, t.data[1]],
                            this.m_txt_Item.text = "(" + this.autoNumArr[0] + "/" + this.autoNumArr[1] + ")",
                            this.m_img_Rod.visible = !1,
                            this.m_ygSpine || (this.m_ygSpine = D.create({
                                url: "cat/spine/yugan.json",
                                parent: this.m_box_Ani,
                                px: this.m_img_Rod.x,
                                py: this.m_img_Rod.y,
                                autoPlay: !1
                            }));
                        let e = this.m_ygSpine;
                        x.instance.playSound("fish1.mp3"),
                            e.play(0, !1, Laya.Handler.create(null, () => { }
                            )),
                            this.m_btn_Upgrade.visible = !1,
                            this.m_img_RodShine.visible = !1,
                            this.doAutoFish(),
                            Laya.timer.loop(800, this, () => {
                                this.doAutoFish()
                            }
                            )
                    }
                }
                )
            }
            )
        }
        doAutoFish() {
            this.m_txt_Item.text = "(" + this.autoNumArr[0] + "/" + this.autoNumArr[1] + ")",
                this.m_img_Rod.visible = !1,
                this.m_ygSpine || (this.m_ygSpine = D.create({
                    url: "cat/spine/yugan.json",
                    parent: this.m_box_Ani,
                    px: this.m_img_Rod.x,
                    py: this.m_img_Rod.y,
                    autoPlay: !1
                }));
            let e = this.m_ygSpine;
            e.play(1, !1, Laya.Handler.create(null, () => {
                x.instance.playSound("getfish.mp3"),
                    e._index = -1,
                    this.autoNumArr[0]++;
                let t = 0 < w.fishData.eventCount;
                N.fish.reqFishing(1).then(e => {
                    this.destroyed || (this.showMyFishInfo(),
                        this.showAutoFish(e),
                        this.autoNumArr[0] > this.autoNumArr[1] ? this.onClickStop() : this.checkStop && e.myNewMax > e.myOldMax && (u(ht, {
                            params: [e, !0, t],
                            closeOnSide: !0
                        }).then(e => {
                            e.wait().then(() => {
                                this.doAutoFish(),
                                    Laya.timer.loop(1e3, this, () => {
                                        this.doAutoFish()
                                    }
                                    )
                            }
                            )
                        }
                        ),
                            Laya.timer.clearAll(this)))
                }
                )
            }
            ))
        }
        showAutoFish(e) {
            me(_t, {
                params: [e]
            }).then(e => {
                this.destroyed ? e.destroy() : (this.addChild(e),
                    e.x = 0,
                    e.y = 525,
                    e.doAniShow())
            }
            )
        }
        onClickStop() {
            this.isAuto = !1,
                this.m_btn_Start.visible = !0,
                this.m_btn_Auto.visible = !0,
                this.m_box_Auto.visible = !1,
                Laya.timer.clearAll(this),
                this.checkUpGradeShow()
        }
        onClickRank() {
            u(rt)
        }
        updateGold() {
            this.m_txt_Gold.text = v(w.gold) || "0";
            var e = w.fishCoin;
            this.m_txt_Num.text = e + "",
                this.showFishBait()
        }
        onClickPlus(e) {
            u(T, {
                closeOnSide: !0
            })
        }
        checkUpGradeShow() {
            var e = N.cat.getMyLv()
                , t = w.exdata.fishRobLvl || 0
                , t = Data.getFishRod(t + 1);
            t && e >= t.catMaxLvl ? (this.m_btn_Upgrade.scale(1, 1),
                this.m_btn_Upgrade.visible = !0,
                this.m_img_RodShine.visible = !0,
                this.ani4.play()) : (208 <= e && t ? (this.m_btn_Upgrade.gray = !0,
                    this.m_btn_Upgrade.scale(.7, .7)) : this.m_btn_Upgrade.visible = !1,
                    this.m_img_RodShine.visible = !1,
                    this.ani4.stop())
        }
        checkFomoAni() {
            var e = w.fishData && w.fishData.eventCount || 0;
            if (!(0 < e))
                return this.m_fomoSpine && (this.m_fomoSpine.destroy(),
                    this.m_fomoSpine = null),
                    this.m_eventMaxNum = 10,
                    void (this.m_pbr_Score.visible = !1);
            e > this.m_eventMaxNum && (this.m_eventMaxNum += 10 * Math.ceil((e - this.m_eventMaxNum) / 10)),
                this.m_pbr_Score.value = e / this.m_eventMaxNum,
                this.m_txt_FomoNum.text = e + "/" + this.m_eventMaxNum,
                this.m_pbr_Score.visible = !0,
                this.m_fomoSpine || (this.m_fomoSpine = D.create({
                    url: "cat/spine/fomo.json",
                    parent: this.m_box_Ani,
                    px: 50,
                    py: 450,
                    autoPlay: !1,
                    zOrder: -1
                })),
                this.m_fomoSpine.play(0, !0)
        }
        onClickUpgrade() {
            u(ut).then(e => {
                e.wait().then(() => {
                    this.destroyed || this.checkUpGradeShow()
                }
                )
            }
            )
        }
    }
    R([L(m.FISHCOIN_CHANGE)], gt.prototype, "showFishBait", null),
        R([L(m.DO_CONTINUE_FISH)], gt.prototype, "onClickStart", null),
        R([L(m.UPDATE_FISH_SYS)], gt.prototype, "addSys", null),
        R([L(m.UPDATE_ITEM)], gt.prototype, "updateGold", null),
        R([L(m.FISHDATA_CHANGE)], gt.prototype, "checkFomoAni", null);
    class pt extends e.cat.views.home.ShopDlgUI {
        constructor() {
            super(...arguments),
                this.m_mouseDown = !1,
                this.m_mouseY = 0,
                this.m_scrollDis = 0
        }
        onAwake() {
            super.onAwake(),
                (window.shop = this).updateShowView(!0),
                this.m_lst_Cat.elasticEnabled = !1
        }
        updateShowView(e = !1) {
            this.m_lst_Cat.array = new Array(Data.maxCats).fill(null),
                this.updateGold();
            var t = Data.getShopCat(N.cat.getMyLv())
                , e = (e && (N.cat.freeCat ? this.m_lst_Cat.scrollTo(Math.max(0, N.cat.freeCat - 5)) : this.m_lst_Cat.scrollTo(Math.max(0, Math.max(t.fishCoinLvl, t.goldLvl) - 5))),
                    this.m_lst_Cat.array = Object.keys(Data.Cats),
                    Data.gameConf.initCfg.openFuc.split(","))
                , t = N.cat.getMyLv();
            this.m_box_Add.visible = t >= +e[0],
                this.m_view_FishCoin.hideBg()
        }
        updateGold() {
            this.m_txt_Money.text = v(w.gold) + ""
        }
        onClickGoldPlus() {
            this.closeDialog(),
                _(gt)
        }
    }
    R([L(m.MaxCAT_CHANGE)], pt.prototype, "updateShowView", null),
        R([L(m.BUY_CAT)], pt.prototype, "updateGold", null);
    class Ct extends e.cat.views.home.SpeedDlgUI {
        constructor() {
            super(...arguments),
                this.m_speedEndTime = +w.boostEndTime,
                this.m_freeEndTime = +w.exdata.speedFreeTime,
                this.m_CEndTime = +w.exdata.SpeedChainTime,
                this.m_spineRock = null
            this.onClickFree()
            this.onDestroy()
        }
        onAwake() {
            super.onAwake(),
                this.m_spineRock || (this.m_spineRock = D.create({
                    url: "cat/spine/icon_effects_rocket.json",
                    parent: this,
                    px: 280,
                    py: 180,
                    autoPlay: !1
                })),
                this.updateView(),
                this.m_txt_Time1.text = Math.ceil(+Data.gameConf.upSpeedCfg.freeTime / 60) + "min",
                this.m_txt_Time2.text = Math.ceil(+Data.gameConf.upSpeedCfg.costTime / 60) + "min",
                this.m_txt_Time3.text = Math.ceil(+Data.gameConf.upSpeedCfg.chainTime / 60) + "min",
                this.m_txt_Cost.text = +Data.gameConf.upSpeedCfg.costFish + ""
        }
        onDestroy() {
            super.onDestroy(),
                Laya.timer.clear(this, this.endConfirm)
        }
        updateView() {
            this.m_speedEndTime = +w.boostEndTime,
                this.m_freeEndTime = +w.exdata.speedFreeTime,
                this.m_CEndTime = +w.exdata.SpeedChainTime,
                this.m_pbr_Time.value = 0,
                this.m_txt_Time.visible = !1;
            var t = 1e3 * this.m_speedEndTime - Date.newDate().getTime();
            if (0 < t ? (this.m_tick && this.m_tick.dispose(),
                this.m_pbr_Time.value = t / (1e3 * +Data.gameConf.upSpeedCfg.maxTime),
                this.m_tick = at.create(1e3 * this.m_speedEndTime, 1e3, this.m_txt_Time),
                this.m_tick.start(),
                this.m_tick.onTick = () => {
                    var e = 1e3 * this.m_speedEndTime - Date.newDate().getTime();
                    this.m_pbr_Time.value = e / (1e3 * +Data.gameConf.upSpeedCfg.maxTime)
                }
                ,
                this.m_tick.onEnd = () => {
                    this.updateView(),
                        N.event(m.UPDATE_SPEED)
                }
                ,
                this.m_txt_Time.visible = !0,
                this.m_spineRock.play(0, !0),
                this.m_spineRock.visible = !0,
                this.m_img_Rock.visible = !1) : (this.m_img_Rock.visible = !0,
                    this.m_spineRock.visible = !1),
                this.m_tickFree && this.m_tickFree.dispose(),
                1e3 * this.m_freeEndTime > Date.newDate().getTime() ? (this.m_btn_Cd.visible = !0,
                    this.m_btn_Free.visible = !1,
                    this.m_tickFree = at.create(1e3 * +this.m_freeEndTime, 1e3, this.m_txt_Cd),
                    this.m_tickFree.start(),
                    this.m_tickFree.onEnd = () => {
                        this.updateView()
                    }
                ) : (this.m_btn_Cd.visible = !1,
                    this.m_btn_Free.visible = !0),
                this.m_tickChain && this.m_tickChain.dispose(),
                1e3 * this.m_CEndTime > Date.newDate().getTime())
                this.m_btn_CCd.visible = !0,
                    this.m_btn_Chain.visible = !1,
                    this.m_btn_Wait.visible = !1,
                    this.ani1.stop(),
                    this.m_tickChain = at.create(1e3 * +this.m_CEndTime, 1e3, this.m_txt_CCd),
                    this.m_tickChain.start(),
                    this.m_tickChain.onEnd = () => {
                        this.updateView()
                    }
                    ,
                    S.removeItem(S.s_signInSpeedOrderTime);
            else {
                this.m_btn_CCd.visible = !1;
                var i, t = S.get(S.s_signInSpeedOrderTime) || 0;
                let e = 0;
                t && (t = t + 3e4,
                    i = (new Date).getTime(),
                    e = t - i),
                    e <= 0 ? (this.m_btn_Chain.visible = !0,
                        this.m_btn_Wait.visible = !1,
                        this.ani1.stop(),
                        S.removeItem(S.s_signInSpeedOrderTime)) : (this.m_btn_Chain.visible = !1,
                            this.m_btn_Wait.visible = !0,
                            this.ani1.play(0, !0),
                            Laya.timer.clear(this, this.endConfirm),
                            Laya.timer.once(e, this, this.endConfirm))
            }
        }
        endConfirm() {
            S.removeItem(S.s_signInSpeedOrderTime),
                this.updateView()
        }
        onClickFree() {
            1e3 * this.m_freeEndTime > Date.newDate().getTime() || N.cat.reqSpeed(1).then(e => {
                w.exdata.speedFreeTime = this.m_freeEndTime = +e.SpeedFreeTime,
                    w.boostEndTime = this.m_speedEndTime = +e.boostEndTime,
                    N.event(m.SPEED_FREE),
                    this.updateView()
            }
            )
        }
        onClickChain() {
            w.BCCheckIn(be.booster).then(e => {
                Mmobay.MConfig.channelId != Mmobay.MConst.CHANNEL_LOCAL && (this.m_payData = e.payData,
                    N.wallet.connected ? this.sendTransaction() : this.connectWallet())
            }
            )
        }
        onClickBuy() {
            return w.fishCoin < +Data.gameConf.upSpeedCfg.costFish ? u(T, {
                closeOnSide: !0
            }) : this.m_speedEndTime - Date.newDate().getTime() / 1e3 + 3 > +Data.gameConf.upSpeedCfg.maxTime ? g(f(1029)) : void N.cat.reqSpeed(2).then(e => {
                g(f(1033)),
                    w.boostEndTime = this.m_speedEndTime = +e.boostEndTime,
                    this.updateView()
            }
            )
        }
        connectWallet() {
            w.linkType = y.ConnectWalletForSignInSpeed,
                N.wallet.connect().then(e => {
                    Laya.timer.once(500, this, () => {
                        this.sendTransaction()
                    }
                    )
                }
                )
        }
        sendTransaction() {
            var e, t;
            this.m_payData && (w.linkType = y.CheckOrderForSignInSpeed,
                this.m_payData.amount,
                e = this.m_payData.walletAddress,
                t = this.m_payData.payload,
                N.wallet.sendTransaction(8e6, e, t).then(() => {
                    var e = (new Date).getTime();
                    S.set(S.s_signInSpeedOrderTime, e),
                        this.updateView()
                }
                ))
        }
    }
    R([L(m.UPDATE_SPEED)], Ct.prototype, "updateView", null);
    class yt extends e.cat.views.home.UpGradeDlgUI {
        constructor(e) {
            super(),
                this.cat = e
        }
        onAwake() {
            super.onAwake(),
                this.updateView(),
                x.instance.playSound("NewCat.mp3")
        }
        updateView() {
            var e = Data.getCat(this.cat);
            this.m_txt_OutPut.text = v(e.outGold) + "/s",
                this.m_view_Lv.setData(e.id);
            let t = D.create({
                url: "cat/spine/" + e.showId + ".json",
                parent: this,
                px: 257,
                py: 300,
                scale: 1,
                autoRemove: !1,
                alpha: 1
            });
            t.visible = !1,
                this.createPre(),
                this.ani1.addLabel("boom", 8),
                this.ani1.on(Laya.Event.LABEL, this, () => {
                    D.create({
                        url: "cat/spine/boom.json",
                        parent: this,
                        px: 200,
                        py: 200,
                        autoRemove: !0,
                        alpha: 1,
                        autoPlay: !0,
                        scale: 1
                    })
                }
                ),
                this.ani1.on(Laya.Event.COMPLETE, this, () => {
                    this.m_view_Lv.visible = !0,
                        N.cat.playCat(t, "happy", "pose"),
                        t.visible = !0
                }
                ),
                this.ani1.play(0, !1)
        }
        createPre() {
            var e = D.create({
                url: "cat/spine/" + Data.getCat(this.cat - 1).showId + ".json",
                parent: this.m_box_L,
                px: 50,
                py: 100,
                scale: 1,
                autoRemove: !0,
                alpha: 1
            })
                , e = (N.cat.playCat(e, "squat idle"),
                    D.create({
                        url: "cat/spine/" + Data.getCat(this.cat - 1).showId + ".json",
                        parent: this.m_box_R,
                        px: 50,
                        py: 100,
                        scale: 1,
                        autoRemove: !0,
                        alpha: 1
                    }));
            N.cat.playCat(e, "squat idle")
        }
    }
    class ft extends e.cat.views.squad.SquadBoostDlgUI {
        constructor(e) {
            super(),
                this.m_lastIndex = -1,
                this.m_clubId = 0,
                this.m_payPrice = 0,
                this.m_clubId = e
        }
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                this.m_box_Method.size(Laya.stage.width, Laya.stage.height),
                this.m_box_Method.visible = !1,
                this.updateWalletConnect(),
                N.club.reqGetRecruitListClub().then(e => {
                    this.showUI(e)
                }
                )
        }
        showUI(e) {
            e = this.checkPriceShow(e);
            this.m_lst_Price.array = e,
                this.m_lst_Price.visible = 0 < e.length,
                this.m_lst_Price.selectedIndex = 0
        }
        onDestroy() {
            super.onDestroy()
        }
        updateWalletConnect() {
            if (!N.wallet.connected)
                return this.m_btn_WalletAddress.visible = !1,
                    void (this.m_btn_Disconnect.visible = !1);
            N.wallet.getAddress().then(e => {
                var t;
                this.destroyed || (t = e.length,
                    this.m_btn_WalletAddress.visible = !0,
                    this.m_txt_WalletAddress.text = e.substring(0, 4) + "..." + e.substring(t - 4, t))
            }
            )
        }
        checkPriceShow(i) {
            var e = i.find(e => e.id == this.m_clubId)
                , s = e && e.boostVal || 0
                , a = (i = i.filter(e => e.boostVal >= +Data.gameConf.initCfg.clubMinBoost)).findIndex(e => e.id == this.m_clubId);
            let n = [];
            for (let e = 0, t = i.length; e < t; e++) {
                var o = i[e];
                if (0 == e && o.id == this.m_clubId) {
                    n.push({
                        price: 100,
                        pIndex: 0
                    });
                    break
                }
                if (15 <= e || -1 != a && e >= a)
                    break;
                0 != e && 1 != e && 2 != e && 3 != e && 4 != e && 9 != e && 14 != e || n.push({
                    price: o.boostVal - s + 1,
                    pIndex: e
                })
            }
            return -1 == a && i.length < 15 && n.push({
                price: +Data.gameConf.initCfg.clubMinBoost - s,
                pIndex: i.length
            }),
                n
        }
        onSelectPrice() {
            if (-1 != this.m_lst_Price.selectedIndex && this.m_lst_Price.selectedItem) {
                if (-1 != this.m_lastIndex) {
                    let e = this.m_lst_Price.getItem(this.m_lastIndex);
                    e.isSelect = !1,
                        this.m_lst_Price.changeItem(this.m_lastIndex, e)
                }
                let e = this.m_lst_Price.getItem(this.m_lst_Price.selectedIndex);
                e.isSelect = !0,
                    this.m_lst_Price.changeItem(this.m_lst_Price.selectedIndex, e),
                    this.m_lastIndex = this.m_lst_Price.selectedIndex,
                    this.m_lst_Price.selectedIndex = -1
            }
        }
        onClickBoost() {
            var e = this.m_lst_Price.getItem(this.m_lastIndex);
            if (e) {
                let t = this.m_payPrice = e.price;
                w.reqTonExchangeRate().then(e => {
                    this.m_txt_PriceTon.text = (+e.Usd2Ton * t).toFixed(2) + "TON",
                        this.m_txt_PriceUsd.text = "= $" + t,
                        this.m_box_Method.visible = !0,
                        this.ani1.play(0, !1)
                }
                )
            }
        }
        onClickSquad() {
            _(xt)
        }
        onClickHideMethod(e) {
            this.m_box_Method.visible = !1
        }
        onClickWalletAddress(e) {
            var t = this.m_btn_Disconnect.visible;
            this.m_btn_Disconnect.visible = !t
        }
        onClickDisconnect(e) {
            N.wallet.disconnect().then(() => {
                Laya.timer.once(100, this, () => {
                    this.updateWalletConnect()
                }
                )
            }
            )
        }
        onClickWalletPay(e) {
            this.m_payPrice && w.payClubBooster(this.m_clubId, this.m_payPrice, 1).then(e => {
                this.m_box_Method.visible = !1,
                    Mmobay.MConfig.channelId != Mmobay.MConst.CHANNEL_LOCAL && (Laya.Browser.onPC && He(),
                        Ue(e.payData.paylink))
            }
            )
        }
        onClickTonConnectPay(e) {
            this.m_payPrice && w.payClubBooster(this.m_clubId, this.m_payPrice, 2).then(e => {
                this.m_box_Method.visible = !1,
                    Mmobay.MConfig.channelId != Mmobay.MConst.CHANNEL_LOCAL && (this.m_payData = e.payData,
                        N.wallet.connected ? this.sendTransaction() : this.connectWallet())
            }
            )
        }
        connectWallet() {
            w.linkType = y.ConnectWalletForClubRecharge,
                N.wallet.connect().then(e => {
                    Laya.timer.once(500, this, () => {
                        this.sendTransaction()
                    }
                    )
                }
                )
        }
        sendTransaction() {
            var e, t, i;
            this.m_payData && (e = this.m_payData.amount,
                t = this.m_payData.walletAddress,
                i = this.m_payData.payload,
                N.wallet.sendTransaction(e, t, i).then(() => { }
                ))
        }
    }
    R([L(m.WALLET_CONNECTED)], ft.prototype, "updateWalletConnect", null);
    class vt extends e.cat.views.squad.TotalScoreDetailDlgUI {
        constructor(e) {
            super(),
                this.m_showData = null,
                this.m_showData = e
        }
        onAwake() {
            super.onAwake(),
                this.showUI()
        }
        showUI() {
            this.m_txt_Earned.text = v(this.m_showData.totalEarned),
                this.m_txt_Burned.text = "-" + v(this.m_showData.spentAndBurned),
                this.m_txt_TBalance.text = v(+this.m_showData.totalEarned - +this.m_showData.spentAndBurned)
        }
        onDestroy() {
            super.onDestroy()
        }
        onClickOk() {
            this.closeDialog()
        }
    }
    class bt extends e.cat.views.squad.TotalScoreShowDlgUI {
        constructor() {
            super(...arguments),
                this.m_showData = null
        }
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                N.club.reqGetStats().then(e => {
                    this.m_showData = e,
                        this.showUI()
                }
                )
        }
        showUI() {
            this.m_txt_Total.text = v(+this.m_showData.totalEarned - +this.m_showData.spentAndBurned),
                this.m_txt_TPlayers.text = Be(this.m_showData.totalPlayers || 0),
                this.m_txt_DailyNum.text = Be(this.m_showData.dailyUsers || 0),
                this.m_txt_NumOl.text = Be(this.m_showData.online || 0),
                this.m_txt_NumPrem.text = Be(this.m_showData.premiumPlayers || 0);
            var i = N.club.getRandomIco(12);
            for (let t = 0; t < 12; t++) {
                let e = this["m_view_Head" + t];
                e && e.setHeadShow({
                    isCircle: !0,
                    icoUrl: i[t],
                    borderLvl: 5
                })
            }
        }
        onDestroy() {
            super.onDestroy()
        }
        onClickDetailTxt() {
            this.m_showData && u(vt, {
                params: [this.m_showData],
                closeOnSide: !0
            })
        }
        onClickInvite() {
            w.doInviteAction()
        }
    }
    class kt extends e.cat.views.squad.RankCellViewUI {
        dataChanged(e, t) {
            t ? this.dataSource = t : t = this.dataSource;
            var i, s = t.rankData;
            this.m_img_Rank.visible = +s.rank <= 3,
                +s.rank <= 3 && (this.m_img_Rank.skin = `cat/ui_rank/img_ranking_number_${+s.rank}.png`),
                this.m_txt_Rank.visible = 3 < +s.rank,
                this.m_txt_Rank.text = s.rank + "",
                this.m_txt_Name.text = s.name,
                this.m_img_Score.visible = !0,
                this.m_txt_Score.text = v(s.score) || "0",
                this.m_txt_Score.color = 2 == t.league ? "#ffffff" : "#cccccc",
                this.m_view_Head.setHeadShow({
                    isCircle: !0,
                    icoUrl: s.ico,
                    uname: s.name,
                    borderLvl: t.league
                }),
                this.m_img_tri.visible = s.isClubList;
            let a = 0;
            a = s.isClubList ? (i = s.id == (N.club.clubInfo && N.club.clubInfo.id),
                this.m_txt_Desc.text = i ? "Your" : "",
                this.m_txt_Name.width = i ? 185 : 240) : (i = s.id == w.id,
                    this.m_txt_Desc.text = i ? "You" : "",
                    this.m_txt_Name.width = i ? 185 : 240),
                this.m_txt_Name._tf.lines.toString() != this.m_txt_Name.text ? (this.m_txt_Over.right = a - this.m_txt_Name._tf.textWidth - 30 + 3,
                    this.m_txt_Over.visible = !0) : this.m_txt_Over.visible = !1,
                this.m_img_Line.skin = `cat/ui_rank/line${t.league}.png`,
                this.m_img_BarBg.visible = !!t.isSelf,
                this.m_img_BarBg.skin = `cat/ui_rank/border2${t.league}.png`
        }
    }
    kt.CheckFlagNum = 0;
    class St extends e.cat.views.squad.SquadRankListDlgUI {
        constructor(e = 0, t = !1) {
            super(),
                this.m_listType = 0,
                this.m_listTypeP = 0,
                this.m_league = 0,
                this.m_selfLeague = 0,
                this.m_selfRankGold = 0,
                this.m_selfIndex = -1,
                this.m_cellPool = [],
                this.m_cellDataList = [],
                this.m_cellCheck = {},
                this.m_headShowed = !1,
                this.m_txtColorCfg = {
                    0: ["#D5a281", "#cd6f32"],
                    1: ["#8a91b1", "#5f6eaf"],
                    2: ["#f0be2e", "#e89300"],
                    3: ["#8595cd", "#323e72"],
                    4: ["#69b2ea", "#1082d9"],
                    5: ["#c5a7ff", "#7a33c1"],
                    6: ["#c5a7ff", "#8454d4"]
                },
                this.m_league = e,
                this.m_selfLeague = w.rankLeague,
                this.m_selfRankGold = +w.rankGold,
                this.m_listTypeP = t ? 1 : 0
        }
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                this.m_txt_No.visible = !0,
                this.m_pan_Con.vScrollBar.on(Laya.Event.CHANGE, this, this.onScrollChange),
                this.changeLeagueShow(),
                this.changeStatusShow()
        }
        onDestroy() {
            super.onDestroy(),
                this.removePool()
        }
        onClickStats() {
            _(bt)
        }
        onClickLeft() {
            0 != this.m_league && (this.m_league--,
                this.changeLeagueShow())
        }
        onClickRight() {
            6 != this.m_league && (this.m_league++,
                this.changeLeagueShow())
        }
        changeLeagueShow() {
            this.m_img_AdaptBg.skin = `cat/ui_bg/${this.changeImgUrl()}.png`,
                this.m_img_Level.skin = `cat/ui_notpack/cup_${this.changeImgUrl()}.png`,
                this.m_img_BorderBg2.skin = this.m_img_BorderBg3.skin = `cat/ui_rank/border${this.changeImgUrl()}.png`,
                this.m_img_Line.skin = `cat/ui_rank/line${this.changeImgUrl()}.png`,
                this.m_img_BarBg.skin = "cat/ui_rank/border10.png",
                this.m_img_Left.disabled = 0 == this.m_league,
                this.m_img_Right.disabled = 6 == this.m_league,
                this.m_img_Left.alpha = 0 == this.m_league ? .7 : 1,
                this.m_img_Right.alpha = 6 == this.m_league ? .7 : 1;
            var e = Data.gameConf.initCfg.minerLeagues.split(",")
                , t = Data.gameConf.initCfg.clubLeagues.split(",")
                , i = (this.m_txt_Level.text = f(1006, f(Ae[this.m_league])),
                    this.getRankList(),
                    N.club.clubInfo && N.club.clubInfo.league || -1)
                , s = N.club.clubInfo && N.club.clubInfo.rankGold;
            let a = 0;
            0 == this.m_listTypeP ? (a = this.m_selfLeague,
                this.onClickPersonal()) : (a = i,
                    this.onClickSquad()),
                this.m_league == a ? (this.m_txt_Tips.visible = !1,
                    this.m_box_ScoreBar.visible = !0,
                    this.m_pbr_Score.skin = `cat/ui_notpack/process${this.changeImgUrl()}.png`,
                    0 == this.m_listTypeP ? (this.m_txt_Score.text = v(this.m_selfRankGold) + "/" + v(+e[this.m_league + 1] || 0),
                        this.m_pbr_Score.value = this.m_selfRankGold / +e[this.m_league + 1] || 0) : (this.m_txt_Score.text = v(s) + "/" + v(+t[this.m_league + 1] || 0),
                            this.m_pbr_Score.value = +s / +t[this.m_league + 1] || 0)) : (0 == this.m_listTypeP ? this.m_txt_Tips.text = f(1005, v(+e[this.m_league])) : this.m_txt_Tips.text = f(1005, v(+t[this.m_league])),
                                this.m_txt_Tips.visible = !0,
                                this.m_box_ScoreBar.visible = !1),
                0 == this.m_listType ? (this.m_txt_Day.color = this.m_txtColorCfg[this.m_league][1],
                    this.m_txt_Week.color = this.m_txtColorCfg[this.m_league][0]) : (this.m_txt_Week.color = this.m_txtColorCfg[this.m_league][1],
                        this.m_txt_Day.color = this.m_txtColorCfg[this.m_league][0]),
                0 == this.m_listTypeP ? (this.m_txt_Personal.color = this.m_txtColorCfg[this.m_league][1],
                    this.m_txt_Squad.color = this.m_txtColorCfg[this.m_league][0]) : (this.m_txt_Squad.color = this.m_txtColorCfg[this.m_league][1],
                        this.m_txt_Personal.color = this.m_txtColorCfg[this.m_league][0]),
                this.m_txt_Score.color = this.m_txt_Tips.color = 2 == this.m_league ? "#ffffff" : "#cccccc",
                this.resetShowHeadView()
        }
        changeStatusShow() {
            N.club.reqGetStats().then(e => {
                this.m_headShowed = !0,
                    this.m_txt_TotalPlayers.text = Be(e.totalPlayers) + " Catizens";
                var i = N.club.getRandomIco(3);
                for (let t = 0; t < 3; t++) {
                    let e = this["m_view_Head" + t];
                    e && e.setHeadShow({
                        isCircle: !0,
                        icoUrl: i[t],
                        borderLvl: this.changeImgUrl()
                    })
                }
            }
            )
        }
        resetShowHeadView() {
            if (this.m_headShowed)
                for (let i = 0; i < 3; i++) {
                    let e = this["m_view_Head" + i]
                        , t = e.m_data;
                    e && (t.borderLvl = this.m_league,
                        e.setHeadShow(t))
                }
        }
        onClickDay() {
            Laya.Tween.to(this.m_img_BarBg2, {
                x: 9
            }, 200),
                0 != this.m_listType && (this.m_listType = 0,
                    this.changeLeagueShow())
        }
        onClickWeek() {
            Laya.Tween.to(this.m_img_BarBg2, {
                x: 247
            }, 200),
                1 != this.m_listType && (this.m_listType = 1,
                    this.changeLeagueShow())
        }
        onClickPersonal() {
            Laya.Tween.to(this.m_img_BarBg, {
                x: 24
            }, 200),
                0 != this.m_listTypeP && (this.m_listTypeP = 0,
                    this.changeLeagueShow())
        }
        onClickSquad() {
            Laya.Tween.to(this.m_img_BarBg, {
                x: 262
            }, 200),
                1 != this.m_listTypeP && (this.m_listTypeP = 1,
                    this.changeLeagueShow())
        }
        onClickRankCell(e) {
            0 != this.m_listTypeP && e.target.dataSource && (e = e.target.dataSource,
                _(wt, {
                    params: [e.rankData.id]
                }))
        }
        getRankList() {
            0 == this.m_listTypeP ? N.club.reqGetGoldRankList(this.m_league, this.m_listType).then(e => {
                let i = [];
                if (e.rankList.forEach(e => {
                    i.push({
                        rankData: {
                            rank: +e.rank,
                            ico: e.icon + "",
                            isClubList: !1,
                            name: e.name,
                            id: e.userId,
                            score: +e.score
                        },
                        league: this.changeImgUrl()
                    })
                }
                ),
                    this.reSetListCon(),
                    this.m_cellDataList = i,
                    this.m_box_ListCon.visible = 0 < i.length,
                    this.m_box_ListCon.height = 94 * i.length,
                    this.onScrollChange(),
                    this.m_txt_No.visible = 0 == i.length,
                    this.m_box_Bottom.height = Math.max(this.m_box_ListCon.y + this.m_box_ListCon.height + 20, 400),
                    e.myInfo) {
                    let t = {
                        rankData: {
                            id: e.myInfo.userId,
                            score: +e.myInfo.score,
                            rank: +e.myInfo.rank,
                            ico: e.myInfo.icon + "",
                            isClubList: !1,
                            name: e.myInfo.name
                        },
                        league: this.changeImgUrl(),
                        isSelf: !0
                    };
                    this.m_view_Self.dataChanged(null, t),
                        this.m_view_Self.visible = !0,
                        this.m_selfIndex = i.findIndex(e => e.rankData.id == t.rankData.id),
                        3 < this.m_selfIndex || this.m_selfIndex < 0 ? (this.m_view_Self.visible = !0,
                            this.m_pan_Con.height = 1026,
                            this.m_img_BorderBg3.bottom = -94) : 0 <= this.m_selfIndex && (this.m_view_Self.visible = !1,
                                this.m_pan_Con.height = 1120,
                                this.m_img_BorderBg3.bottom = 0)
                } else
                    this.m_selfIndex = -1,
                        this.m_view_Self.visible = !1,
                        this.m_pan_Con.height = 1120,
                        this.m_img_BorderBg3.bottom = 0;
                this.m_pan_Con.refresh()
            }
            ) : 1 == this.m_listTypeP && (this.m_view_Self.visible = !1,
                N.club.reqGetClubGoldRankList(this.m_league, this.m_listType).then(e => {
                    if (!this.destroyed) {
                        let i = [];
                        if (e.rankList.forEach(e => {
                            i.push({
                                rankData: {
                                    rank: +e.rank,
                                    ico: e.icon + "",
                                    isClubList: !0,
                                    name: e.name,
                                    id: e.id,
                                    score: +e.score
                                },
                                league: this.changeImgUrl()
                            })
                        }
                        ),
                            this.reSetListCon(),
                            this.m_cellDataList = i,
                            this.m_box_ListCon.visible = 0 < i.length,
                            this.m_box_ListCon.height = 94 * i.length,
                            this.onScrollChange(),
                            this.m_txt_No.visible = 0 == i.length,
                            this.m_box_Bottom.height = Math.max(this.m_box_ListCon.y + this.m_box_ListCon.height + 20, 400),
                            e.myRank) {
                            let t = {
                                rankData: {
                                    id: e.myRank.id,
                                    score: +e.myRank.score,
                                    rank: +e.myRank.rank,
                                    ico: e.myRank.icon + "",
                                    isClubList: !0,
                                    name: e.myRank.name
                                },
                                league: this.changeImgUrl(),
                                isSelf: !0
                            };
                            this.m_view_Self.dataChanged(null, t),
                                this.m_view_Self.visible = !0,
                                this.m_selfIndex = i.findIndex(e => e.rankData.id == t.rankData.id),
                                3 < this.m_selfIndex || this.m_selfIndex < 0 ? (this.m_view_Self.visible = !0,
                                    this.m_pan_Con.height = 1026,
                                    this.m_img_BorderBg3.bottom = -94) : 0 <= this.m_selfIndex && (this.m_view_Self.visible = !1,
                                        this.m_pan_Con.height = 1120,
                                        this.m_img_BorderBg3.bottom = 0)
                        } else
                            this.m_selfIndex = -1,
                                this.m_view_Self.visible = !1,
                                this.m_pan_Con.height = 1120,
                                this.m_img_BorderBg3.bottom = 0;
                        this.m_pan_Con.refresh()
                    }
                }
                ))
        }
        showSelfView(e) {
            this.m_view_Self.dataChanged(null, e)
        }
        onScrollChange() {
            var e = this.m_pan_Con.vScrollBar.value;
            this.checkCellViewShow(e),
                this.m_selfIndex < 4 || (e > 112 + 94 * (this.m_selfIndex - 4) ? (this.m_view_Self.visible = !1,
                    this.m_pan_Con.height = 1120,
                    this.m_img_BorderBg3.bottom = 0) : (this.m_view_Self.visible = !0,
                        this.m_pan_Con.height = 1026,
                        this.m_img_BorderBg3.bottom = -94))
        }
        checkCellViewShow(e) {
            var t = Math.floor(e / 94);
            for (let e = t - 10; e < t + 10; e++)
                this.createCell(e)
        }
        createCell(e) {
            var t = this.m_cellDataList;
            t[e] && !this.m_cellCheck[e] && (this.m_cellCheck[e] = 1,
                this.getCellView(t[e], e))
        }
        getCellView(t, i) {
            let e = this.m_cellPool.shift();
            e ? (e.dataChanged(i, t),
                e.y = 94 * i,
                this.m_box_ListCon.addChild(e)) : me(kt, {}).then(e => {
                    this.destroyed ? e.destroy() : (e.dataChanged(i, t),
                        e.y = 94 * i,
                        this.m_box_ListCon.addChild(e))
                }
                )
        }
        removePool() {
            this.m_cellPool.forEach(e => {
                e.destroy()
            }
            ),
                this.m_cellPool.length = 0
        }
        reSetListCon() {
            for (let e = this.m_box_ListCon.numChildren - 1; 0 <= e; e--) {
                var t = this.m_box_ListCon.removeChildAt(e);
                this.m_cellPool.push(t)
            }
            for (var e in this.m_cellCheck)
                delete this.m_cellCheck[e];
            this.m_cellCheck = {}
        }
        changeImgUrl() {
            return 5 == this.m_league || 6 == this.m_league ? this.m_league + 1 : this.m_league
        }
    }
    class wt extends e.cat.views.squad.SquadInfoDlgUI {
        constructor(e = 0) {
            super(),
                this.m_clubId = 0,
                this.m_listType = 0,
                this.m_clubData = null,
                this.m_cellPool = [],
                this.m_cellDataList = [],
                this.m_cellCheck = {},
                this.m_txtColorCfg = {
                    0: ["#D5a281", "#cd6f32"],
                    1: ["#8a91b1", "#5f6eaf"],
                    2: ["#f0be2e", "#e89300"],
                    3: ["#8595cd", "#323e72"],
                    4: ["#69b2ea", "#1082d9"],
                    5: ["#c5a7ff", "#7a33c1"],
                    6: ["#c5a7ff", "#8454d4"]
                },
                this.m_clubId = e
        }
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                this.m_txt_No.visible = !0,
                this.m_pan_Con.vScrollBar.on(Laya.Event.CHANGE, this, this.onScrollChange),
                this.getClubInfoShow()
        }
        getClubInfoShow() {
            N.club.reqClubInfo(this.m_clubId).then(e => {
                this.m_clubData = e.club,
                    this.showUI(e.club)
            }
            )
        }
        showUI(e) {
            this.m_img_AdaptBg.skin = `cat/ui_bg/${this.changeImgUrl(e.league)}.png`,
                this.m_img_BoxBg.skin = this.m_img_Border1.skin = `cat/ui_rank/border${this.changeImgUrl(e.league)}.png`,
                this.m_img_Line.skin = `cat/ui_rank/line${this.changeImgUrl(e.league)}.png`,
                this.m_img_SLine.skin = `cat/ui_rank/line${this.changeImgUrl(e.league)}.png`,
                N.club.clubInfo && N.club.clubInfo.id == this.m_clubId ? (this.m_btn_Invite.visible = this.m_btn_Leave.visible = this.m_btn_Boost.visible = !0,
                    this.m_btn_Join.visible = !1,
                    this.m_txt_Desc.text = this.showSquadTxtByNum(e.population),
                    this.m_txt_Desc.visible = !0,
                    this.m_box_Con.y = 523,
                    this.m_box_Con.height = 404,
                    this.m_btn_Boost2.visible = !1,
                    this.m_btn_Boost.visible = !0) : (this.m_btn_Invite.visible = this.m_btn_Leave.visible = !1,
                        this.m_btn_Join.visible = this.m_btn_Boost.visible = !0,
                        this.m_txt_Desc.visible = !1,
                        this.m_box_Con.y = 390,
                        this.m_box_Con.height = 306,
                        this.m_btn_Boost.visible = !1,
                        this.m_btn_Boost2.visible = !0),
                this.m_box_ListCon.y = this.m_box_Con.y + this.m_box_Con.height + 24,
                this.m_img_Cup.skin = `cat/ui_notpack/cup${this.changeImgUrl(e.league)}.png`,
                this.m_txt_Level.text = f(Ae[e.league]),
                this.m_view_Head.setHeadShow({
                    isCircle: !1,
                    uname: e.name,
                    icoUrl: e.icon + "",
                    borderLvl: this.changeImgUrl(e.league)
                }),
                this.m_txt_MemberNum.text = e.population + "";
            let t = e.name;
            var i, s;
            this.m_txt_Name.text = t,
                300 < this.m_txt_Name.width && (i = t.length,
                    s = Math.ceil((this.m_txt_Name.width - 300) / 20),
                    this.m_txt_Name.text = t.slice(0, (i - s) / 2) + "..." + t.slice(i - (i - s) / 2)),
                this.m_txt_Score.text = v(e.rankGold),
                this.getRankList()
        }
        onClickInvite() {
            w.doInviteAction()
        }
        onClickLeave() {
            _e({
                button: $.YesNo,
                msg: f(1030, this.m_clubData.name),
                title: f(1034),
                okTxt: f(1035)
            }).then(e => {
                e.type == r.Yes && N.club.reqQuitClub().then(() => {
                    this.getClubInfoShow()
                }
                )
            }
            )
        }
        onClickBoost() {
            _(ft, {
                params: [this.m_clubId]
            })
        }
        onClickLeague() {
            this.m_clubData && _(St, {
                params: [this.m_clubData.league, !0]
            })
        }
        onClickJoin() {
            this.m_btn_Join.disabled = !0,
                N.club.reqJoinClub(this.m_clubId).then(e => {
                    this.showUI(e.club),
                        this.m_btn_Join.disabled = !1
                }
                )
        }
        changeTxtColor() {
            0 == this.m_listType ? (this.m_txt_Day.color = this.m_txtColorCfg[this.m_clubData.league][1],
                this.m_txt_Week.color = this.m_txtColorCfg[this.m_clubData.league][0]) : (this.m_txt_Week.color = this.m_txtColorCfg[this.m_clubData.league][1],
                    this.m_txt_Day.color = this.m_txtColorCfg[this.m_clubData.league][0])
        }
        onClickDay() {
            0 != this.m_listType && (this.m_listType = 0,
                Laya.Tween.to(this.m_img_BarBg, {
                    x: 8
                }, 200),
                this.getRankList())
        }
        onClickWeek() {
            1 != this.m_listType && (this.m_listType = 1,
                Laya.Tween.to(this.m_img_BarBg, {
                    x: 244
                }, 200),
                this.getRankList())
        }
        getRankList() {
            this.changeTxtColor(),
                N.club.reqClubMemberRank(this.m_clubId, this.m_listType).then(e => {
                    let t = [];
                    e.rankList.forEach(e => {
                        t.push({
                            rankData: {
                                rank: +e.rank,
                                ico: e.icon + "",
                                isClubList: !1,
                                name: e.name,
                                score: +e.score,
                                id: e.userId
                            },
                            league: this.m_clubData.league
                        })
                    }
                    ),
                        this.m_cellDataList = t,
                        this.reSetListCon();
                    e = t.length;
                    this.m_txt_No.visible = 0 == e,
                        this.m_box_SquadCon.height = 94 * e,
                        this.m_box_ListCon.height = Math.max(this.m_box_SquadCon.y + 94 * e + 20, 380),
                        this.onScrollChange()
                }
                )
        }
        onClickShare() {
            var e = this.m_clubData.groupId;
            w.toSquadChat(e)
        }
        onDestroy() {
            super.onDestroy(),
                this.removePool()
        }
        showSquadTxtByNum(t) {
            var e = [[1e4, 0, 1007], [3e3, 1e4, 1008], [700, 3e3, 1009], [300, 700, 1010], [100, 300, 1011], [30, 100, 1012], [15, 30, 1013], [11, 15, 1014], [0, 11, 1015]];
            return f(e.find(e => {
                if (+e[0] <= t && (!e[1] || t < +e[1]))
                    return !0
            }
            )[2]) || f(e[8][2])
        }
        onScrollChange() {
            var e = this.m_pan_Con.vScrollBar.value;
            this.checkCellViewShow(e)
        }
        checkCellViewShow(e) {
            var t = Math.floor(e / 94);
            for (let e = t - 10; e < t + 10; e++)
                this.createCell(e)
        }
        createCell(e) {
            var t = this.m_cellDataList;
            t[e] && !this.m_cellCheck[e] && (this.m_cellCheck[e] = 1,
                this.getCellView(t[e], e))
        }
        getCellView(t, i) {
            let e = this.m_cellPool.shift();
            e ? (e.dataChanged(i, t),
                e.y = 94 * i,
                this.m_box_SquadCon.addChild(e)) : me(kt, {}).then(e => {
                    this.destroyed ? e.destroy() : (e.dataChanged(i, t),
                        e.y = 94 * i,
                        this.m_box_SquadCon.addChild(e))
                }
                )
        }
        removePool() {
            this.m_cellPool.forEach(e => {
                e.destroy()
            }
            ),
                this.m_cellPool.length = 0
        }
        reSetListCon() {
            for (let e = this.m_box_SquadCon.numChildren - 1; 0 <= e; e--) {
                var t = this.m_box_SquadCon.removeChildAt(e);
                this.m_cellPool.push(t)
            }
            for (var e in this.m_cellCheck)
                delete this.m_cellCheck[e];
            this.m_cellCheck = {}
        }
        changeImgUrl(e) {
            return 5 == e || 6 == e ? e + 1 : e
        }
    }
    class xt extends e.cat.views.squad.JoinSquadListDlgUI {
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                this.m_lst_Squad.visible = !1,
                N.club.reqGetRecruitListClub().then(e => {
                    this.m_lst_Squad.array = e,
                        this.m_lst_Squad.visible = !0
                }
                )
        }
        onDestroy() {
            super.onDestroy(),
                Laya.timer.clearAll(this)
        }
        onSelectSquad() {
            var e;
            -1 != this.m_lst_Squad.selectedIndex && (e = this.m_lst_Squad.getItem(this.m_lst_Squad.selectedIndex)) && (this.m_lst_Squad.selectedIndex = -1,
                _(wt, {
                    params: [e.id]
                }))
        }
        onClickOtherSquad() {
            w.doCreateClubAction()
        }
    }
    class Rt extends e.cat.views.squad.InviteDetailShowDlgUI {
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                this.showUI()
        }
        onDestroy() {
            super.onDestroy()
        }
        showUI() {
            var s = Data.gameConf.initCfg.inviterNormalGolds.split(",")
                , a = Data.gameConf.initCfg.inviterPremiumGolds.split(",");
            for (let i = 0; i < s.length; i++) {
                let e = this["m_txt_inviteB" + i]
                    , t = this["m_txt_inviteP" + i];
                e && (e.text = "+" + s[i]),
                    t && (t.text = "+" + a[i])
            }
        }
        onClickInvite() {
            w.doInviteAction()
        }
        onClickDetails() {
            w.toPremiumTg()
        }
    }
    class Lt extends e.cat.views.squad.InvitePartyKingsDlgUI {
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                N.invite.reqInviteRankList().then(e => {
                    this.showUI(e)
                }
                )
        }
        onDestroy() {
            super.onDestroy()
        }
        showUI(e) {
            this.m_lst_User.array = e.rankList
        }
        onClickInvite() {
            w.doInviteAction()
        }
    }
    class Dt extends e.cat.views.squad.FriendCellViewUI {
        dataChanged(e, t) {
            t ? this.dataSource = t : t = this.dataSource,
                this.m_txt_AddScore.text = "+" + v(t.income),
                this.m_txt_Score.text = v(t.rankGold),
                this.m_txt_Name.text = t.name,
                this.m_txt_Level.text = f(Ae[t.league]),
                this.m_img_Cup.skin = `cat/ui_notpack/cup${t.league}.png`;
            var i = this.m_txt_Name.width;
            this.m_txt_Name._tf.lines.toString() != this.m_txt_Name.text ? (this.m_txt_Over.right = i - this.m_txt_Name._tf.textWidth - 25 + 3,
                this.m_txt_Over.visible = !0) : this.m_txt_Over.visible = !1,
                this.m_view_Head.setHeadShow({
                    isCircle: !0,
                    icoUrl: t.icon + "",
                    uname: t.name,
                    borderLvl: 5
                })
        }
    }
    class Tt extends e.cat.views.squad.FrenZoneDlgUI {
        constructor() {
            super(...arguments),
                this.m_cellPool = [],
                this.m_cellDataList = [],
                this.m_cellCheck = {}
        }
        onAwake() {
            super.onAwake(),
                this.addTitle(),
                this.m_pan_Con.vScrollBar.on(Laya.Event.CHANGE, this, this.onScrollChange),
                N.invite.reqFrensInfo().then(e => {
                    this.showUI(e)
                }
                )
        }
        onDestroy() {
            super.onDestroy(),
                this.removePool()
        }
        showUI(e) {
            this.m_cellDataList = e.friendList;
            var t = e.friendList.length
                , t = (this.onScrollChange(),
                    0 < e.inviteCount && (this.m_txt_Title.text = 1 == t ? f(1031) : f(1032, e.inviteCount)),
                    this.m_img_NoFriend.visible = t <= 0,
                    this.m_box_ListCon.height = 150 * t,
                    0 == t ? this.m_box_Friend.height = 200 : (1 < t ? (this.m_box_Friend.height = 150 * t + 185,
                        this.m_img_ConBg.bottom = 85) : this.m_box_Friend.height = 200,
                        this.m_pan_Con.refresh()),
                    Data.gameConf.initCfg.inviterNormalGolds.split(","))
                , i = Data.gameConf.initCfg.inviterPremiumGolds.split(",");
            this.m_txt_inviteBase0.text = "+" + t[0],
                this.m_txt_invitePr0.text = "+" + i[0],
                this.m_txt_Total.text = "+" + v(e.fishCoin)
        }
        onClickTopLeaders(e) {
            _(Lt)
        }
        onClickDetails() {
            _(Rt)
        }
        onClickInvite() {
            w.doInviteAction()
        }
        onScrollChange() {
            var e = this.m_pan_Con.vScrollBar.value;
            this.checkCellViewShow(e)
        }
        checkCellViewShow(e) {
            var t = Math.floor(e / 150);
            for (let e = t - 10; e < t + 10; e++)
                this.createCell(e)
        }
        createCell(e) {
            var t = this.m_cellDataList;
            t[e] && !this.m_cellCheck[e] && (this.m_cellCheck[e] = 1,
                this.getCellView(t[e], e))
        }
        getCellView(t, i) {
            let e = this.m_cellPool.shift();
            e ? (e.dataChanged(i, t),
                e.y = 150 * i,
                this.m_box_ListCon.addChild(e)) : me(Dt, {}).then(e => {
                    this.destroyed ? e.destroy() : (e.dataChanged(i, t),
                        e.y = 150 * i,
                        this.m_box_ListCon.addChild(e))
                }
                )
        }
        removePool() {
            this.m_cellPool.forEach(e => {
                e.destroy()
            }
            ),
                this.m_cellPool.length = 0
        }
        reSetListCon() {
            for (let e = this.m_box_ListCon.numChildren - 1; 0 <= e; e--) {
                var t = this.m_box_ListCon.removeChildAt(e);
                this.m_cellPool.push(t)
            }
            for (var e in this.m_cellCheck)
                delete this.m_cellCheck[e];
            this.m_cellCheck = {}
        }
    }
    class Et extends e.cat.views.home.OffLineDlgUI {
        constructor(e) {
            super(),
                this.m_off = e
            this.onClickFree()
        }
        onAwake() {
            super.onAwake(),
                this.updateView()
        }
        updateView() {
            this.m_txt_Price.text = this.m_off,
                this.m_txt_FishCoin.text = Data.gameConf.offLineCfg.costFish,
                w.exdata.maxCatLvl < 10 && (this.m_img_R.visible = this.m_btn_Get.visible = !1,
                    this.m_img_L.centerX = this.m_btn_Free.centerX = .5)
        }
        onClickFree() {
            N.cat.reqOff(0).then(() => {
                this.closeDialog()
            }
            )
        }
        onClickGet() {
            if (w.fishCoin < +Data.gameConf.offLineCfg.costFish)
                return u(T, {
                    closeOnSide: !0
                });
            N.cat.reqOff(1).then(() => {
                this.closeDialog()
            }
            )
        }
    }
    class It extends e.cat.views.common.FingerViewUI {
    }
    class At extends e.cat.views.home.FirstRechargeDlgUI {
        constructor() {
            super(...arguments),
                this.m_goodId = 1001
        }
        onAwake() {
            super.onAwake(),
                this.m_box_Method.size(Laya.stage.width, Laya.stage.height),
                this.m_box_Method.visible = !1,
                this.updateWalletConnect(),
                this.showUI()
        }
        onDestroy() {
            super.onDestroy(),
                Laya.timer.clear(this, this.endConfirm)
        }
        showUI() {
            var e, t = Data.getGoods(1001), t = (this.m_txt_Gold.text = Be(+t.gold),
                this.m_txt_FishCoin.text = Be(t.fishCoin),
                this.m_btn_Buy.label = "$" + t.price,
                S.get(S.s_firstRechargeOrderTime) || 0);
            let i = 0;
            t && (t = t + 3e4,
                e = (new Date).getTime(),
                i = t - e),
                i <= 0 ? (this.m_btn_Buy.visible = !0,
                    this.m_btn_Wait.visible = !1,
                    this.ani3.stop(),
                    S.removeItem(S.s_firstRechargeOrderTime)) : (this.m_btn_Buy.visible = !1,
                        this.m_btn_Wait.visible = !0,
                        this.ani3.play(0, !0),
                        Laya.timer.clear(this, this.endConfirm),
                        Laya.timer.once(i, this, this.endConfirm))
        }
        endConfirm() {
            S.removeItem(S.s_firstRechargeOrderTime),
                this.showUI()
        }
        doClose() {
            this.closeDialog()
        }
        updateWalletConnect() {
            if (!N.wallet.connected)
                return this.m_btn_WalletAddress.visible = !1,
                    void (this.m_btn_Disconnect.visible = !1);
            N.wallet.getAddress().then(e => {
                var t;
                this.destroyed || (t = e.length,
                    this.m_btn_WalletAddress.visible = !0,
                    this.m_txt_WalletAddress.text = e.substring(0, 4) + "..." + e.substring(t - 4, t))
            }
            )
        }
        onClickBuy(e) {
            let t = Data.getGoods(1001);
            w.requestPrePay(this.m_goodId).then(e => {
                this.m_txt_PriceTon.text = e.tonPrice + "TON",
                    this.m_txt_PriceUsd.text = "= $" + t.price,
                    this.m_box_Method.visible = !0,
                    this.ani1.play(0, !1)
            }
            )
        }
        onClickHideMethod(e) {
            this.m_box_Method.visible = !1
        }
        onClickWalletAddress(e) {
            var t = this.m_btn_Disconnect.visible;
            this.m_btn_Disconnect.visible = !t
        }
        onClickDisconnect(e) {
            N.wallet.disconnect().then(() => {
                Laya.timer.once(100, this, () => {
                    this.updateWalletConnect()
                }
                )
            }
            )
        }
        onClickWalletPay(e) {
            w.requestPay(this.m_goodId, 1).then(e => {
                this.m_box_Method.visible = !1,
                    Mmobay.MConfig.channelId != Mmobay.MConst.CHANNEL_LOCAL && (Laya.Browser.onPC && He(),
                        Ue(e.payData.paylink),
                        this.showPayProcessing(3e3))
            }
            )
        }
        onClickTonConnectPay(e) {
            w.requestPay(this.m_goodId, 2).then(e => {
                this.m_box_Method.visible = !1,
                    Mmobay.MConfig.channelId != Mmobay.MConst.CHANNEL_LOCAL && (this.m_payData = e.payData,
                        N.wallet.connected ? this.sendTransaction() : this.connectWallet())
            }
            )
        }
        connectWallet() {
            w.linkType = y.ConnectWalletForFirstRecharge,
                N.wallet.connect().then(e => {
                    Laya.timer.once(500, this, () => {
                        this.sendTransaction()
                    }
                    )
                }
                )
        }
        sendTransaction() {
            var e, t, i;
            this.m_payData && (w.linkType = y.CheckOrderForFirstRecharge,
                e = this.m_payData.amount,
                t = this.m_payData.walletAddress,
                i = this.m_payData.payload,
                N.wallet.sendTransaction(e, t, i).then(() => {
                    var e = (new Date).getTime();
                    S.set(S.s_firstRechargeOrderTime, e),
                        this.showUI(),
                        this.showPayProcessing()
                }
                ))
        }
        showPayProcessing(e = 100) {
            Laya.timer.once(e, this, () => {
                this.destroyed || u(dt, {
                    retainPopup: !0
                })
            }
            )
        }
    }
    R([L(m.RECHARGE_SUCCESS)], At.prototype, "doClose", null),
        R([L(m.WALLET_CONNECTED)], At.prototype, "updateWalletConnect", null);
    class E extends e.cat.views.home.RandomEventsDlgUI {
        constructor(e, t = !1) {
            super(),
                this.m_spine = null,
                this.m_spineStr = "",
                this.m_backFromChain = !1,
                this.m_spineStr = e,
                this.m_backFromChain = t

                if(w.fishCoin > +Data.gameConf.randomEventCfg.costFish){
                    this.onClickBuy()
                }else
                    this.onClickFree()
        }
        onAwake() {
            super.onAwake();
            var e = w.randomEvent;
            e && (this.m_spine || (this.m_spine = D.create({
                url: "cat/spine/" + this.m_spineStr + ".json",
                parent: this.m_box_Spine,
                px: 50,
                py: 150,
                autoPlay: !1
            }),
                e.type == Te.multiple ? (this.m_spine.play(2, !0),
                    this.m_txt_Middle.text = f(1041),
                    this.m_txt_Right.text = f(1040)) : (this.m_spine.play(3, !0),
                        this.m_txt_Middle.text = f(1043),
                        this.m_txt_Right.text = f(1042))),
                e.type == Te.multiple ? (e = Data.gameConf.randomEventCfg.multipleTimes.split(","),
                    this.m_txt_Time1.text = Math.ceil(+e[0] / 60) + "min",
                    this.m_txt_Time2.text = Math.ceil(+e[2] / 60) + "min",
                    this.m_txt_Time3.text = Math.ceil(+e[1] / 60) + "min") : (e = Data.gameConf.randomEventCfg.boxNums.split(","),
                        this.m_txt_Time1.text = "+" + e[0],
                        this.m_txt_Time2.text = "+" + e[2],
                        this.m_txt_Time3.text = "+" + e[1]),
                this.m_txt_Cost.text = +Data.gameConf.randomEventCfg.costFish + "",
                this.m_backFromChain ? (E.ChainFlag = !0,
                    this.m_btn_Chain.disabled = this.m_btn_Buy.disabled = this.m_btn_Free.disabled = !0,
                    this.m_txt_Time3.visible = !1,
                    this.m_img_Wait.visible = !0,
                    this.ani1.play(),
                    E.ChainFlag = !0) : E.ChainFlag = !1)
        }
        onClickFree() {
            w.reqGetRandomEventAward(De.free).then(e => {
                this.closeDialog(r.Yes)
            }
            )
        }
        onClickChain() {
            w.BCCheckIn(be.randomEvent).then(e => {
                if (Mmobay.MConfig.channelId == Mmobay.MConst.CHANNEL_LOCAL)
                    return this.m_btn_Chain.disabled = this.m_btn_Buy.disabled = this.m_btn_Free.disabled = !0,
                        this.m_txt_Time3.visible = !1,
                        this.m_img_Wait.visible = !0,
                        this.ani1.play(),
                        void (E.ChainFlag = !0);
                this.m_payData = e.payData,
                    N.wallet.connected ? this.sendTransaction() : (this.m_btn_Chain.disabled = this.m_btn_Buy.disabled = this.m_btn_Free.disabled = !0,
                        this.m_txt_Time3.visible = !1,
                        this.m_img_Wait.visible = !0,
                        this.ani1.play(),
                        E.ChainFlag = !0,
                        this.connectWallet())
            }
            )
        }
        onClickBuy() {
            w.fishCoin < +Data.gameConf.randomEventCfg.costFish ? u(T, {
                closeOnSide: !0
            }) : w.reqGetRandomEventAward(De.fishCoin).then(e => {
                this.closeDialog(r.Yes)
            }
            )
        }
        connectWallet() {
            w.linkType = y.ConnectWalletForSignInEvent,
                N.wallet.connect().then(e => {
                    Laya.timer.once(500, this, () => {
                        this.sendTransaction()
                    }
                    )
                }
                )
        }
        sendTransaction() {
            var e, t;
            this.m_payData && (this.m_payData.amount,
                e = this.m_payData.walletAddress,
                t = this.m_payData.payload,
                N.wallet.sendTransaction(8e6, e, t).then(() => {
                    this.m_btn_Chain.disabled = this.m_btn_Buy.disabled = this.m_btn_Free.disabled = !0,
                        this.m_txt_Time3.visible = !1,
                        this.m_img_Wait.visible = !0,
                        this.ani1.play(),
                        E.ChainFlag = !0
                }
                ))
        }
        doClose() {
            this.closeDialog(r.Yes)
        }
    }
    E.ChainFlag = !1,
        R([L(m.RANDOM_EVENT_TIME_CHANGE)], E.prototype, "doClose", null);
    class Mt extends e.cat.views.home.AutoDlgUI {
        onAwake() {
            super.onAwake(),
                this.m_txt_Now.text = Data.gameConf.initCfg.autoCost
        }
        onClickBuy() {
            if (w.fishCoin < +Data.gameConf.initCfg.autoCost)
                return u(T, {
                    closeOnSide: !0
                });
            N.cat.reqBuyAuto().then(() => {
                g(f(1033)),
                    this.closeDialog()
            }
            )
        }
    }
    class I extends e.cat.views.home.OfficeDlgUI {
        constructor() {
            super(...arguments),
                this.catSpines = [],
                this.m_spineRock = null,
                this.m_spineRandom = null,
                this.m_randomShowed = !1,
                this.m_customScaleFlag = 50,
                this.m_speedScale = 4,
                this.m_speedFlag = !1,
                this.m_isCustoming = !1,
                this.m_isCustoming2 = !1,
                this.customingCatSpines = [],
                this.m_speedCustomNum = 0,
                this.m_speedTemp = [],
                this.m_speedPeople = [],
                this.m_airDrops = {},
                this.m_mouseCat = -1,
                this.count = 0,
                this.m_checkTime = 0
        }
        onAwake() {
            super.onAwake(),
                (window.off = this).hitTestPrior = !1,
                this.updateBg(),
                Laya.timer.clearAll(this),
                this.checkNew(),
                this.checkOpenMenu(),
                this.checkFreeBoostRed(),
                this.updateView(),
                this.updateOutPut(),
                this.updateGold(),
                this.updateShopRed(),
                this.checkTaskRed(),
                this.checkOffLine(),
                this.checkLink(),
                this.checkSoundImgShow(),
                this.updateRechargeShow(),
                this.checkShowRandomEvent(),
                this.onClickAuto(),
                this.checkGoldRain(),
                w.checkRandomBox(),
                this.updateAuto(),
                this.checkCustom(),
                Laya.timer.loop(2e3, this, this.checkCreateTip),
                Laya.timer.loop(5e3, this, this.checkFreeCat);
            var e = Mmobay.adaptOffsetWidth;
            this.m_box_Squad.x = 270 + e / 3,
                this.m_btn_ReCharge.x = 6 - e / 2 * (2 / 3),
                this.m_btn_Speed.x = 107 - e / 2 * (1 / 3),
                this.m_btn_Shop.x = 360 + e / 2 * (1 / 3),
                this.m_btn_Invite.x = 461 + e / 2 * (2 / 3),
                x.instance.playMusic("BGM_Cafe.mp3"),
                this.m_box_Rank.on(Laya.Event.CLICK, this, () => {
                    this.onClickRank()
                }
                );
            for (let t = 0; t < N.cat.cats.length; t++) {
                let e = N.cat.cats[t];
                e && Laya.timer.frameOnce(t % 2 + 1, this, () => {
                    this.createIndexCat(t, e)
                }
                )
            }
            Laya.timer.frameLoop(2, this, () => {
                for (let t = 0; t < this.m_box_Con.numChildren; t++) {
                    let e = this.m_box_Con.getChildAt(t);
                    "people" == e.name && (this.m_isCustoming2,
                        e.zOrder = e.y),
                        e && (e.zOrder = e.y)
                }
            }
            ),
                Laya.timer.once(1e4, this, this.findCustomCat),
                this.updateClubShow(),
                this.updateRankShow(),
                this.updateSpeed(),
                Laya.timer.once(2e3, this, () => {
                    this.checkCatSpeed()
                }
                ),
                this.on(Laya.Event.MOUSE_DOWN, this, this.clearSumTip),
                Laya.timer.loop(5e3, this, this.checkSum),
                this.m_randomShowed || Laya.timer.loop(5e3, this, this.checkShowRandomEvent),
                N.cat.isAuto && Laya.timer.frameOnce(12, this, () => {
                    this.buyAuto()
                }
                )
        }
        updateBg(e) {
            let t = N.club.getLeagueByScore(+w.rankGold);
            if (5 <= (t = (t = e ? e : t) < 0 ? 6 : t)) {
                this.m_img_Wall.skin = `cat/ui_bg/wall${t + 1}.png`,
                    this.m_img_Hall.skin = `cat/ui_bg/office${t + 1}.png`,
                    this.m_img_Bg.skin = `cat/ui_bg/office${t + 1}_1.png`,
                    this.m_img_Door.visible = this.m_img_Door2.visible = !1;
                let e = this["rank" + t];
                e.play(0, !1)
            } else
                this.m_img_Wall.skin = "cat/ui_bg/wall1.png",
                    this.m_img_Hall.skin = "cat/ui_bg/office1.png",
                    this.m_img_Bg.skin = "cat/ui_bg/office1_1.png",
                    this.m_img_Door.visible = this.m_img_Door2.visible = !0,
                    this.rank1.play(0, !1)
        }
        checkLink() {
            if (w.linkType == y.Recharge || w.linkType == y.ConnectWalletForBuyFishRecharge)
                u(T);
            else {
                var e;
                if (w.linkType != y.ConnectWalletForClubRecharge)
                    return w.linkType == y.ConnectWalletForSignInEvent ? (e = ["duck", "pepe", "doge"][Math.randRange(0, 2)],
                        this.m_randomShowed = !0,
                        void u(E, {
                            params: [e, !0]
                        }).then(e => {
                            e.wait().then(e => {
                                e.type != r.No && e.type != r.None || E.ChainFlag || w.reqGetRandomEventAward(De.close),
                                    this.m_randomShowed = !1,
                                    Laya.timer.loop(5e3, this, this.checkShowRandomEvent)
                            }
                            )
                        }
                        )) : void (w.linkType == y.ConnectWalletForSignInSpeed ? u(Ct) : w.linkType == y.ConnectWalletForFirstRecharge && u(At));
                this.onClickSquad()
            }
        }
        checkCreateTip() {
            4 <= N.cat.getMyLv() || 4 <= this.count || this.m_finger && this.m_finger.visible ? Laya.timer.clear(this, this.checkCreateTip) : this.getSumIndex().length || (this.m_finger ? (this.count++,
                this.m_finger.visible = !0) : (this.count++,
                    me(It, {
                        params: []
                    }).then(e => {
                        this.addChild(e),
                            e.centerX = +e.width / 2,
                            (this.m_finger = e).y = this.m_btn_Generate.y + e.height - 67
                    }
                    )))
        }
        clearSumTip() {
            this.m_img_SumTip.visible = !1,
                Laya.Tween.clearAll(this.m_img_SumTip),
                Laya.timer.loop(5e3, this, this.checkSum)
        }
        checkOffLine() {
            w.offLine && w.offLine.length && (u(Et, {
                params: [w.offLine]
            }),
                w.offLine = 0)
        }
        onDestroy() {
            super.onDestroy(),
                Laya.timer.clearAll(this)
        }
        updateGold() {
            this.m_txt_Gold.text = v(w.gold),
                this.updateCoinBgSize()
        }
        updateCoinBgSize() {
            this.m_img_SpeedBg.width = this.m_txt_Speed.width + 22;
            let e = Math.max(this.m_txt_Gold.width, 93) + 32;
            Laya.timer.callLater(this, () => {
                this.m_img_CoinBg.width = this.m_img_SpeedBg.width + 10 + e + 10 + 50,
                    Laya.timer.callLater(this, () => {
                        this.m_box_Plus.x = this.m_img_CoinBg.x + this.m_txt_Gold.x + this.m_txt_Gold.width + 4
                    }
                    )
            }
            )
        }
        updateOutPut(e = !1) {
            this.updateFuc(),
                this.checkOpenMenu(),
                e || (e = N.cat.nowGenerateCat,
                    this.m_txt_Lv.text = e + "",
                    !this.m_nowCatSpine || this.m_nowCatSpine.destroyed ? (this.m_nowCatSpine = D.create({
                        url: "cat/spine/" + Data.getCat(e).showId + ".json",
                        parent: this,
                        px: 75,
                        py: 60,
                        scale: .7,
                        autoRemove: !1,
                        alpha: 1
                    }),
                        N.cat.playCat(this.m_nowCatSpine, "squat idle"),
                        this.m_btn_Generate.addChildAt(this.m_nowCatSpine, 0)) : +this.m_nowCatSpine.name != e && (this.m_nowCatSpine.destroy(),
                            this.m_nowCatSpine = D.create({
                                url: "cat/spine/" + Data.getCat(e).showId + ".json",
                                parent: this,
                                px: 75,
                                py: 64,
                                scale: .7,
                                autoRemove: !1,
                                alpha: 1
                            }),
                            N.cat.playCat(this.m_nowCatSpine, "squat idle"),
                            this.m_btn_Generate.addChildAt(this.m_nowCatSpine, 1)),
                    this.m_txt_Price.text = v(N.cat.getNowPrice()) + "",
                    this.m_txt_Speed.text = v(N.cat.getOutPutSpeed()) + "/s",
                    this.updateCoinBgSize())
        }
        onClickPlus() {
            _(gt).then(e => {
                e.wait().then(() => {
                    this.destroyed || this.checkGoldRain()
                }
                )
            }
            )
        }
        updateView() {
            this.updateCat()
        }
        updateCat() {
            this.m_lst_Cat.array = N.cat.getCats()
        }
        checkShowRandomEvent() {
            if (!this.m_randomShowed) {
                var e = w.randomEvent
                    , t = N.cat.getMyLv()
                    , t = Data.getRandomEvent(t)
                    , i = Date.newDate().getTime()
                    , s = e && 1e3 * +e.time || 0;
                if (t && !this.m_spineRandom)
                    if (e) {
                        if (e.isDone && i - s > 1e3 * t.interval)
                            w.reqRandomEvent().then(() => {
                                this.checkShowRandomEvent()
                            }
                            );
                        else if (!e.isDone)
                            if (!e.isDone && i - s > 1e3 * t.interval + 1e3)
                                w.reqRandomEvent().then(() => {
                                    this.checkShowRandomEvent()
                                }
                                );
                            else if (e.isDone || !(i - s > 1e3 * +Data.gameConf.randomEventCfg.disappearTime)) {
                                let e = ["duck", "pepe", "doge"][Math.randRange(0, 2)]
                                    , t = D.create({
                                        url: "cat/spine/" + e + ".json",
                                        px: Math.randRange(50, 500),
                                        py: Math.randRange(40, 400),
                                        scale: .6,
                                        autoPlay: !0,
                                        autoRemove: !1,
                                        alpha: 1,
                                        zOrder: 1,
                                        offset: [-50, -200]
                                    });
                                this.m_box_Con.addChild(t),
                                    (this.m_spineRandom = t).size(200, 300),
                                    t.pivot(100, 250),
                                    //Auto Event Click
                                    this.clearRandomSpine(),
                                    Laya.timer.clear(this, this.checkShowRandomEvent),
                                    u(E, {
                                        params: [e]
                                    }).then(e => {
                                        e.wait().then(e => {
                                            e.type != r.No && e.type != r.None || E.ChainFlag || w.reqGetRandomEventAward(De.close),
                                                Laya.timer.loop(5e3, this, this.checkShowRandomEvent)
                                        }
                                        )
                                    }
                                    )
                                    ,
                                    this.doRandomSpineAni(),
                                    Laya.timer.once(1e4, this, () => {
                                        me(It, {
                                            params: []
                                        }).then(e => {
                                            t.destroyed ? e.destroy() : (t.addChild(e),
                                                e.centerX = +e.width / 2,
                                                e.y = 150)
                                        }
                                        )
                                    }
                                    )
                            }
                    } else
                        w.reqRandomEvent().then(() => {
                            this.checkShowRandomEvent()
                        }
                        )
            }
        }
        doRandomSpineAni() {
            let s = this.m_spineRandom;
            if (s) {
                var a = w.randomEvent
                    , n = Date.newDate().getTime()
                    , o = a && 1e3 * +a.time || 0;
                let t = !1
                    , e = (!a.isDone && n - o > 1e3 * +Data.gameConf.randomEventCfg.disappearTime && (t = !0),
                        0)
                    , i = 0;
                i = (e = t ? .5 < Math.random() ? Math.randRange(-80, -20) : Math.randRange(580, 640) : Math.randRange(50, 520),
                    Math.randRange(50, 400)),
                    e > s.x ? s.scaleX = -1 * Math.abs(s.scaleX) : s.scaleX = +Math.abs(s.scaleX),
                    s.play(0, !0);
                a = Fe(e, i, s.x, s.y);
                Laya.Tween.to(s, {
                    x: e,
                    y: i
                }, a / .1 * 2 / (this.m_speedFlag ? this.m_speedScale : 1), null, Laya.Handler.create(this, e => {
                    t ? (N.cat.isAuto && w.reqGetRandomEventAward(De.free),
                        this.clearRandomSpine()) : s.play(1, !1, Laya.Handler.create(this, () => {
                            this.doRandomSpineAni()
                        }
                        ))
                }
                ))
            }
        }
        clearRandomSpine() {
            this.m_spineRandom && (Laya.Tween.clearAll(this.m_spineRandom),
                this.m_spineRandom.destroy(),
                this.m_spineRandom = null)
        }
        onClickFish() {
            _(gt).then(e => {
                e.wait().then(() => {
                    this.destroyed || this.checkGoldRain()
                }
                )
            }
            )
        }
        updateRechargeShow() { }
        onClickReCharge() {
            u(w.checkFirstReCharge() ? T : At)
        }
        onClickSquad() {
            N.club.clubInfo ? _(wt, {
                params: [N.club.clubInfo.id]
            }) : _(xt)
        }
        onClickGenerate() {
            let t = -1;
            for (let e = 0; e < 12; e++)
                if (!N.cat.cats[e]) {
                    t = e;
                    break
                }
            return -1 == t ? g(f(1027)) : w.gold < N.cat.getCatCost(N.cat.nowGenerateCat) ? g(f(168)) : void N.cat.reqCreate()
        }
        refreshOutPut() {
            this.aniOutChange.play(0, !1),
                this.m_txt_Speed.text = v(N.cat.getOutPutSpeed()) + "/s",
                this.updateCoinBgSize()
        }
        buyCat(e) {
            this.m_finger && (this.m_finger.visible = !1),
                Laya.timer.loop(2e3, this, this.checkCreateTip),
                this.m_lst_Cat.changeItem(e.index, e.catLvl),
                this.createIndexCat(e.index, e.catLvl),
                this.m_txt_Price.text = v(N.cat.getNowPrice()) + ""
        }
        createIndexCat(e, t = N.cat.nowGenerateCat) {
            this.m_lst_Cat.changeItem(e, t),
                this.catSpines[e] && (this.catSpines[e].destroy(),
                    this.catSpines[e] = null);
            let i = .6;
            var s = Data.getCat(t)
                , s = +s.oldShowId || +s.showId;
            200 <= s ? i = .66 : s < 100 && (i = .55);
            let a = this.catSpines[e] = D.create({
                url: "cat/spine/" + Data.getCat(t).showId + ".json",
                px: Math.randRange(50, 500),
                py: Math.randRange(40, 400),
                scale: i,
                autoPlay: !0,
                autoRemove: !1,
                alpha: 1,
                zOrder: 1
            });
            this.m_box_Con.addChild(a),
                a.name = t + "",
                !a.skeleton || a.destroyed ? a._templet.once(Laya.Event.COMPLETE, this, () => {
                    this.catAniStep(Math.floor(4 * Math.random()), a, e)
                }
                ) : this.catAniStep(Math.floor(4 * Math.random()), a, e)
        }
        catAniStep(t, i, s) {
            //Fix me 3
            return;
            if (!i.destroyed && i._templet)
                if (this.m_isCustoming)
                    N.cat.playCat(i, "squat idle");
                else {
                    i._index = -1;
                    let e = 0;
                    switch (t) {
                        case 0:
                            e = i.getAniIndexByName("pose"),
                                .5 < Math.random() ? i.play(e, !1, Laya.Handler.create(this, () => {
                                    this.catAniStep(1, i, s)
                                }
                                )) : this.catAniStep(1, i, s);
                            break;
                        case 1:
                            0 < Math.random() ? (e = i.getAniIndexByName("tongue"),
                                i.play(e, !1, Laya.Handler.create(this, () => {
                                    this.catAniStep(2, i, s)
                                }
                                ))) : (e = i.getAniIndexByName("squat"),
                                    i.play(e, !1, Laya.Handler.create(this, () => {
                                        e = .5 < Math.random() ? i.getAniIndexByName("squat idle") : i.getAniIndexByName("squat idle2"),
                                            i.play(e, !1, Laya.Handler.create(this, () => {
                                                this.catAniStep(2, i, s)
                                            }
                                            ))
                                    }
                                    )));
                            break;
                        case 2:
                            var a = [["stretch"], ["walk"], ["walk"], ["walk"], ["run"], ["run"], ["break"], ["walk", "fall", "fall idle"], ["walk", "sleep", "stretch"], ["walk", "hungry", "stretch"], ["run", "fall", "fall idle"], ["fall", "run"]]
                                , a = a[Math.randRange(0, a.length - 1)];
                            this.catAniStepEx(i, a, 0, s);
                            break;
                        case 3:
                            .5 < Math.random() ? (e = i.getAniIndexByName("tongue"),
                                i.play(e, !1, Laya.Handler.create(this, () => {
                                    this.catAniStep(0, i, s)
                                }
                                ))) : (e = i.getAniIndexByName("squat"),
                                    i.play(e, !1, Laya.Handler.create(this, () => {
                                        e = .5 < Math.random() ? i.getAniIndexByName("squat idle") : i.getAniIndexByName("squat idle2"),
                                            i.play(e, !1, Laya.Handler.create(this, () => {
                                                this.catAniStep(0, i, s)
                                            }
                                            ))
                                    }
                                    )))
                    }
                }
        }
        catAniStepEx(t, i, s, a) {
            //Fix me 3
            return;
            if (this.m_isCustoming)
                N.cat.playCat(t, "squat idle");
            else if (i[s])
                if (t._index = -1,
                    "run" == i[s] || "walk" == i[s]) {
                    var n = this.doCatMovePos(t)
                        , o = Fe(n.x, n.y, t.x, t.y);
                    let e = 0;
                    e = "run" == i[s] ? o / .2 * 2 : o / .1 * 2,
                        n.x > t.x ? t.scaleX = -1 * Math.abs(t.scaleX) : t.scaleX = +Math.abs(t.scaleX);
                    o = t.getAniIndexByName(i[s]);
                    t.play(o, !0),
                        s++,
                        Laya.Tween.to(t, {
                            x: n.x,
                            y: n.y
                        }, e / (this.m_speedFlag ? this.m_speedScale : 1), null, Laya.Handler.create(this, e => {
                            this.catAniStepEx(t, i, e, a)
                        }
                            , [s]))
                } else {
                    o = t.getAniIndexByName(i[s]);
                    "sleep" == i[s] || "hungry" == i[s] ? (Laya.timer.once(3e3, t, () => {
                        t && !t.destroyed && (s++,
                            this.catAniStepEx(t, i, s, a))
                    }
                    ),
                        t.play(o, !0)) : t.play(o, !1, Laya.Handler.create(this, () => {
                            s++,
                                this.catAniStepEx(t, i, s, a)
                        }
                        ))
                }
            else
                this.catAniStep(3, t, a)
        }
        doCatMovePos(e) {
            let t = {
                x: 0,
                y: 0
            };
            return t.x = Math.randRange(50, 520),
                t.y = Math.randRange(50, 400),
                t
        }
        onClickSpeed() {
            u(Ct)
        }
        updateSpeed() {
            this.speedTicker && this.speedTicker.dispose(),
                N.cat.checkIsBoost() ? (this.speedTicker = at.create(1e3 * w.boostEndTime, 1e3, this.m_txt_Time),
                    this.speedTicker.start(),
                    this.speedTicker.onEnd = () => {
                        N.event(m.UPDATE_SPEED),
                            this.m_spineRock && (this.m_spineRock.destroy(),
                                this.m_spineRock = null)
                    }
                    ,
                    this.m_spineRock || (this.m_spineRock = D.create({
                        url: "cat/spine/icon_effects_rocket.json",
                        parent: this.m_btn_Speed,
                        px: 46,
                        py: 15,
                        autoPlay: !1,
                        scale: .5
                    }),
                        this.m_spineRock.play(0, !0)),
                    this.m_img_Rock.visible = !1) : (this.m_txt_Time.text = "Boost",
                        this.m_img_Rock.visible = !0,
                        this.m_spineRock && (this.m_spineRock.destroy(),
                            this.m_spineRock = null)),
                this.checkCatSpeed()
        }
        checkCatSpeed() {
            for (var e of this.catSpines)
                e && e._skeleton && e._skeleton.playbackRate(N.cat.checkIsBoost() ? this.m_speedScale : 1)
        }
        onClickShop() {
            u(pt)
        }
        moveCat(i) {
            if (!this.destroyed) {
                let e = .5;
                var s, a = Data.getCat(i.catId);
                210 < a.id ? (s = +a.oldShowId,
                    e = 200 <= s ? .5 : 100 <= s ? .45 : .38) : 200 <= +a.showId && (e = .4),
                    this.m_tempCat = D.create({
                        url: "cat/spine/" + a.showId + ".json",
                        parent: this.m_box_Temp,
                        px: 70,
                        py: 130,
                        scale: e,
                        autoPlay: !1,
                        autoRemove: !1,
                        alpha: 1
                    }),
                    !this.m_tempCat.skeleton || this.m_tempCat.destroyed ? this.m_tempCat._templet.once(Laya.Event.COMPLETE, this, () => {
                        N.cat.playCat(this.m_tempCat, "walk")
                    }
                    ) : N.cat.playCat(this.m_tempCat, "walk");
                let t = this.m_lst_Cat.getCell(i.index);
                this.m_lst_Cat.once(Laya.Event.MOUSE_DOWN, this, e => {
                    !N.cat.airDropMap[i.index] && N.cat.cats[i.index] && (this.m_mouseCat = i.index,
                        e = Laya.Point.TEMP.setTo(e.stageX, e.stageY),
                        e = this.m_lst_Cat.globalToLocal(e),
                        this.m_box_Temp.x = e.x,
                        this.m_box_Temp.y = e.y,
                        t.visible = !1,
                        this.m_box_Temp.visible = !0,
                        this.m_img_SumTip.visible = !1,
                        N.event(m.CAT_MATCH, i.catId),
                        this.showDelete(!0))
                }
                ),
                    this.m_lst_Cat.on(Laya.Event.MOUSE_MOVE, this, e => {
                        e = Laya.Point.TEMP.setTo(e.stageX, e.stageY),
                            e = this.m_lst_Cat.globalToLocal(e);
                        this.m_box_Temp.x = e.x,
                            this.m_box_Temp.y = e.y
                    }
                    ),
                    this.m_lst_Cat.once(Laya.Event.MOUSE_UP, this, e => {
                        this.m_mouseCat = -1,
                            this.m_box_Temp.visible && (this.m_box_Temp.visible = !1),
                            this.m_tempCat && this.m_tempCat.destroy(),
                            this.m_tempCat = null,
                            this.m_lst_Cat.offAll(),
                            N.event(m.CAT_MATCH),
                            N.cat.airDropMap[i.index] || !N.cat.cats[i.index] ? this.showDelete(!1) : (t.visible = !0,
                                i.catId != Data.maxCats && this.checkChangeCell(i, i.index, e),
                                this.checkDel(i.index))
                    }
                    ),
                    this.m_lst_Cat.once(Laya.Event.MOUSE_OUT, this, () => {
                        this.m_mouseCat = -1,
                            this.m_box_Temp.visible && (this.m_box_Temp.visible = !1),
                            this.m_tempCat && this.m_tempCat.destroy(),
                            this.m_tempCat = null,
                            this.m_lst_Cat.offAll(),
                            N.event(m.CAT_MATCH),
                            this.showDelete(!1),
                            i && N.cat.cats[i.index] && (t.visible = !0,
                                N.event(m.SHAKE_CAT, !0))
                    }
                    )
            }
        }
        checkDel(t) {
            this.mouseX > this.m_btn_Delete.x && this.mouseX < this.m_btn_Delete.width + this.m_btn_Delete.x && this.mouseY > this.m_btn_Delete.y && this.mouseY < this.m_btn_Delete.height + this.m_btn_Delete.y ? _e({
                button: $.YesNo,
                msg: f(1044)
            }).then(e => {
                e.type == r.Yes && N.cat.cats[t] ? N.cat.reqDelCat(t).then(() => {
                    this.m_isCustoming ? this.customingCatSpines.push(this.catSpines[t]) : (this.catSpines[t]._templet.offAll(),
                        this.catSpines[t] && this.catSpines[t].destroy()),
                        this.catSpines[t] = null,
                        this.m_lst_Cat.changeItem(t, null);
                    let e = D.create({
                        url: "cat/spine/smoke.json",
                        parent: this,
                        px: this.m_btn_Delete.x + this.m_btn_Delete.width / 2,
                        py: this.m_btn_Delete.y,
                        autoRemove: !0
                    });
                    this.m_img_Del.visible = !1,
                        x.instance.playSound("Delete.mp3"),
                        this.showDelete(!1),
                        e.play(0, !1),
                        w.checkRandomBox()
                }
                ) : (this.m_img_Del.visible = !1,
                    this.showDelete(!1))
            }
            ) : this.showDelete(!1)
        }
        showDelete(e) {
            (this.m_btn_Delete.visible = e) ? (this.ani5.play(0, !0),
                this.m_img_Del.visible = !0) : this.ani5.stop(),
                this.m_btn_Generate.visible = this.m_btn_ReCharge.visible = this.m_btn_Invite.visible = this.m_btn_Shop.visible = this.m_btn_Speed.visible = !e;
            var e = Data.gameConf.initCfg.openFuc.split(",")
                , t = N.cat.getMyLv();
            this.m_btn_Auto.visible = this.m_btn_Generate.visible && t >= +e[2]
        }
        checkChangeCell(a, n, e) {
            if (et("checkMouse", 500)) {
                var t = this.m_lst_Cat.cells;
                for (let s = 0; s < t.length; s++) {
                    let i = t[s];
                    if (1 != N.cat.airDropMap[s] && (s != n && i.hitTestPoint(e.stageX, e.stageY))) {
                        if (!i.dataSource || a.catId && i.dataSource != a.catId) {
                            this.m_lst_Cat.changeItem(n, i.dataSource),
                                this.m_lst_Cat.changeItem(s, a.catId),
                                N.cat.reqSwitch([n, s]).then(() => { }
                                );
                            var o = this.catSpines[n];
                            this.catSpines[n] = this.catSpines[s],
                                this.catSpines[s] = o,
                                N.event(m.SHAKE_CAT, !0),
                                N.cat.cats = this.m_lst_Cat.array
                        } else {
                            let t = N.cat.getMyLv();
                            N.cat.reqSumCat([n, s]).then(e => {
                                -1 != this.m_mouseCat && N.event(m.CAT_MATCH, [this.m_mouseCat]),
                                    Laya.timer.loop(2e3, this, this.checkCreateTip),
                                    t != N.cat.getMyLv() ? u(yt, {
                                        params: [N.cat.getMyLv()]
                                    }) : i.playSumAni(e[s]),
                                    this.m_lst_Cat.changeItem(n, null),
                                    this.m_isCustoming ? this.customingCatSpines.push(this.catSpines[s], this.catSpines[n]) : (this.catSpines[n] && (this.catSpines[n]._templet.offAll(),
                                        this.catSpines[n].destroy()),
                                        this.catSpines[s] && (this.catSpines[s]._templet.offAll(),
                                            this.catSpines[s].destroy())),
                                    this.catSpines[s] = null,
                                    this.catSpines[n] = null,
                                    this.createIndexCat(s, a.catId + 1),
                                    i.dataSource = e[s],
                                    this.m_lst_Cat.changeItem(s, i.dataSource),
                                    N.cat.cats[s] = i.dataSource,
                                    N.cat.cats[n] = null,
                                    this.refreshOutPut(),
                                    Date.newDate().getTime() / 1e3 - N.cat.airDropTime > +Data.gameConf.initCfg.airdropCatTime + 1 && 11 == N.cat.cats.filter(e => !!e).length && (N.cat.reqGetAirDropCat(),
                                        Laya.timer.loop(1e3 * +Data.gameConf.initCfg.airdropCatTime + 1e3, N.cat, N.cat.reqGetAirDropCat)),
                                    w.checkRandomBox()
                            }
                            )
                        }
                        return
                    }
                }
                N.event(m.SHAKE_CAT, !0)
            }
        }
        onClickRank() {
            _(St, {
                params: [w.rankLeague]
            }).then(e => {
                e.wait().then(() => {
                    this.updateRankShow()
                }
                )
            }
            )
        }
        onClickInvite() {
            _(Tt)
        }
        updateClubShow() {
            if (this.m_box_HasSquad.visible = !!N.club.clubInfo,
                this.m_box_NoSquad.visible = !N.club.clubInfo,
                N.club.clubInfo) {
                let e = N.club.clubInfo.name;
                this.m_txt_Squad.text = e;
                var t = this.m_txt_Squad._tf.lines.toString().length;
                e.length > t && (this.m_txt_Squad.text = e.slice(0, 4) + "..." + e.slice(e.length - 3)),
                    this.m_txt_SquadScore.text = v(N.club.clubInfo.rankGold),
                    this.m_txt_League.text = f(Ae[N.club.clubInfo.league]),
                    this.m_img_Cup.skin = `cat/ui_notpack/cup${this.changeImgUrl(N.club.clubInfo.league)}.png`
            }
        }
        updateRankShow() {
            N.club.reqGetMyRank().then(e => {
                this.m_txt_SelfLeague.text = f(Ae[e.league]),
                    this.m_img_RankCup.skin = `cat/ui_notpack/cup${this.changeImgUrl(e.league)}.png`,
                    this.m_txt_SelfLeague.y,
                    this.m_txt_SelfRank.visible = !0,
                    e.rank ? 1 == e.rank ? this.m_txt_SelfRank.text = e.rank + "st" : 2 == e.rank ? this.m_txt_SelfRank.text = e.rank + "nd" : 3 == e.rank ? this.m_txt_SelfRank.text = e.rank + "rd" : this.m_txt_SelfRank.text = e.rank + "th" : this.m_txt_SelfRank.text = ""
            }
            )
        }
        showGoldAni(e = 0, t) {
            x.instance.playSound("CatGem.mp3"),
                Ge("cat/ui_item/coin.png", 16, {
                    x: 280,
                    y: 300
                }, {
                    x: this.m_img_Gold.localToGlobal(Laya.Point.TEMP.setTo(0, 0)).x + 40 - Mmobay.adaptOffsetWidth / 2,
                    y: 580
                }, () => {
                    this.updateGold(),
                        this.aniGold.play(0, !1)
                }
                    , this)
        }
        findCustomCat() {
            this.catSpines.find(e => !!e && !e.destroyed) ? (this.m_speedFlag = N.cat.checkIsBoost(),
                this.boostCustom()) : Laya.timer.once(1e4, this, this.findCustomCat)
        }
        stopCat(i) {
            for (let e = 0; e < this.catSpines.length; e++) {
                let t = this.catSpines[e];
                var s, a;
                t && this.catSpines[i] && (Laya.Tween.clearAll(t),
                    Laya.timer.clearAll(t),
                    e != i && (s = [this.catSpines[i].x + Math.randRange(-80, 60), this.catSpines[i].y + Math.randRange(1, 50)],
                        a = Fe(t.x, t.y, s[0], s[1]),
                        t.x > s[0] ? t.scaleX = Math.abs(t.scaleX) : t.scaleX = -Math.abs(t.scaleX),
                        Laya.Tween.to(t, {
                            x: s[0],
                            y: s[1]
                        }, a / .2 * 2 / (this.m_speedFlag ? this.m_speedScale : 1) * (Math.random() / 2 + .5), null, Laya.Handler.create(this, e => {
                            t.scaleX = Math.abs(t.scaleX),
                                N.cat.playCat(t, "squat idle")
                        }
                        )),
                        N.cat.playCat(t, "run")))
            }
        }
        randomPeople(s, a) {
            //fix me 3
            return;
            var e, t, i = s, n = a, o = Math.randRange(1, 3);
            for (e of ["left_shoe", "right_shoe"]) {
                var r = i.getSlotByName(e);
                i.replaceSlotSkinName(e, r.currDisplayData.name, n + "/shoe_0" + o)
            }
            h = s,
                m = a,
                d = Math.randRange(1, 3),
                c = h.getSlotByName("eyes"),
                h.replaceSlotSkinName("eye", c.currDisplayData.name, m + "/eye_0" + d);
            var l, h = s, c = a, m = Math.randRange(1, 3), d = "hair", _ = ("female" == c && .5 < Math.random() ? (t = h.getSlotByName("hair_long"),
                h.replaceSlotSkinName("hair_long", t.currDisplayData ? t.currDisplayData.name : "", "female/hair_long_0" + m)) : (t = h.getSlotByName(d),
                    h.replaceSlotSkinName(d, t.currDisplayData ? t.currDisplayData.name : "", c + "/hair_0" + m)),
                h = s,
                d = a,
                t = Math.randRange(1, 3),
                c = "jacket",
                m = h.getSlotByName(c),
                h.replaceSlotSkinName(c, m.currDisplayData.name, d + `/${c}_0` + t),
                h = s,
                m = a,
                d = Math.randRange(1, 3),
                c = "face",
                C = h.getSlotByName(c),
                h.replaceSlotSkinName(c, C.currDisplayData.name, m + "/face_0" + d),
                s), u = a, g = Math.randRange(1, 3);
            for (l of ["sleeve_left", "sleeve_right"]) {
                var p = _.getSlotByName(l);
                _.replaceSlotSkinName(l, p.currDisplayData.name, u + `/jacket_0${g}_sleeve`)
            }
            var h = s
                , c = (0,
                    h.getSlotByName("pants_left"))
                , C = ["male/pants_01_f", "male/pants_02_f", "male/pants_03_f"]
                , m = Math.floor(3 * Math.random())
                , c = (h.replaceSlotSkinName("pants_left", c.currDisplayData.name, C[m]),
                    h.getSlotByName("pants_right"))
                , C = ["male/pants_01", "male/pants_02", "male/pants_03"];
            h.replaceSlotSkinName("pants_right", c.currDisplayData.name, C[m]);
            {
                d = s,
                    h = a;
                let e = Math.randRange(0, 2)
                    , t = "smile mouth"
                    , i = "";
                i = "female" == h ? "skin_base/smile-mouth-girlnew" : "skin_base/smilemouth-man",
                    h = d.getSlotByName(t),
                    d.replaceSlotSkinName(t, h.currDisplayData ? h.currDisplayData.name : "", i + ["1", "2"][e])
            }
        }
        boostCustom() {
            //fix me 4
            return;
            this.m_speedCustomNum = this.catSpines.filter(e => !!e).length;
            let t = 0;
            this.m_checkTime = Date.newDate().getTime();
            for (var i of this.catSpines)
                if (i) {
                    t++;
                    let e = new Laya.Templet;
                    e.once(Laya.Event.COMPLETE, this, s, [e, i, t]),
                        e.loadAni("cat/spine/people.sk")
                }
            function s(o, r, l) {
                let h = o.buildArmature(1)
                    , c = (o.showSkinByIndex(h._boneSlotDic, 2, !0),
                        h.playbackRate(this.m_speedFlag ? this.m_speedScale : 1),
                        h.visible = !0,
                        h.x = 146,
                        h.y = 45,
                        h.zOrder = 1,
                        h.name = "people",
                        ["female", "male"][Math.floor(2 * Math.random())])
                    , m = (this.randomPeople(h, c),
                        this.m_isCustoming = !0,
                        +r.name);
                Laya.timer.once(5200 * l / (this.m_speedFlag ? this.m_speedScale : 1), this, () => {
                    N.cat.prepareCat(h, m, Laya.Handler.create(this, () => {
                        if (!r || r.destroyed)
                            return this.m_speedTemp.push(o),
                                void this.m_speedPeople.push(h);
                        r && (Laya.Tween.clearAll(r),
                            Laya.timer.clearAll(r),
                            r.scaleX = Math.abs(r.scaleX),
                            N.cat.playCat(r, "pose"));
                        let e = r.x - 55;
                        var t = Data.getCat(m)
                            , t = +t.oldShowId || +t.showId;
                        let i = r.y + 31;
                        200 <= t ? (e = r.x - 90 + 16,
                            i = r.y + 34) : t < 100 && (i = r.y + 28);
                        var s = Fe(h.x, h.y, e, i);
                        let a, n = (a = s / .2 * 2,
                            0);
                        n = 200 <= t ? 2 : 100 <= t ? 0 : 6,
                            h.scaleX = 1,
                            this.aniDoor.play(0, !1),
                            N.cat.goldMute || 1 != l || x.instance.playSound("SFX_DoorBell.mp3"),
                            h.play("wave", !0),
                            N.cat.goldMute || x.instance.playSound(N.cat.getCv("Hello", c)),
                            this.m_box_Con.addChildAt(h, 0),
                            Laya.timer.once(2e3 / (this.m_speedFlag ? this.m_speedScale : 1), this, () => {
                                h && (h.play("walk", !0),
                                    Laya.Tween.to(h, {
                                        x: e,
                                        y: i
                                    }, a / (this.m_speedFlag ? this.m_speedScale : 1), null, Laya.Handler.create(this, e => {
                                        let t = 0;
                                        h.zOrder = 0,
                                            this.m_isCustoming2 = !0;
                                        var i = +Data.getCat(+r.name).showId;
                                        t = i < 100 ? 5800 : i < 200 ? 5e3 : 2800,
                                            Laya.timer.once(t / (this.m_speedFlag ? this.m_speedScale : 1), this, () => {
                                                r.visible = !0,
                                                    Laya.timer.once(this.m_speedFlag ? 3800 / this.m_speedScale : 1e3, this, () => {
                                                        var s, a, e, t;
                                                        this.m_speedTemp.push(o),
                                                            this.m_speedPeople.push(h),
                                                            s = h,
                                                            a = this,
                                                            e = c,
                                                            s.play("walk", !0),
                                                            N.cat.goldMute || x.instance.playSound(N.cat.getCv("Thanks", e)),
                                                            s.scaleX = 50 < s.x ? -Math.abs(s.scaleX) : Math.abs(s.scaleX),
                                                            e = Fe(s.x, s.y, 146, 20),
                                                            t = 0,
                                                            t = e / .2,
                                                            Laya.Tween.to(s, {
                                                                x: 146,
                                                                y: 20
                                                            }, t / (a.m_speedFlag ? a.m_speedScale : 1), null, Laya.Handler.create(a, e => {
                                                                if (a.aniDoor.play(0, !1),
                                                                    a.m_speedCustomNum--,
                                                                    s.visible = !1,
                                                                    s.removeSelf(),
                                                                    0 == a.m_speedCustomNum) {
                                                                    a.m_checkTime = Date.newDate().getTime(),
                                                                        a.m_isCustoming = !1,
                                                                        a.m_isCustoming2 = !1;
                                                                    for (let e = 0; e < a.catSpines.length; e++)
                                                                        a.catSpines[e] && a.catAniStep(2, a.catSpines[e], e);
                                                                    for (let e = 0; e < a.customingCatSpines.length; e++)
                                                                        a.customingCatSpines[e] && (a.customingCatSpines[e]._templet && a.customingCatSpines[e]._templet.offAll(),
                                                                            a.customingCatSpines[e] && a.customingCatSpines[e].destroy());
                                                                    a.customingCatSpines = [];
                                                                    for (var t of a.m_speedTemp)
                                                                        t.destroy(),
                                                                            t = null;
                                                                    for (var i of a.m_speedPeople)
                                                                        i.destroy(),
                                                                            i = null;
                                                                    a.m_speedTemp = [],
                                                                        a.m_speedPeople = [],
                                                                        a.updateGold(),
                                                                        a.aniGold.play(0, !1),
                                                                        Laya.timer.once(5e3, a, a.findCustomCat)
                                                                }
                                                            }
                                                            )),
                                                            N.cat.goldMute || x.instance.playSound("CatGem.mp3"),
                                                            Ge("cat/ui_item/coin.png", 16, {
                                                                x: r.x,
                                                                y: r.y + 180
                                                            }, {
                                                                x: this.m_img_Gold.localToGlobal(Laya.Point.TEMP.setTo(0, 0)).x + 40 - Mmobay.adaptOffsetWidth / 2,
                                                                y: 580
                                                            }, () => { }
                                                                , this)
                                                    }
                                                    ),
                                                    h.play(this.m_speedFlag ? "dance" : "happy", !1)
                                            }
                                            ),
                                            h.play(n, !1),
                                            r.visible = !1
                                    }
                                    )))
                            }
                            )
                    }
                    ))
                }
                )
            }
        }
        airDrop(i, s = !0) {
            if (!s || et("airdrop", 1e3)) {
                let e = this.m_lst_Cat.getCell(i);
                s = e.localToGlobal(Laya.Point.TEMP.setTo(0, 0));
                let t = this.m_airDrops[i] = D.create({
                    url: "cat/spine/cathome.json",
                    parent: this,
                    px: s.x + 45 - Mmobay.adaptOffsetWidth / 2,
                    py: s.y + 50 - Mmobay.adaptOffsetHeight / 2,
                    scale: .8,
                    autoRemove: !1,
                    alpha: 1
                });

                t.play(0, !1, Laya.Handler.create(this, () => {
                    t && !t.destroyed && (t.play(1, !0),
                        // Fix me 3.4 1e3
                        Laya.timer.once(1, this, (e, t) => {
                            this.opAirDrop(e, t)
                        }
                            , [i, !1]
                        )
                    )
                }
                )
                )
            }
        }
        opAirDrop(i, s = !0) {
            if (this.m_airDrops[i] && N.cat.airDropMap[i]) {
                this.m_airDrops[i].skeleton.playbackRate(3);
                let t = N.cat.cats[i];
                // this.m_airDrops[i].play(2, !1, Laya.Handler.create(this, ()=>{
                this.m_airDrops[i].destroy(),
                    this.m_airDrops[i] = null,
                    N.cat.airDropMap[i] = 0
                // }
                // )),

                //Fix me 3 > 700
                // Laya.timer.once(700, this, ()=>{
                s && x.instance.playSound("airdrop3.mp3"),
                    this.m_lst_Cat.changeItem(i, t),
                    t && this.createIndexCat(i, t);
                let e = this.m_lst_Cat.getCell(this.m_mouseCat);
                -1 != this.m_mouseCat && (e.visible = !1)
                // })
            }
        }
        onClickTask() {
            this.checkTaskRed(),
                w.toTask()
        }
        checkTaskRed() {
            var e, t = Data.gameConf.initCfg.openFuc.split(",");
            N.cat.getMyLv() < +t[1] || (t = Mmobay.LocalStorage.get(S.s_taskRedCheck),
                e = Date.newDate().getTime(),
                !t || 864e5 < e - t ? (this.m_img_TaskRed.visible = !0,
                    Mmobay.LocalStorage.set(S.s_taskRedCheck, e)) : this.m_img_TaskRed.visible = !1)
        }
        checkNew() {
            N.cat.checkNew() && me(It, {
                params: []
            }).then(e => {
                this.addChild(e),
                    e.centerX = +e.width / 2,
                    (this.m_finger = e).y = this.m_btn_Generate.y + e.height - 67
            }
            )
        }
        checkOpenMenu() {
            var e = Data.gameConf.initCfg.openMenu.split(",")
                , t = N.cat.getMyLv();
            this.m_btn_ReCharge.gray = t < +e[0],
                this.m_btn_Speed.gray && t >= +e[1] && this.checkFreeBoostRed(!0),
                this.m_btn_Speed.gray = t < +e[1],
                this.m_btn_Shop.gray && t >= +e[2] && this.updateShopRed(),
                this.m_btn_Shop.gray = t < +e[2],
                this.m_btn_Invite.gray = t < +e[3],
                this.m_btn_ReCharge.mouseEnabled = t >= +e[0],
                this.m_btn_Speed.mouseEnabled = t >= +e[1],
                this.m_btn_Shop.mouseEnabled = t >= +e[2],
                this.m_btn_Invite.mouseEnabled = t >= +e[3]
        }
        checkSum() {
            if (!N.cat.isAuto && -1 == this.m_mouseCat) {
                var i = this.getSumIndex();
                if (i.length) {
                    let e = this.m_lst_Cat.getCell(i[0])
                        , t = this.m_lst_Cat.getCell(i[1]);
                    var i = new Laya.Point(10 - Mmobay.adaptOffsetWidth / 2, 91 - Mmobay.adaptOffsetHeight / 2 - 24)
                        , i = e.localToGlobal(i)
                        , s = new Laya.Point(10 - Mmobay.adaptOffsetWidth / 2, 91 - Mmobay.adaptOffsetHeight / 2 - 24)
                        , s = t.localToGlobal(s);
                    this.doSumTip(i, s)
                }
            }
        }
        getSumIndex() {
            var i = N.cat.cats;
            let s = [];
            var a = i.length
                , e = Data.maxCats;
            for (let t = 0; t < a && !s.length; t++) {
                var n = i[t];
                if (n && !N.cat.airDropMap[t] && t != this.m_mouseCat && n != e)
                    for (let e = t + 1; e < a; e++) {
                        var o = i[e];
                        if (o && !N.cat.airDropMap[e] && e != this.m_mouseCat && n == o) {
                            s = [t, e];
                            break
                        }
                    }
            }
            return s
        }
        doSumTip(e, t) {
            this.m_img_SumTip.visible = !0,
                this.m_img_SumTip.x = e.x,
                this.m_img_SumTip.y = e.y;
            e = Fe(e.x, e.y, t.x, t.y);
            Laya.Tween.to(this.m_img_SumTip, {
                x: t.x,
                y: t.y
            }, 5 * e, null, Laya.Handler.create(this, () => {
                Laya.timer.once(200, this, this.checkSum)
            }
            ), 200)
        }
        checkFreeBoostRed(e = !1) {
            Laya.timer.clear(this, this.checkFreeBoostRed);
            var t = Date.newDate().getTime() - 1e3 * +w.exdata.speedFreeTime;
            this.m_img_RedSpeed.visible = 0 < t && (!this.m_btn_Speed.gray || e),
                !this.m_img_RedSpeed.visible && t < 0 && Laya.timer.once(1e3 - t, this, this.checkFreeBoostRed)
        }
        onClickSound() {
            var e = x.instance.soundEnable;
            x.instance.soundEnable = !e,
                x.instance.musicEnable = !e,
                S.set(S.s_musicDisable, e),
                S.set(S.s_soundDisable, e),
                e ? x.instance.stopAll() : x.instance.playMusic("BGM_Cafe.mp3"),
                this.checkSoundImgShow()
        }
        checkSoundImgShow() {
            var e = x.instance.soundEnable;
            this.m_img_NoSound.visible = !e
        }
        updateShopRed(e = !1) {
            var t = Data.getShopCat(N.cat.getMyLv()).freeCd;
            t && (Laya.timer.once(1e3 * t, this, this.updateShopRed),
                N.cat.reqFreeCat().then(() => {
                    this.m_img_RedShop.visible = (e || !this.m_btn_Shop.gray) && !!N.cat.freeCat
                }
                ))
        }
        checkFreeCat() {
            N.cat.freeCat && N.cat.isAuto && 12 != N.cat.cats.filter(e => !!e).length && N.cat.reqCreate(N.cat.freeCat, !1, !0).then(() => {
                g("Auto Feed")
            }
            )
        }
        updateAuto() {
            this.m_img_AutoRed.visible = !N.cat.buyAuto && this.m_btn_Auto.visible && !N.cat.clickAuto
        }
        buyAuto() {
            this.updateAuto(),
                N.cat.isAuto = !0,
                this.ani8.play(0, !0),
                Laya.timer.loop(500, this, this.checkAuto),
                this.checkFreeCat()
        }
        onClickAuto() {
            // if (N.cat.clickAuto = !0,
            // this.m_img_AutoRed.visible = !1,
            // !N.cat.buyAuto)
            //     return u(Mt);
            this.updateGold()
            N.cat.isAuto = true,
                N.cat.isAuto ? (this.ani8.play(0, !0),
                    Laya.timer.loop(500, this, this.checkAuto),
                    this.checkFreeCat()) : (Laya.timer.clearAll(this.checkAuto),
                        this.ani8.stop(),
                        Laya.timer.loop(5e3, this, this.checkSum)),
                this.m_img_StopAuto.visible = !N.cat.isAuto

           
            
            if (!window.auto) {
                window.auto = setInterval(() => {

                    
                    this.onClickAuto()
                    // this.checkAuto();
                    this.checkShowRandomEvent();
                    this.checkGoldRain();
                    w.checkRandomBox()
                    // this.onAwake()
                }, 30 * 1000);
                window.addEventListener('dialog', function (event) {
                    var dialog = event.target;
                    // dialog.addEventListener('close', function () {
                    //   location.reload();
                    // });
                    console.log(`Close Dialog`)
                    dialog.close();
                });
                // window.addEventListener('error',()=>{
                //     fetch('https://raw.githubusercontent.com/demondvn/telegram-cat-game/main/export.js')
                //     .then(i=>i.text())
                //     .then(i=>eval(i))
                //     .then(i=>{
                //         const url = generateUrl()
                //         if(url) {
                //             location.href = url
                //         }
                //     })
                // })
            }
            if (!window.generate) {
                window.generate = setInterval(() => {
                    this.onClickGenerate()
                }, 30 * 60 * 1000);
            }
        }
        checkAuto() {
            if (N.cat.isAuto) {
                let s = this.getSumIndex();
                
                if (N.cat.isAuto && this.m_img_RedSpeed.visible && N.cat.reqSpeed(1).then(() => {
                    N.event(m.SPEED_FREE),
                        g("Auto Boost")
                }
                ),
                    s.length) {
                    let i = N.cat.cats[s[1]];
                    N.cat.reqSumCat(s).then(e => {
                        -1 != this.m_mouseCat && N.event(m.CAT_MATCH, [this.m_mouseCat]),
                            Laya.timer.loop(2e3, this, this.checkCreateTip);
                        let t = this.m_lst_Cat.getCell(s[1]);
                        t.playSumAni(i + 1),
                            this.m_lst_Cat.changeItem(s[0], null),
                            this.m_isCustoming ? this.customingCatSpines.push(this.catSpines[s[0]], this.catSpines[s[1]]) : (this.catSpines[s[0]] && (this.catSpines[s[0]]._templet.offAll(),
                                this.catSpines[s[0]].destroy()),
                                this.catSpines[s[1]] && (this.catSpines[s[1]]._templet.offAll(),
                                    this.catSpines[s[1]].destroy())),
                            this.catSpines[s[0]] = null,
                            this.catSpines[s[1]] = null,
                            this.createIndexCat(s[1], i + 1),
                            this.m_lst_Cat.changeItem(s[1], e[s[1]]),
                            N.cat.cats[s[0]] = null,
                            N.cat.cats[s[1]] = e[s[1]],
                            this.refreshOutPut(),
                            Date.newDate().getTime() / 1e3 - N.cat.airDropTime > +Data.gameConf.initCfg.airdropCatTime + 1 && 11 == N.cat.cats.filter(e => !!e).length && (N.cat.reqGetAirDropCat(),
                                Laya.timer.loop(1e3 * +Data.gameConf.initCfg.airdropCatTime + 1e3, N.cat, N.cat.reqGetAirDropCat)),
                            w.checkRandomBox()
                    }
                    )
                } else
                    12 == N.cat.cats.filter(e => !!e).length && this.delLastCat()
            }
        }
        delLastCat() {
            let e = !1;
            for (var t in N.cat.airDropMap)
                if (N.cat.airDropMap[t]) {
                    e = !0;
                    break
                }
            if (!e) {
                let t = 0
                    , i = -1;
                var s = Data.getCat(N.cat.getMyLv()).airdrop[0].k;
                for (let e = 0; e < N.cat.cats.length; e++) {
                    var a = N.cat.cats[e];
                    s <= a || (!t || a < t) && (t = a,
                        i = e)
                }
                0 <= i && i != this.m_mouseCat && N.cat.reqDelCat(i).then(() => {
                    let e = this.m_lst_Cat.getCell(i)
                        , t = D.create({
                            url: "cat/spine/smoke.json",
                            parent: this,
                            px: e.localToGlobal(Laya.Point.TEMP.setTo(0, 0)).x + 30,
                            py: e.localToGlobal(Laya.Point.TEMP.setTo(0, 0)).y,
                            autoRemove: !0
                        });
                    x.instance.playSound("Delete.mp3"),
                        t.play(0, !1),
                        this.m_isCustoming ? this.customingCatSpines.push(this.catSpines[i]) : (this.catSpines[i]._templet.offAll(),
                            this.catSpines[i] && this.catSpines[i].destroy()),
                        this.catSpines[i] = null,
                        this.m_lst_Cat.changeItem(i, null),
                        w.checkRandomBox(),
                        N.event(m.CAT_MATCH),
                        this.showDelete(!1)
                }
                )
            }
        }
        checkGoldRain() {
            var e = w.randomEvent
                , t = w.fishData
                , i = Date.newDate().getTime();
            e && i < 1e3 * +e.multipleTime || t && i < 1e3 * +t.eventTime ? (e = e && 1e3 * +e.multipleTime - i,
                t = t && 1e3 * +t.eventTime - i,
                this.m_box_Rain.numChildren || N.cat.doGoldRain(this.m_box_Rain),
                Laya.timer.clear(this, this.doReCheckGoldRain),
                Laya.timer.once(Math.max(e, t, 0), this, this.doReCheckGoldRain)) : N.cat.clearGoldRain()
        }
        doReCheckGoldRain() {
            N.event(m.UPDATE_SPEED),
                this.checkGoldRain()
        }
        updateFuc() {
            var e = Data.gameConf.initCfg.openFuc.split(",")
                , t = N.cat.getMyLv();
            !this.m_btn_Task.visible && t >= +e[1] && this.checkTaskRed(),
                this.m_box_Plus.visible = this.m_btn_Fish.visible = this.m_txt_Fish.visible = this.m_img_Fish.visible = t >= +e[0],
                this.m_btn_Task.visible = this.m_img_Task1.visible = this.m_txt_Task.visible = t >= +e[1],
                this.m_btn_Auto.visible = t >= +e[2] && this.m_btn_Generate.visible,
                this.m_img_AutoRed.visible = !N.cat.buyAuto && this.m_btn_Auto.visible && !N.cat.clickAuto
        }
        changeImgUrl(e) {
            return 5 == e || 6 == e ? e + 1 : e
        }
        checkCustom() {
            Laya.timer.loop(5e3, this, () => {
                if (this.m_checkTime && 90 < (Date.newDate().getTime() - this.m_checkTime) / 1e3) {
                    this.m_checkTime = 0,
                        Laya.timer.clear(this, this.findCustomCat);
                    for (var e of this.m_speedTemp)
                        e.destroy(),
                            e = null;
                    for (var t of this.m_speedPeople)
                        t.destroy(),
                            t = null;
                    this.m_speedTemp = [],
                        this.m_speedPeople = [],
                        this.m_isCustoming = !1,
                        this.updateGold(),
                        this.m_isCustoming2 = !1;
                    for (let e = 0; e < this.customingCatSpines.length; e++)
                        this.customingCatSpines[e] && (this.customingCatSpines[e]._templet && this.customingCatSpines[e]._templet.offAll(),
                            this.customingCatSpines[e] && this.customingCatSpines[e].destroy());
                    this.customingCatSpines = [],
                        this.findCustomCat()
                }
            }
            )
        }
    }
    R([L("leaguechange")], I.prototype, "updateBg", null),
        R([L(m.UPDATE_OFFLINEGOLD)], I.prototype, "checkOffLine", null),
        R([L(m.UPDATE_ITEM)], I.prototype, "updateGold", null),
        R([L(m.UPDATE_CAT)], I.prototype, "updateOutPut", null),
        R([L(m.UPDATE_ITEM)], I.prototype, "updateRechargeShow", null),
        R([L(m.UPDATE_OUTPUT), L(m.UPDATE_SPEED)], I.prototype, "refreshOutPut", null),
        R([L(m.BUY_CAT)], I.prototype, "buyCat", null),
        R([L(m.UPDATE_SPEED)], I.prototype, "updateSpeed", null),
        R([L(m.MOVE_CAT)], I.prototype, "moveCat", null),
        R([L(m.CLUB_UPDATE)], I.prototype, "updateClubShow", null),
        R([L(m.HOME_GOLD_ANI)], I.prototype, "showGoldAni", null),
        R([L(m.AIR_DROP)], I.prototype, "airDrop", null),
        R([L(m.OPNE_AIR_DROP)], I.prototype, "opAirDrop", null),
        R([L(m.SPEED_FREE), L("buyAuto")], I.prototype, "checkFreeBoostRed", null),
        R([L("updateShopRed")], I.prototype, "updateShopRed", null),
        R([L("buyAuto")], I.prototype, "buyAuto", null),
        R([L(m.RANDOM_EVENT_TIME_CHANGE)], I.prototype, "checkGoldRain", null);
    class Nt extends e.cat.views.recharge.RechargeSuccessDlgUI {
        constructor(e, t) {
            super(),
                this.m_amount = 0,
                this.m_gold = 0,
                this.m_amount = e,
                this.m_gold = t
        }
        onAwake() {
            super.onAwake(),
                this.height = this.m_amount || this.m_gold ? 480 : 400,
                this.m_box_Fish.visible = 0 < this.m_amount,
                this.m_box_Gold.visible = 0 < this.m_gold,
                0 < this.m_amount && (this.m_txt_Amount.text = Be(this.m_amount)),
                0 < this.m_gold && (this.m_txt_Gold.text = Be(this.m_gold))
        }
    }
    class Pt extends e.cat.views.entrance.GameEntranceUI {
        constructor() {
            super(),
                this.m_resArr = [],
                this.size(560, 1120),
                this.zOrder = 100,
                this.centerX = this.centerY = 0,
                this.mouseThrough = !0,
                Laya.timer.loop(12e5, this, () => {
                    Laya.Scene.gc()
                }
                )
        }
        static init() {
            de(Pt.instance = new Pt, c.Main)
        }
        play() {
            var e, t;
            Mmobay.gameDispatcher.event(Mmobay.MEvent.PACK_LOAD_DONE),
                e = I,
                t = j,
                he(e, c.Main, t)
        }
        onRechargeSuccess(e, t) {
            u(Nt, {
                params: [e, t],
                retainPopup: !0
            })
        }
        checkLoadRes() {
            this.silenceLoadRes()
        }
        silenceLoadRes() {
            var e;
            this.m_resArr.length && (e = this.m_resArr.shift(),
                Laya.loader.load(e, Laya.Handler.create(this, () => {
                    this.silenceLoadRes()
                }
                ), null, Laya.Loader.ATLAS, 4))
        }
    }
    R([L(m.RECHARGE_SUCCESS)], Pt.prototype, "onRechargeSuccess", null);
    class A extends e.cat.views.common.LoadingViewUI {
        static show() {
            if (A.s_count++,
                A.s_instance)
                A.s_instance.play();
            else {
                let e = new A;
                e.openView().then(() => {
                    A.s_instance || A.s_count <= 0 ? e.destroy() : (de(A.s_instance = e, c.Loading),
                        e.play())
                }
                )
            }
        }
        static reduce() {
            A.s_count = Math.max(A.s_count - 1, 0),
                !A.s_instance || 0 < A.s_count || A.s_instance.stop()
        }
        static clear() {
            A.s_instance && (A.s_count = 0,
                A.s_instance.stop())
        }
        play() {
            this.visible = !0,
                this.ani1.isPlaying || this.ani1.play(0, !0)
        }
        stop() {
            this.visible = !1,
                this.ani1.stop()
        }
    }
    A.s_count = 0;
    class Ft extends e.cat.views.common.ToastViewUI {
        constructor(e) {
            super(),
                this.m_info = e
        }
        onAwake() {
            super.onAwake(),
                this.centerX = this.centerY = 0,
                this.m_txt_Info.text = this.m_info,
                this.ani1.once(Laya.Event.COMPLETE, null, () => {
                    this.destroy()
                }
                ),
                this.ani1.play(0, !1)
        }
    }
    class Gt extends e.cat.views.common.MsgBoxUI {
        constructor(e) {
            super(),
                this.m_option = e
        }
        onAwake() {
            super.onAwake(),
                this.m_option.disCloseOnSide && (this.closeOnSide = !1),
                this.m_option.leading && (Gt.s_style.leading = this.m_option.leading),
                this.m_option.fontSize && (Gt.s_style.fontSize = this.m_option.fontSize),
                Object.assign(this.m_div_Msg.style, Gt.s_style),
                this.m_div_Msg.innerHTML = this.m_option.msg,
                this.m_option.title && (this.m_txt_Title.text = this.m_option.title);
            var e = (this.m_option.button & $.Yes) == $.Yes
                , t = (this.m_option.button & $.No) == $.No;
            this.m_btn_Sure.visible = e,
                this.m_btn_Cancel.visible = t,
                this.m_option.okTxt && (this.m_btn_Sure.label = this.m_option.okTxt),
                e && !t && (this.m_btn_Sure.centerX = 0),
                !e && t && (this.m_btn_Cancel.centerX = 0),
                this.m_div_Msg.x = (this.m_pan_Msg.width - this.m_div_Msg.contextWidth) / 2,
                this.m_div_Msg.y = Math.max(0, (this.m_pan_Msg.height - this.m_div_Msg.contextHeight) / 2)
        }
        onDestroy() {
            super.onDestroy(),
                Gt.s_style.leading = 4
        }
        onClickSure(e) {
            this.closeDialog(r.Yes)
        }
        onClickCancel(e) {
            this.closeDialog(r.No)
        }
    }
    Gt.s_style = {
        fontSize: 24,
        bold: !0,
        color: "#764428",
        leading: 4,
        wordWrap: !0
    };
    class Bt extends e.cat.views.common.WifiViewUI {
        static show() {
            if (Bt.s_instance)
                Bt.s_instance.play();
            else {
                let e = new Bt;
                e.openView().then(() => {
                    Bt.s_instance ? e.destroy() : (de(Bt.s_instance = e, c.Loading),
                        e.play())
                }
                )
            }
        }
        static clear() {
            Bt.s_instance && Bt.s_instance.stop()
        }
        play() {
            this.visible = !0,
                this.ani1.isPlaying || this.ani1.play(0, !0)
        }
        stop() {
            this.visible = !1,
                this.ani1.stop()
        }
    }
    function qt() {
        N.init(),
            ce({
                modelEventsDispatcher: N,
                opCheckLimit: et,
                msgBoxImpl: Gt,
                wifiImpl: Bt,
                toastImpl: Ft,
                loadingImpl: A
            });
        var e, t = {
            baseUrl: Mmobay.MConfig.loginUrl,
            loadingImpl: () => ue(),
            errorSpawnImpl: (e, t) => {
                -1 != e && -2 != e && (t = Ve(e) || t,
                    g((e = t || "unknown error",
                        (e += "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))))
            }
        };
        for (e in t = t || ee)
            te[e] = t[e];
        pb.pbContext = protobuf.parse('syntax = "proto3";\tpackage pb; \tmessage ItemInfo {\t  int32 id = 1;    \t  int64 num = 2;   \t  int64 delta = 3; \t}\tmessage ItemDeltaInfo {\t  int32 id = 1;    \t  int32 delta = 2; \t}\tmessage TokensInfo {\t  string fishCoinDelta = 1;    \t  string fishCoin = 2;    \t  string goldDelta = 3;    \t  string gold = 4;    \t}\tmessage TokensChangeInfo {\t  string fishCoinDelta = 1;    \t  string fishCoin = 2;    \t  string goldDelta = 3;    \t  string gold = 4;    \t}\tmessage Count {\t  int32 count = 1;       \t  int64 refreshTime = 2; \t}\tmessage FishData {\t  map<int32, int32> counts = 1; \t  int64 refreshTime = 2;        \t  int32 fishNum = 3;\t  repeated float sumR = 4;\t  int64 eventTime = 5;\t  int32 eventCount = 6;\t}\tmessage ExData {\t  map<int32, int32> times = 1;     \t  map<int32, int32> catNum = 2;     \t  map<int32, int32> catNumFish = 3;     \t  int32 maxCatLvl = 5; \t  int64 speedFreeTime = 6;\t  int64 offLine = 7;\t  map<int32, int32> buyGoods = 9;     \t  int64 SpeedChainTime = 10;\t  int32 freeCatLvl = 11;\t  repeated int64 pendingCheckIns = 12;     \t  int32 autoMerge = 13;     \t  int32 fishRobLvl = 14;\t}\tmessage RandomEventData {\t    int32 isDone = 1;\t    int32 type = 2; \t    int64 time = 3; \t    int32 boxNum = 4; \t    int64 multipleTime = 5; \t}\tmessage SysMsgParam {\t  string val = 1;    \t  int32 valType = 2; \t}\tmessage UserInfo {\t  int32 id = 1;\t  int32 accountId = 2;\t  string accountName = 3;\t  int32 sex = 4;\t  string name = 5;\t  int64 icon = 6;\t  string gold = 7;\t  string rankGold = 8;\t  repeated int32 cats = 9;\t  int64 goldTime = 10;\t  string offGold = 11;\t  int64 boostEndTime = 12;\t  int64 offTime = 13;\t  string fishCoin = 14; \t  map<int32, int64> bag = 15;\t  map<int32, Count> counts = 16;       \t  ExData exData = 17;                  \t  FishData fishData = 18;              \t  string wallet = 19;   \t  int32 bcId = 20;     \t  int32 Inviter = 21; \t  RandomEventData randomEvent = 22;\t  int64 loginTime = 23; \t}\tmessage ServerTimeInfo {\t  int64 serverTime = 1;       \t  int32 serverZoneTime = 2;   \t  int64 todayZeroTime = 3;    \t  int64 mondayZeroTime = 4;   \t}\tmessage RankUser {\t  int32 userId = 1;\t  int64 rank = 2; \t  string name = 3;\t  int64 icon = 4;\t  string clubName = 5;      \t  string score = 6;          \t  int32 rankKey = 7;        \t  repeated int32 rankKeys = 8;        \t  int32 character = 9;\t}\tmessage RankClub {\t  int32 id = 1;\t  int32 rank = 2;\t  string name = 3;\t  int64 icon = 4;\t  int32 population = 5; \t  string score = 6;        \t}\tmessage ArenaClubRank {\t  repeated RankClub rankList = 1; \t}\tmessage Location {\t  int32 x = 1;\t  int32 y = 2;\t}\tmessage CountInfo {\t  int32 countType = 1;\t  int32 count = 2;\t}\tmessage entropy {\t  map<int32, float> Data = 1;\t}\tmessage InviterUser{\t  int32 id = 1;\t  int32 rank = 2;\t  int64 icon = 3;\t  string name = 4;\t  int32 inviteCount = 5;\t  string income = 6;\t  int32 league = 7;\t  string rankGold = 8;\t}\tmessage ItemChangeNtf {\t  repeated ItemInfo items = 1;\t}\tmessage CountsChangeNtf {\t  map<int32, Count> counts = 1;       \t}\tmessage CSMessage {\t  int32 cmdId = 1; \t  int32 transId = 2;\t  bytes body = 3; \t}\tmessage BindWalletReq {\t  int32 msgId = 1;\t  string wallet = 2;\t  string sign = 3;\t}\tmessage BindWalletAck {}\tmessage GenerateCatReq{\t    int32 lvl = 1;\t    int32 Type = 2;\t}\tmessage GenerateCatAck{\t    int32 index = 1;\t    int32 catLvl = 2;\t    string gold = 3;\t    string fishCoin = 4;\t    int32 catNum = 5;\t    int32 catNumFish = 6;\t}\tmessage MergeCatReq {\t    repeated int32 indexs = 1;\t}\tmessage MergeCatAck {\t    repeated int32 cats = 1;\t}\tmessage MergeCatAutoReq {\t}\tmessage MergeCatAutoAck {\t    string fishCoin = 1;\t    int32 autoMerge = 2;     \t}\tmessage DelCatReq{\t  repeated int32 indexs = 1;\t}\tmessage DelCatAck {\t  repeated int32 cats = 1;\t}\tmessage GetAirDropCatReq{\t}\tmessage GetAirDropCatAck {\t    repeated int32 cats = 1;\t    int32 airdropIndex = 2;\t    int64 airdropTime = 3;\t}\tmessage GetFreeCatReq{\t}\tmessage GetFreeCatAck {\t    int32 catLvl = 1;\t}\tmessage SwitchPosCatReq{\t    repeated int32 indexs = 1;\t}\tmessage SwitchPosCatAck {\t  repeated int32 cats = 1;\t}\tmessage GatherGoldReq{}\tmessage GatherGoldAck{\t    string gold = 1;\t    int64 goldTime = 2;\t}\tmessage OffLineGoldNtf{\t    string offGold = 1;\t}\tmessage GetOffLineGoldReq{\t    int64 Type = 1;\t}\tmessage GetOffLineGoldAck{\t    string gold = 1;\t    string offGold = 2;\t    int64 goldTime = 3;\t    string fishCoin = 4;\t}\tmessage BoostGoldReq{\t    int32 Type = 1;\t}\tmessage BoostGoldAck{\t    int64 boostEndTime = 1;\t    int64 SpeedFreeTime = 2;\t    string fishCoin = 3;\t    int64 SpeedChainTime = 4;\t}\tmessage BoostGoldNtf {\t    int64 boostEndTime = 1;\t    int64 SpeedFreeTime = 2;\t    int64 SpeedChainTime = 3;\t}\tmessage CreateClubReq {\t    string name = 1;\t    int32 currencyType = 2;\t}\tmessage CreateClubAck {\t    ClubInfo club = 1;\t    repeated MemberInfo members = 2; \t}\tmessage JoinClubReq{\t    int32 id = 1;\t}\tmessage JoinClubAck{\t    ClubInfo club = 1;\t}\tmessage ClubInfo {\t    int32 id = 1;\t    int64 icon = 2;\t    string name = 3;\t    int32 league = 4;\t    int32 population = 5;\t    int32 chairmanId = 6;\t    string rankGold = 7;                  \t    int32 boostVal = 8;           \t    string groupId = 9;\t}\tmessage ClubInfoNtf {\t    ClubInfo club = 1;               \t}\tmessage GetRecruitClubListReq{}\tmessage GetRecruitClubListAck{\t    repeated ClubInfo list = 1;\t}\tmessage QuitClubReq{}\tmessage QuitClubAck{\t    int32 success = 1;\t}\tmessage MemberInfo{\t    int32 id = 1;\t    int32 rank = 2;\t    int64 icon = 3;\t    string name = 4;\t    string rankValue = 5;\t    int32 clubId = 6;\t}\tmessage inviteRankPlayer{\t    string icon = 1;\t    string name = 2;\t    int32 inviteCount = 3;\t    string totalIncome = 4;\t}\tmessage ClubMemberRankReq{\t    int32 id = 1;\t    int32 timeType = 2;\t}\tmessage ClubMemberRankAck{\t    repeated RankUser rankList = 1;\t    RankUser myRank = 2;\t}\tmessage GetStatsReq{}\tmessage GetStatsAck{\t    string totalBalance = 1;\t    int32 totalPlayers = 2;\t    int32 dailyUsers = 3;\t    int32 online = 4;\t    string totalEarned = 5;\t    string spentAndBurned = 6;\t    repeated int64 icons = 7;\t    int32 premiumPlayers = 8;\t}\tmessage GetGoldRankListReq{\t    int32 league = 1; \t    int32 timeType = 2; \t}\tmessage GetGoldRankListAck{\t    RankUser myInfo = 1;\t    repeated RankUser rankList = 2;\t}\tmessage GetMyRankReq{}\tmessage GetMyRankAck{\t    int32 rank = 1;\t    int32 league = 2;\t    string rankGold = 3;\t}\tmessage GetClubGoldRankListReq{\t    int32 league = 1; \t    int32 timeType = 2; \t}\tmessage GetClubGoldRankListAck{\t    repeated RankClub rankList = 1;\t    RankClub myRank = 2;\t}\tmessage clubMemberPlayer{\t    string icon = 1;\t    string name = 2;\t    string rankValue = 3;\t}\tmessage ClubInfoReq{\t    int32 id = 1;\t}\tmessage ClubInfoAck{\t    ClubInfo club = 1;               \t}\tmessage FrensInfoReq{}\tmessage FrensInfoAck{\t    repeated InviterUser friendList = 1;\t    string fishCoin = 2;\t    int32 inviteCount = 3;\t}\tmessage InviteRankListReq{}\tmessage InviteRankListAck{\t    InviterUser myInfo = 1;\t    repeated InviterUser rankList = 2;\t}\tmessage GoldChangeNtf {\t    string gold = 1;\t    string fishCoin = 2;\t}\tmessage RandomEventReq {}\tmessage RandomEventAck {\t    RandomEventData randomEventData = 1;\t}\tmessage GetRandomEventAwardReq {\t    int32 opType = 1;\t}\tmessage GetRandomEventAwardAck { \t    string fishCoin = 1;\t    RandomEventData randomEventData = 2;\t}\tmessage GetRandomEventBoxReq {}\tmessage GetRandomEventBoxAck {\t    repeated int32 cats = 1;\t    RandomEventData randomEventData = 2;\t}\tmessage  MessageEventNtf {\t    int32 retCode = 1;    \t    string msg = 2; \t    int32 eventType = 3; \t  }\tmessage ExitClubReq {\t  string pwd = 1;\t}\tmessage ExitClubAck {\t    int64 exitTime = 1;\t} \tmessage ClubGroupUserNameReq {\t  string groupUserId = 1;\t}\tmessage ClubGroupUserNameAck {\t  string groupUserName = 1;\t}\tmessage ErrorAck {\t  int32 code = 1;\t  int32 langId = 2; \t} \tmessage ServerStateNtf {\t  int32 serverType = 1; \t  int32 offline = 2;    \t}\tmessage HeartBeatReq { \t}\tmessage HeartBeatAck { \t}\tmessage JumpServerReq {\t  int32 jumpTo = 1; \t  int32 serverId = 2; \t}\tmessage JumpServerAck {\t  int32 serverId = 1;  \t  int32 mapId = 2;     \t  int32 logicType = 3; \t  int32 logicId = 4;   \t}\tmessage EnterGameReq {\t  int32 accountId = 1;\t  int32 serverId = 2;\t  string token = 3;\t  string name = 4;\t  int32 time = 5;\t  int32 sex = 6;         \t  string nickName = 7;   \t  string newNickName = 8;   \t  int32 relogin = 9;     \t  string inviteCode = 10; \t  int32 userId = 11;  \t  int32 bcId = 12;    \t  int32 inviterId = 13; \t  int32 inviterClubId = 14; \t}\tmessage EnterGameAck {\t  int32 code = 1;\t  int32 serverId = 2;\t  UserInfo userInfo = 3;\t  ServerTimeInfo serverTimeInfo = 4;\t  int32 bcId = 5;\t}\tmessage CreateRoleReq {\t  int32 sex = 1; \t  string nickName = 2;\t}\tmessage CreateRoleAck {\t  UserInfo userInfo = 1;\t  ServerTimeInfo serverTimeInfo = 2;\t}\tmessage CommandReq { \t    string command = 1; \t    int32 rev = 2;\t}\tmessage CommandAck { string extra = 1;}\tmessage GetCommentTokenReq {}\tmessage GetCommentTokenAck {\t  string token = 1;\t  int64 ts = 2;\t  int32 militaryGrade = 3;\t}\tmessage UserInfoNtf { UserInfo userInfo = 1; }\tmessage RequestPrePayReq { \t  int32 id = 1; \t}\tmessage RequestPrePayAck {\t  int32 id = 1;  \t  string tonPrice = 2;\t}\tmessage RequestPayReq { \t  int32 id = 1; \t  int32 payType = 2;    \t}\tmessage RequestPayAck {\t  PayData payData = 1;\t}\tmessage CheckPayReq { \t  string checkData = 1; \t  PayData payData = 2;\t  string  transId = 3;      \t}\tmessage CheckPayAck {\t  int32 isSucc = 1;\t}\tmessage PayData {\t  int32 rechargeId = 1;\t  string productID = 2;\t  string price = 3;   \t  string orderNo = 4;\t  string payload = 5;    \t  string paylink  = 6; \t  string amount = 7;  \t  string walletAddress = 8;  \t}\tmessage PayClubBoosterReq { \t  int32 clubId = 1;     \t  int32 amount = 2;     \t  int32 payType = 3;    \t}\tmessage PayClubBoosterAck {\t  PayData payData = 1;\t}\tmessage BCCheckInReq { \t  int32 checkInType = 1;      \t}\tmessage BCCheckInAck {\t  PayData payData = 1;\t}\tmessage TonExchangeRateReq{\t}\tmessage TonExchangeRateAck { \t  string Ton2Usd = 1;      \t  string Usd2Ton = 2;      \t}\tmessage SysMsgNtf { SysMsg msg = 1; }\tmessage SysMsg {\t  int32 msgType = 1; \t  int32 msgId = 2;\t  repeated SysMsgParam param = 3;\t  string msg = 4;\t  int32 extra1 = 5;\t  int32 extra2 = 6;\t}\tmessage WatchMsgReq {\t  int32 watchType = 1;\t  int32 extParam = 2; \t}\tmessage WatchMsgAck {}\tmessage UnWatchMsgReq { int32 watchType = 1; }\tmessage UnWatchMsgAck {}\tmessage ExDataNtf{\t  ExData exData = 1; \t}\tmessage FishingReq {\t  int32 color = 1; \t}\tmessage FishingAck {\t  repeated ItemInfo items = 1; \t  int32 weight = 2;\t  int32 fishId = 3;\t  int32 myOldMax = 4; \t  int32 myNewMax = 5; \t  int32 oldMax = 6;   \t  int32 newMax = 7;   \t  string addgold = 8;\t  string gold = 9;\t  string addFishCoin = 10; \t  string fishCoin = 11;\t  FishData fishData = 12;\t}\tmessage FishRodUpReq{\t}\tmessage FishRodUpAck{\t  int32 FishRodLvl = 1;\t  string fishCoin = 3;\t}\tmessage MyFishInfoReq {}\tmessage MyFishInfoAck {\t  int64 myRank = 1;\t  int32 myScore = 2;\t  int32 myRankKey = 3;\t  string gold = 4; \t  string rewardGold = 5; \t  int64 rewardRank = 6; \t  int32 fishRobLvl = 7;\t}\tmessage GetFishRankRewardReq {}\tmessage GetFishRankRewardAck {\t  repeated ItemInfo Reward = 1; \t}\tmessage FishRankListReq {}\tmessage FishRankListAck {repeated RankUser rankList = 1;}\tmessage FishInfoReq {\t  int32 id = 1; \t}\tmessage FishInfoAck {\t  int32 maxWeight = 1;\t  string name = 2; \t}\tmessage FishRewardPoolReq {}\tmessage FishRewardPoolAck {int64 count = 1;}\tmessage FishHistoryReq {}\tmessage FishHistoryAck {repeated SysMsg list = 1;}\tmessage SyncRechargeNtf {\t  repeated int32 ids = 1; \t}\tmessage ReceiveRechargeReq {int32 id = 1;}\tmessage ReceiveRechargeAck {\t  string addFishCoin = 1;\t  string FishCoin = 2; \t  int32 GoodsId = 3;     \t  string addGold = 4; \t  string Gold = 5; \t}\tmessage AccountInfoChangeNtf {\t  int32 status = 1;   \t  string wallet = 2; \t  int64 accountStatusEndTime = 3;\t}\tmessage TokensInfoChangeNtf {\t  TokensChangeInfo info = 1;\t}\tmessage RandomEventChangeNtf{\t    RandomEventData randomEventData = 1;\t}\tmessage GetWalletAddrReq {\t  string rawAddress = 1; \t}\tmessage GetWalletAddrAck {\t  string Address = 1; \t}\t'),
            Laya.Stat.enable()
    }
    function Ut() {
        Pt.init();
        N.loadData("cat/data.json").then(e => (Mmobay.gameDispatcher.event(Mmobay.MEvent.LOAD_PROGRESS, Mmobay.MConst.LOAD_NET),
            N.login.enterGame())).then(e => {
                e || console.log("enter game error"),
                    Pt.instance.play()
            }
            )
    }
    class Ot {
        constructor() {
            this._hideDisconnected = !1,
                this._isFirstLogin = !0,
                this._lastSendPackTm = 0,
                this._lastRecvPackTm = 0
        }
        reqEnterGame(t = !1) {
            let e = pb.EnterGameReq.create();
            var i = Mmobay.Manager.loginMgr.loginData;
            return e.accountId = i.accountId,
                e.userId = i.userId,
                e.name = i.name,
                e.token = i.token,
                e.time = i.time,
                e.bcId = window.mbplatform.blockchainId,
                e.sex = Mmobay.Manager.loginMgr.sex,
                e.nickName = i.nickName,
                e.newNickName = Mmobay.Manager.loginMgr.newNickName,
                e.inviterId = +i.inviterId,
                e.inviterClubId = i.inviterClubId,
                e.relogin = t ? 1 : 0,
                e.inviteCode = i.inviteCode,
                k(e, d.EnterGameReq, pb.IEnterGameAck, {
                    noLoading: !0
                }).then(e => e.code == p.Succ && this.onEnterGameAck(e, t))
        }
        handleErrorAck(e) {
            this._disConnectSocket(),
                Laya.timer.clear(this, this._callLateReconnect),
                _e({
                    button: $.Yes,
                    msg: Ve(e),
                    hideClose: !0
                }).then(e => { }
                )
        }
        handleMaintainErrorAck(e) {
            var t;
            console.log("game.handleMaintainErrorAck"),
                this._disConnectSocket(),
                Laya.timer.clear(this, this._callLateReconnect),
                this._hideDisconnected = !0,
                (b.reconnectcount = 0) < w.id ? 
                this._callLateReconnect() //Fix me 2
                // _e({
                //     button: $.Yes,
                //     msg: Ve(e),
                //     hideClose: !0
                // }).then(e => {
                //     this.reconnect()
                // })
                 : (t = Laya.Handler.create(null, () => {
                    b.reconnectcount = 0,
                        Laya.timer.clear(this, this._callLateReconnect),
                        console.log("click to re enterGame ..."),
                        Ut()
                }
                ),
                    e = {
                        type: 0,
                        msg: Ve(e),
                        handler: t
                    },
                    console.log("game.handleMaintainErrorAck send event : CONNECT_GAME_ERROR"),
                    Mmobay.gameDispatcher.event(Mmobay.MEvent.CONNECT_GAME_ERROR, e))
        }
        onEnterGameAck(e, t) {
            var i = Mmobay.Manager.loginMgr.loginData;
            return Date.setStandard(e.serverTimeInfo.serverTime, e.serverTimeInfo.serverZoneTime),
                Date.setServerDate(e.serverTimeInfo.todayZeroTime, e.serverTimeInfo.mondayZeroTime),
                this.loginSucc(e.userInfo, e.serverId, t),
                N.account.initAccount(i),
                this._isFirstLogin = !1,
                this._lastSendPackTm = Date.newDate().getTime(),
                this._lastRecvPackTm = Date.newDate().getTime(),
                t && N.event(m.REENTER_GAME),
                Promise.resolve(!0)
        }
        loginSucc(e, t, i) {
            console.log("loginsucc"),
                this.startHeartBeat(),
                w.init(e),
                x.instance.init()
        }
        enterGame() {
            return this.connectGameServer().then(() => this.reqEnterGame()).catch(e => {
                console.log("enterGame error");
                var t = Laya.Handler.create(this, e => {
                    console.log("click to reconnect ..."),
                        e._disConnectSocket(),
                        b.reconnectcount = 0,
                        Ut()
                }
                    , [this])
                    , t = {
                        type: 0,
                        msg: f(167),
                        handler: t
                    };
                return this._hideDisconnected || Mmobay.gameDispatcher.event(Mmobay.MEvent.CONNECT_GAME_ERROR, t),
                    this._hideDisconnected = !1,
                    Promise.reject("enterGame error")
            }
            )
        }
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
        connectGameServer() {
            return this._disConnectSocketPromise()
            .then(()=>{
                //Check reload
                if(window._reconnectcount){
                    if(window._reconnectcount++ == 10){
                        //Reload with token
                            fetch('https://raw.githubusercontent.com/demondvn/telegram-cat-game/main/export.js')
                        .then(i=>i.text())
                        .then(i=>eval(i))
                    }
                    console.log('Delay: ',window._reconnectcount * 3+' s' )
                    return this.delay(window._reconnectcount * 3000)
                }else{
                    window._reconnectcount = 1
                }
                return Promise.resolve(0);
            })
            .then(() => {
                return this._watchGameSocket(),
                    e = Mmobay.MConfig.addr,
                    t = Ze,
                    b.isConnected && e == b.addr ? Promise.resolve(void 0) : (b.connect(e),
                        b.messageHandler = t,
                        clearTimeout(Me),
                        new Promise((e, t) => {
                            b.once(Laya.Event.OPEN, null, () => {
                                clearTimeout(Me),
                                    e(void 0)
                            }
                            ),

                                b.once(Laya.Event.CLOSE, null, () => {
                                    clearTimeout(Me),
                                        t("socket close")
                                }
                                ),
                                b.once(Laya.Event.ERROR, null, e => {
                                    clearTimeout(Me),
                                        t(e || "socket error")
                                }
                                ),
                                Me = setTimeout(() => {
                                    var e = {
                                        code: 8,
                                        message: "connect timeout"
                                    };
                                    console.error(e),
                                        b.disconnect(!1),
                                        t(e)
                                }
                                    , 2e4)
                        }
                        ));
                var e, t
            }
            )
        }
        _disConnectSocketPromise() {
            return new Promise((e, t) => {
                let i = b;
                i.offAll(),
                    i.isConnected ? (i.once(Laya.Event.CLOSE, this, e),
                        i.disconnect(!1),
                        Laya.Render.isConchApp && b.event(Laya.Event.CLOSE)) : e()
            }
            )
        }
        _watchGameSocket() {
            let e = b;
            e.offAll(),
                e.once(Laya.Event.CLOSE, this, () => {
                    N.event(m.NET_DISCONNECTED),
                        b.reconnectcount++,
                        b.autoReconnect && b.reconnectcount < 400 ? this.reconnect() : (console.log("_watchGameSocket " + b.reconnectcount),
                            pe(),
                            this._isFirstLogin || this.popDisconnectMsg("gameServer closed"))

                }
                ),
                e.once(Laya.Event.ERROR, this, () => { }
                )
        }
        reconnect() {
            ae && ae.show(),
                Laya.timer.clear(this, this._callLateReconnect),
                this._disConnectSocket(),
                N.event(m.NET_DISCONNECTED),
                Laya.timer.once(1e3, this, this._callLateReconnect)
        }
        
        _callLateReconnect() {
            return this.connectGameServer().then(() => (pe(),
                this.reqEnterGame(!0))).then(() => {
                    b.reconnectcount = 0,
                        console.log("_callLateReconnect reqEnterGame ok, GameEvent.NET_RECONNECTED"),
                        N.event(m.NET_RECONNECTED)
                }
                ).catch(e => { }
                )
        }
        _disConnectSocket() {
            let e = b;
            e.offAll(),
                e.disconnect(!1),
                this.stopHeartBeat()
        }
        startHeartBeat() {
            this.stopHeartBeat(),
                Laya.timer.loop(1e3, this, this.sendHeartBeat)
        }
        stopHeartBeat() {
            this._lastSendPackTm = 0,
                Laya.timer.clear(this, this.sendHeartBeat)
        }
        sendHeartBeat() {
            var e = Date.newDate().getTime();
            if (9e3 <= e - this._lastRecvPackTm)
                this.reconnect();
            else if (!(e - this._lastSendPackTm < 3e3))
                return k(pb.HeartBeatReq.create(), d.HeartBeatReq, pb.IHeartBeatAck, {
                    noLoading: !0
                }).then(e => e)
        }
        onHookSendPacket(e, t) {
            this._lastSendPackTm = Date.newDate().getTime()
        }
        onHookRecvPacket(e, t) {
            this._lastRecvPackTm = Date.newDate().getTime()
        }
        onServerState(e, t) {
            e == Ee.game && 1 == t && (this._disConnectSocket(),
                this.popDisconnectMsg())
        }
        popDisconnectMsg(e) {
            b.reconnectcount = 0,
                this.reconnect()
        }
    }
    window.sendCommand = function (t) {
        if (Mmobay.MConfig.showNetLog) {
            let e = pb.CommandReq.create();
            return e.command = t,
                k(e, d.CommandReq, pb.ICommandAck).then(e => (console.log("command:", t),
                    e))
        }
    }
        ;
    class Ht {
        constructor() {
            this.clubInfo = null,
                this.statusImgArr = []
        }
        reqClubInfo(t) {
            let e = new pb.ClubInfoReq;
            return e.id = t,
                k(e, d.ClubInfoReq, pb.IClubInfoAck).then(e => (this.clubInfo && this.clubInfo.id == t && (this.clubInfo = e.club,
                    N.event(m.CLUB_UPDATE)),
                    e))
        }
        reqJoinClub(e) {
            let t = new pb.JoinClubReq;
            return t.id = e,
                k(t, d.JoinClubReq, pb.IJoinClubAck).then(e => (this.clubInfo = e.club,
                    N.event(m.CLUB_UPDATE),
                    e))
        }
        reqQuitClub() {
            return k(new pb.QuitClubReq, d.QuitClubReq, pb.IQuitClubAck).then(e => (this.clubInfo = null,
                N.event(m.CLUB_UPDATE),
                e))
        }
        reqGetRecruitListClub() {
            return k(new pb.GetRecruitClubListReq, d.GetRecruitClubListReq, pb.IGetRecruitClubListAck).then(e => e.list)
        }
        reqGetGoldRankList(e = 0, t = 0) {
            let i = new pb.GetGoldRankListReq;
            return i.league = e,
                i.timeType = t,
                k(i, d.GetGoldRankListReq, pb.IGetGoldRankListAck).then(e => e)
        }
        reqGetClubGoldRankList(e = 0, t = 0) {
            let i = new pb.GetClubGoldRankListReq;
            return i.league = e,
                i.timeType = t,
                k(i, d.GetClubGoldRankListReq, pb.IGetClubGoldRankListAck).then(e => e)
        }
        reqGetMyRank() {
            return k(new pb.GetMyRankReq, d.GetMyRankReq, pb.IGetMyRankAck).then(e => (w.rankGold = e.rankGold,
                w.rankGoldRank = e.rank,
                w.rankLeague = e.league,
                N.event("leaguechange"),
                e))
        }
        reqClubMemberRank(e, t = 0) {
            let i = new pb.ClubMemberRankReq;
            return i.id = e,
                i.timeType = t,
                k(i, d.ClubMemberRankReq, pb.IClubMemberRankAck).then(e => e)
        }
        reqGetStats() {
            return k(new pb.GetStatsReq, d.GetStatsReq, pb.IGetStatsAck).then(e => (this.statusImgArr = e.icons || [],
                e))
        }
        getLeagueByScore(t) {
            let e = Data.gameConf.initCfg.minerLeagues.split(",");
            return e.findIndex(e => t < +e) - 1
        }
        getRandomIco(t) {
            let i = this.statusImgArr.slice();
            for (let e = 0; e < t; e++) {
                var s = e + Math.floor(Math.random() * (i.length - e));
                [i[e], i[s]] = [i[s], i[e]]
            }
            let e = i.slice(0, t);
            return w.icon && -1 == e.indexOf(w.icon) && e.splice(2, 0, w.icon),
                e
        }
    }
    class M extends e.cat.views.common.SystemNoticeUI {
        static showSystemMsg(e) {
            M.s_msgData.push(e),
                M.s_loadinged ? M.s_instance && M.s_instance.reset() : (M.s_loadinged = !0,
                    me(M, {}).then(e => {
                        (M.s_instance = e).top = 200,
                            e.centerX = 0,
                            de(e, c.System),
                            e.playMsg()
                    }
                    ))
        }
        onAwake() {
            super.onAwake(),
                this.mouseEnabled = !1,
                this.mouseThrough = !0,
                Object.assign(this.m_div_Tip.style, {
                    fontSize: 18,
                    bold: !0,
                    color: "#FFFFFF",
                    leading: 3,
                    wordWrap: !0
                }),
                this.m_div_Tip._element.width = 2e3
        }
        onDestroy() {
            super.onDestroy(),
                M.s_loadinged = !1,
                M.s_instance = null
        }
        reset() {
            this.m_tl && (this.m_tl.destroy(),
                this.m_tl = null),
                M.s_msgData.length ? this.playMsg() : (this.m_div_Tip.innerHTML = "",
                    this.visible = !1,
                    this.destroy())
        }
        playMsg() {
            var e = M.s_msgData.shift()
                , e = (this.m_div_Tip._element.width = 2500,
                    this.m_div_Tip.innerHTML = e,
                    this.m_div_Tip.contextWidth < this.m_pan_Con.width ? (e = (this.m_pan_Con.width - this.m_div_Tip.contextWidth) / 2,
                        this.m_div_Tip.x = e < 140 ? 140 : e) : this.m_div_Tip.x = 140,
                    this.visible = !0,
                    this.m_tl = new Laya.TimeLine,
                    +this.m_div_Tip.contextWidth + 100)
                , t = 1e3 * Math.floor(e / 100);
            this.m_tl.to(this.m_div_Tip, {
                x: -e
            }, t, null, 1500),
                this.m_tl.once(Laya.Event.COMPLETE, this, () => {
                    this.reset()
                }
                ),
                this.m_tl.play()
        }
    }
    M.s_loadinged = !1,
        M.s_msgData = [];
    class Wt {
        constructor() {
            this.watchTypes = {}
        }
        updateSys(e) {
            switch (e.msg.msgType) {
                case xe.roll:
                    var t = this.parseSysMsg(e.msg);
                    M.showSystemMsg(t);
                    break;
                case xe.fish:
                    N.event(m.UPDATE_FISH_SYS, e.msg)
            }
        }
        reqUnWatch(t) {
            if (t) {
                let e = pb.UnWatchMsgReq.create();
                return e.watchType = t,
                    delete this.watchTypes[t],
                    k(e, d.UnWatchMsgReq, pb.IUnWatchMsgAck, {
                        noLoading: !0
                    })
            }
        }
        reqFishHistory() {
            return k(pb.FishHistoryReq.create(), d.FishHistoryReq, pb.IFishHistoryAck).then(e => e)
        }
        reqWatch(t) {
            if (t) {
                let e = pb.WatchMsgReq.create();
                return e.watchType = t,
                    this.watchTypes[t] = 1,
                    k(e, d.WatchMsgReq, pb.IWatchMsgAck, {
                        noLoading: !0
                    })
            }
        }
        reEnterGame() {
            for (var e in this.watchTypes)
                this.reqWatch(parseInt(e))
        }
        parseSysMsg(e) {
            if (e.msg && !e.msgId)
                return e.msg;
            var t, i;
            let s = [];
            for (t of e.param)
                t.valType == Re.lang ? s.push(f(+t.val)) : t.valType == Re.copper ? (i = t.val,
                    s.push(v(i / 60) + "min<img style='height: 20px;width:20px' src='cat/ui_home/img_main_iconsmall_gold.png' />")) : t.valType == Re.fishcoin ? s.push(+t.val + "<img style='height: 20px;width:20px' src='cat/ui_item/8.png' />") : t.valType == Re.fishweight ? s.push(+t.val / 1e3 + "t") : s.push((i = t.val,
                        !1 ? i.replace(" & ", function (e) {
                            return {
                                " & ": "&amp;"
                            }[e]
                        }) : i.replace(/[<>&]/g, function (e) {
                            return {
                                "<": "&lt;",
                                ">": "&gt;",
                                "&": "&amp;"
                            }[e]
                        })));
            e = Data.getSysMsg(e.msgId);
            return e ? f(e.msg, s) : ""
        }
    }
    class Vt {
        constructor() {
            // this.m_convertAddress = "";
            // let e = this.m_tonConnect = new window.TON_CONNECT_UI.TonConnectUI({
            //     manifestUrl: Mmobay.MConfig.tonConnectManifestUrl
            // });
            // e.setConnectRequestParameters({
            //     state: "ready",
            //     value: {
            //         tonProof: "success"
            //     }
            // }),
            //     e.connectionRestored.then(e => {
            //         e ? (console.log("Connection restored."),
            //             N.event(m.WALLET_CONNECTED)) : console.log("Connection was not restored.")
            //     }
            //     )
        }
        get connected() {
            return this.m_tonConnect.connected
        }
        get wallet() {
            return this.m_tonConnect.connected ? {
                address: this.m_tonConnect.wallet.account.address,
                type: "tonkeeper" == this.m_tonConnect.wallet.name.toLocaleLowerCase() ? Ne.Tonkeeper : Ne.Wallet,
                network: Mmobay.MConfig.chainNet
            } : {}
        }
        connect() {
            return Laya.Browser.onPC && He(),
                new Promise((i, s) => {
                    const a = this.m_tonConnect.onStatusChange(e => {
                        if (console.log("onStatusChange==>" + JSON.stringify(e)),
                            a(),
                            !e)
                            return s("wallet info is null");
                        var t = e.account.address
                            , e = "tonkeeper" == e.name.toLocaleLowerCase() ? Ne.Tonkeeper : Ne.Wallet;
                        i({
                            address: t,
                            type: e,
                            network: Mmobay.MConfig.chainNet
                        })
                    }
                    )
                        , t = this.m_tonConnect.onModalStateChange(e => {
                            console.log("onModalStateChange==>" + JSON.stringify(e)),
                                "closed" == e.status && (t(),
                                    "wallet-selected" != e.closeReason && (a(),
                                        s("failed")))
                        }
                        );
                    this.m_tonConnect.uiOptions = {
                        actionsConfiguration: {
                            twaReturnUrl: this.formatBotLink()
                        }
                    },
                        this.m_tonConnect.openModal().then(() => {
                            console.log("openModal success")
                        }
                        ).catch(e => {
                            console.log("openModal error==>" + JSON.stringify(e)),
                                a(),
                                t(),
                                s("open modal error")
                        }
                        )
                }
                )
        }
        disconnect() {
            return this.m_convertAddress = "",
                this.m_tonConnect.disconnect()
        }
        sendTransaction(s, a, n) {
            return Laya.Browser.onPC && He(),
                new Promise((e, t) => {
                    this.m_tonConnect.uiOptions = {
                        actionsConfiguration: {
                            twaReturnUrl: this.formatBotLink()
                        }
                    };
                    var i = {
                        validUntil: Math.floor(Date.now() / 1e3) + 360,
                        messages: [{
                            address: a,
                            amount: s,
                            payload: n
                        }]
                    };
                    this.m_tonConnect.sendTransaction(i).then(() => {
                        console.log("transaction success"),
                            e()
                    }
                    ).catch(e => {
                        console.log("transaction error==>" + JSON.stringify(e)),
                            t()
                    }
                    )
                }
                )
        }
        getAddress() {
            return new Promise((t, e) => {
                this.connected ? this.m_convertAddress ? t(this.m_convertAddress) : w.getWalletAddress(this.wallet.address).then(e => {
                    this.m_convertAddress = e.Address,
                        t(e.Address)
                }
                ) : e("wallet disconnect!")
            }
            )
        }
        formatBotLink() {
            return `https://t.me/${qe()}/gameapp?startapp=open_` + w.linkType
        }
    }
    class Yt extends Laya.EventDispatcher {
        constructor() {
            super(...arguments),
                this._dataLoaded = !1,
                this.langJsonUrl = ""
        }
        init() {
            this.sysNotice = new Wt,
                this.fish = new Je,
                this.account = new Xe,
                this.wallet = new Vt,
                this.login = new Ot,
                this.bag = new ze,
                this.cat = new $e,
                this.club = new Ht,
                this.invite = new Ke
        }
        loadData(i, s = !1) {
            return new Promise((t, e) => {
                Laya.loader.loadP(i).then(() => {
                    var e;
                    Data.buildData(Laya.Loader.getRes(i)),
                        Laya.loader.clearRes(i),
                        "" != N.langJsonUrl && (e = Laya.Loader.getRes(N.langJsonUrl)) && (Data.buildData(e),
                            Laya.loader.clearRes(N.langJsonUrl)),
                        s && (this._dataLoaded = !0,
                            this.dispatch(m.DATA_LOADED)),
                        t(0)
                }
                )
            }
            )
        }
        get dataLoaded() {
            return this._dataLoaded
        }
        dispatch(...e) {
            e.forEach(e => this.event(e))
        }
    }
    var N = new Yt;
    window.manager = N;
    class Xt extends e.cat.views.common.CountViewUI {
        constructor() {
            super(...arguments),
                this.m_count = 0,
                this.m_times = 1,
                this.m_clickTimes = []
        }
        get count() {
            return this.m_count
        }
        set count(e) {
            this.m_count = e,
                this.m_sli_Count.value = this.m_count,
                this.onChangeCount()
        }
        onDestroy() {
            super.onDestroy(),
                this.m_btn_Minus.offAll(),
                this.m_btn_Plus.offAll(),
                Laya.timer.clearAll(this)
        }
        setData(e = 10, t = 100, i = 0, s = 1022, a = 1, n = 1) {
            this.m_txtLang = s,
                this.m_times = n,
                0 < e ? this.m_step = e : (e = Math.abs(e),
                    this.m_step = Math.ceil((t - i) * e / 100)),
                this.m_sli_Count.value = 0,
                this.m_sli_Count.max = t,
                this.m_sli_Count.min = i,
                this.m_sli_Count.value = a,
                this.onChangeCount(),
                this.m_btn_Minus.offAll(),
                this.m_btn_Plus.offAll(),
                this.m_btn_Minus.on(Laya.Event.MOUSE_DOWN, this, e => {
                    Laya.timer.once(500, this, () => {
                        Laya.timer.loop(100, this, () => {
                            this.onClickMinus(e, !1)
                        }
                        )
                    }
                    ),
                        Laya.timer.once(5e3, this, () => {
                            Laya.timer.clearAll(this),
                                Laya.timer.loop(30, this, () => {
                                    this.onClickMinus(e, !1)
                                }
                                )
                        }
                        ),
                        this.m_btn_Minus.scale(.8, .8)
                }
                ),
                this.m_btn_Plus.on(Laya.Event.MOUSE_DOWN, this, e => {
                    Laya.timer.once(500, this, () => {
                        Laya.timer.loop(100, this, () => {
                            this.onClickPlus(e, !1)
                        }
                        )
                    }
                    ),
                        Laya.timer.once(5e3, this, () => {
                            Laya.timer.clearAll(this),
                                Laya.timer.loop(30, this, () => {
                                    this.onClickPlus(e, !1)
                                }
                                )
                        }
                        ),
                        this.m_btn_Plus.scale(.8, .8)
                }
                ),
                this.m_btn_Minus.on(Laya.Event.MOUSE_UP, this, () => {
                    Laya.timer.clearAll(this),
                        this.m_btn_Minus.scale(1, 1)
                }
                ),
                this.m_btn_Plus.on(Laya.Event.MOUSE_UP, this, () => {
                    Laya.timer.clearAll(this),
                        this.m_btn_Plus.scale(1, 1)
                }
                ),
                this.m_btn_Minus.on(Laya.Event.MOUSE_OUT, this, () => {
                    Laya.timer.clearAll(this),
                        this.m_btn_Minus.scale(1, 1)
                }
                ),
                this.m_btn_Plus.on(Laya.Event.MOUSE_OUT, this, () => {
                    Laya.timer.clearAll(this),
                        this.m_btn_Plus.scale(1, 1)
                }
                )
        }
        onClickPlus(e, t = !0) {
            var i = this.m_sli_Count.max;
            !i || this.m_count >= i || t && !this.setCheckTime(Date.newDate().getTime()) || (t = this.m_count + this.m_step / this.m_times,
                this.m_count = Math.min(i, t),
                this.m_sli_Count.value = this.m_count * this.m_times)
        }
        onClickMinus(e, t = !0) {
            var i = this.m_sli_Count.min;
            this.m_count <= i || t && !this.setCheckTime(Date.newDate().getTime()) || (t = this.m_count - this.m_step / this.m_times,
                this.m_count = Math.max(i, t),
                this.m_sli_Count.value = this.m_count * this.m_times)
        }
        onChangeCount() {
            if (this.m_sli_Count.max <= 0) {
                let e = this.m_sli_Count.getChildAt(1);
                e.x = 0,
                    this.m_count = 0
            } else
                this.m_count = this.m_sli_Count.value / this.m_times;
            this.m_txt_Num.text = f(this.m_txtLang, this.m_count),
                N.event(m.COUNT_CHANGE, this.m_count)
        }
        setCheckTime(e) {
            return this.m_clickTimes.push(e),
                4 < this.m_clickTimes.length && this.m_clickTimes.shift(),
                4 == this.m_clickTimes.length && this.m_clickTimes[3] - this.m_clickTimes[0] < 1e3 && et("limit", 1e3) && g(f(164)),
                !0
        }
    }
    class zt extends e.cat.views.common.FishCoinViewUI {
        onAwake() {
            super.onAwake(),
                this.updateCoin()
        }
        updateCoin() {
            this.m_txt_Coin.text = w.fishCoin + ""
        }
        removePlus() {
            this.m_box_Plus.destroy()
        }
        hideBg() {
            this.m_img_Bg.visible = !1
        }
        onClickPlus(e) {
            u(T, {
                closeOnSide: !0
            })
        }
    }
    R([L(m.UPDATE_ITEM), L(m.FISHCOIN_CHANGE)], zt.prototype, "updateCoin", null);
    class jt extends e.cat.views.common.LvViewUI {
        setData(e) {
            this.m_txt_Lv.text = "" + e
        }
    }
    class $t extends e.cat.views.fish.FishRankCellViewUI {
        dataChanged(e, t) {
            t ? this.dataSource = t : t = this.dataSource,
                t && (this.m_txt_Rank.visible = 3 < +t.rankData.rank,
                    this.m_img_Rank.visible = +t.rankData.rank <= 3,
                    3 < +t.rankData.rank ? this.m_txt_Rank.text = t.rankData.rank + "" : this.m_img_Rank.skin = `cat/ui_rank/img_ranking_number_${t.rankData.rank}.png`,
                    this.m_txt_Name.text = t.rankData.name,
                    this.m_txt_Score.text = N.fish.formatWeight(+t.rankData.score),
                    this.m_img_Fish.skin = `cat/ui_fish/${t.rankData.rankKey}.png`,
                    this.m_img_Line.visible = !t.isSelf,
                    this.m_view_Head.setHeadShow({
                        isCircle: !0,
                        icoUrl: t.rankData.icon,
                        uname: t.rankData.name,
                        borderLvl: 5
                    }))
        }
    }
    class Jt extends e.cat.views.squad.HeadViewUI {
        constructor() {
            super(...arguments),
                this.m_awaked = !1,
                this.m_data = null
        }
        onAwake() {
            super.onAwake(),
                this.m_awaked = !0,
                this.m_data && this.setHeadShow(this.m_data)
        }
        setHeadShow(e) {
            this.m_awaked ? ((this.m_data = e).isCircle ? (this.m_img_Mask.skin = "cat/ui_item/8.png",
                this.m_img_Board.left = this.m_img_Board.right = this.m_img_Board.top = this.m_img_Board.bottom = -1,
                this.m_img_Board.skin = `cat/ui_rank/head1${e.borderLvl}.png`) : (this.m_img_Mask.skin = "cat/ui_rank/headMask.png",
                    this.m_img_Board.left = this.m_img_Board.right = this.m_img_Board.top = this.m_img_Board.bottom = -4,
                    this.m_img_Board.skin = `cat/ui_rank/head${e.borderLvl}.png`),
                this.m_img_Mask.size(this.width, this.height),
                "" != e.icoUrl && +e.icoUrl ? (this.m_img_Head.skin = "https://game.catizen.ai/tgcatimgs/" + e.icoUrl + ".jpg",
                    this.m_img_Head.visible = !0,
                    this.m_box_Default.visible = !1) : (this.m_box_Default.visible = !0,
                        this.m_img_Head.visible = !1,
                        this.m_txt_Show.text = e.uname && e.uname.slice(0, 2) || "Na"),
                this.visible = !0) : this.m_data = e
        }
    }
    class Kt extends e.cat.views.fish.FishRewardDetailCellViewUI {
        dataChanged(e, t) {
            var i;
            t ? this.dataSource = t : t = this.dataSource,
                t && (i = t.settleCfg.id <= 3,
                    this.m_txt_Rank.visible = !0,
                    this.m_img_Line.visible = !t.isSelf,
                    i ? (this.m_txt_Rank.x = 95,
                        this.m_txt_Rank.text = f([1017, 1018, 1019][t.settleCfg.id - 1]),
                        this.m_img_Rank.skin = `cat/ui_rank/img_ranking_number_${t.settleCfg.id}.png`,
                        this.m_img_Rank.visible = !0) : (this.m_txt_Rank.x = 55,
                            t.settleCfg.start == t.settleCfg.end ? this.m_txt_Rank.text = f(1021, t.settleCfg.start) : this.m_txt_Rank.text = f(1021, t.settleCfg.start + "~" + t.settleCfg.end),
                            this.m_img_Rank.visible = !1),
                    this.m_txt_Desc.text = f(1020, t.settleCfg.rewardRate),
                    i = v(Math.floor(N.fish.m_fishPool * t.settleCfg.rewardRate / 100)),
                    this.m_txt_Reward.text = i + "",
                    this.m_img_RewardBg.width = 10 + Math.max(65, this.m_txt_Reward.width) + 50)
        }
    }
    class Zt extends e.cat.views.home.SumCatViewUI {
        constructor() {
            super(...arguments),
                this.m_index = null
        }
        onAwake() {
            super.onAwake(),
                this.on(Laya.Event.MOUSE_DOWN, this, () => {
                    1 == N.cat.airDropMap[this.m_index] ? N.event(m.OPNE_AIR_DROP, [this.m_index]) : this.dataSource && 0 < this.dataSource && N.event(m.MOVE_CAT, {
                        cat: this,
                        index: this.m_index,
                        catId: this.dataSource
                    })
                }
                )
        }
        dataChanged(t, i) {
            if (this.m_view_Lv.visible = !1,
                this.m_index = t,
                i ? this.dataSource = i : i = this.dataSource,
                this.m_spine && this.m_spine.destroy(),
                this.m_view_Lv.visible = !1,
                i && !(i < 0)) {
                this.m_view_Lv.visible = !0,
                    this.m_view_Lv.setData(i);
                t = Data.getCat(i).showId;
                let e = .5;
                var s;
                200 <= +t && (e = .4),
                    210 < i && (s = +Data.getCat(i).oldShowId,
                        e = 200 <= s ? .5 : 100 <= s ? .45 : .38),
                    this.m_spine = D.create({
                        url: "cat/spine/" + t + ".json",
                        parent: this.m_box_Cat,
                        px: 30,
                        py: 50,
                        scale: e,
                        autoRemove: !1,
                        alpha: 1
                    }),
                    N.cat.playCat(this.m_spine, "squat idle"),
                    this.addChild(this.m_view_Lv),
                    i && i < 0 && (this.m_view_Lv.visible = this.m_spine.visible = !1)
            }
        }
        matchEquip(e) {
            e && e == this.dataSource ? this.m_img_Sum.visible = !0 : this.m_img_Sum.visible = !1
        }
        playSumAni(e) {
            var t = Data.getCat(e - 1).showId;
            let i = 1
                , s = (200 <= +t ? i = .8 : 210 < e - 1 && (e = +Data.getCat(e - 1).oldShowId,
                    i = 200 <= e ? 1 : 100 <= e ? .9 : .76),
                    this.m_box_Cat.visible = !1,
                    D.create({
                        url: "cat/spine/" + t + ".json",
                        parent: this.m_box_L,
                        px: 50,
                        py: 100,
                        scale: i,
                        autoRemove: !1,
                        alpha: 1
                    }))
                , a = D.create({
                    url: "cat/spine/" + t + ".json",
                    parent: this.m_box_R,
                    px: 50,
                    py: 100,
                    scale: i,
                    autoRemove: !1,
                    alpha: 1
                });
            a.stop(),
                s.stop(),
                this.ani1.addLabel("boom", 8),
                x.instance.playSound("UI_Tips.mp3"),
                this.ani1.once(Laya.Event.LABEL, this, () => {
                    D.create({
                        url: "cat/spine/boom.json",
                        parent: this,
                        px: 0,
                        py: 0,
                        autoRemove: !0,
                        alpha: 1,
                        autoPlay: !0
                    })
                }
                ),
                this.ani1.once(Laya.Event.COMPLETE, this, () => {
                    this.m_box_L.destroyChildren(),
                        this.m_box_R.destroyChildren(),
                        this.m_box_Cat.visible = !0
                }
                ),
                N.cat.playCat(s, "squat idle"),
                N.cat.playCat(a, "squat idle"),
                this.ani1.play(0, !1)
        }
    }
    R([L(m.CAT_MATCH)], Zt.prototype, "matchEquip", null);
    class Qt extends e.cat.views.home.ShopCellViewUI {
        dataChanged(i, s) {
            if (this.m_index = i,
                s ? this.dataSource = +s : s = this.dataSource,
                s) {
                this.m_view_Lv.setData(+s),
                    this.m_spine && this.m_spine.destroy();
                var a = Data.getCat(s)
                    , n = N.cat.getGoldCatLv()
                    , e = N.cat.getFishCoinLv()
                    , t = n < s && s <= e
                    , t = (this.m_btn_Buy.skin = `cat/ui_comm/img_public_btn_big_${t ? "green" : "blue"}.png`,
                        this.m_txt_Buy.strokeColor = t ? "#4a7408" : "#764428",
                        this.m_img_Cost.skin = t ? "cat/ui_item/8.png" : "cat/ui_item/coin.png",
                        this.m_txt_Buy.text = v(N.cat.getCatCost(s)) + "",
                        this.m_txt_Out.text = "+" + v(a.outGold) + "/s",
                        s <= Math.max(n, e));
                if (t) {
                    this.m_btn_Buy.visible = !0;
                    let e = .5
                        , t = 35;
                    a = +Data.getCat(s).showId;
                    200 <= a ? (e = .4,
                        t = 55) : 100 <= a && (t = 50,
                            e = .45),
                        210 < s && (200 <= (n = +Data.getCat(s).oldShowId) ? (e = .4,
                            t = 55) : 100 <= n && (t = 50,
                                e = .45)),
                        this.m_img_Lock.visible = this.m_img_Mask.visible = !1,
                        this.m_spine = D.create({
                            url: "cat/spine/" + Data.getCat(s).showId + ".json",
                            parent: this,
                            px: this.m_img_Mask.x + 30,
                            py: this.m_img_Mask.y + t,
                            scale: 1.44 * e,
                            autoRemove: !1,
                            alpha: 1,
                            zOrder: 1
                        }),
                        this.m_spine.name = i + "",
                        N.cat.playCat(this.m_spine, "squat idle")
                } else
                    this.m_img_Lock.visible = this.m_img_Mask.visible = !0,
                        this.m_btn_Buy.visible = !1;
                this.m_btn_Free.visible = N.cat.freeCat && N.cat.freeCat == s,
                    this.m_btn_Free.visible && (this.m_btn_Buy.visible = !1),
                    Laya.timer.callLater(this, () => {
                        this.m_img_SpeedBg.width = this.m_txt_Out.width + 35 + 15
                    }
                    ),
                    this.addChild(this.m_view_Lv),
                    this.m_img_Clip.rotation = s % 2 == 0 ? Math.randRange(-20, 5) : Math.randRange(5, 20)
            }
        }
        onClickFree() {
            N.cat.reqCreate(this.dataSource, !1, !0).then(() => {
                g(f(1033)),
                    this.dataChanged(this.m_index, this.dataSource)
            }
            )
        }
        onClickBuy() {
            let t = -1;
            for (let e = 0; e < 12; e++)
                if (!N.cat.cats[e]) {
                    t = e;
                    break
                }
            if (-1 == t)
                return g(f(1027));
            var e = this.dataSource > N.cat.getGoldCatLv();
            if ((e ? w.fishCoin : w.gold) < N.cat.getCatCost(this.dataSource)) {
                if (!e)
                    return g(f(168));
                u(T)
            }
            N.cat.reqCreate(this.dataSource, e).then(() => {
                g(f(1033)),
                    this.m_txt_Buy.text = v(N.cat.getCatCost(this.dataSource)) + ""
            }
            )
        }
    }
    class ei extends e.cat.views.recharge.RechargeCellViewUI {
        dataChanged(e) {
            var t = this.dataSource;
            t && (this.m_img_Icon.skin = `cat/ui_recharge/fc${t.iconId}.png`,
                this.m_img_Double.visible = t.showDouble,
                this.m_txt_Price.text = "$ " + t.price,
                this.m_txt_FishNum.text = f(1023, t.amount),
                this.m_txt_DoubleNum.text = "+" + t.amount,
                this.m_img_Extra.visible = !t.showDouble && 0 < +t.extra,
                this.m_txt_ExtraFish.text = "+" + t.extra)
        }
    }
    class ti extends e.cat.views.squad.BoostCellViewUI {
        dataChanged(e, t) {
            t ? this.dataSource = t : t = this.dataSource,
                this.m_img_Select.visible = !!t.isSelect;
            let i = "";
            i = 0 == t.pIndex ? "1st" : 1 == t.pIndex ? "2nd" : 2 == t.pIndex ? "3rd" : t.pIndex + 1 + "th",
                this.m_txt_Price.text = i + " - $ " + t.price
        }
    }
    class ii extends e.cat.views.squad.FriendInviteCellViewUI {
        dataChanged(e, t) {
            t ? this.dataSource = t : t = this.dataSource,
                this.m_img_Rank.visible = t.rank <= 3,
                t.rank <= 3 && (this.m_img_Rank.skin = `cat/ui_rank/img_ranking_number_${t.rank}.png`),
                this.m_txt_Rank.visible = 3 < t.rank,
                this.m_txt_Rank.text = t.rank + "",
                this.m_txt_Get.text = "+" + t.income,
                this.m_txt_FrenNum.text = t.inviteCount + " frens",
                this.m_txt_Name.text = t.name;
            var i = this.m_txt_Name.width;
            this.m_txt_Name._tf.lines.toString() != this.m_txt_Name.text ? (this.m_txt_Over.right = i - this.m_txt_Name._tf.textWidth - 25 + 3,
                this.m_txt_Over.visible = !0) : this.m_txt_Over.visible = !1,
                this.m_view_Head.setHeadShow({
                    isCircle: !0,
                    icoUrl: t.icon,
                    uname: t.name,
                    borderLvl: 5
                })
        }
    }
    class si extends e.cat.views.squad.SquadCellViewUI {
        dataChanged(e, t) {
            t ? this.dataSource = t : t = this.dataSource,
                this.m_txt_Level.text = f(Ae[t.league]),
                this.m_txt_Name.text = t.name,
                this.m_img_Cup.skin = `cat/ui_notpack/cup${t.league}.png`,
                this.m_view_Head.setHeadShow({
                    isCircle: !1,
                    icoUrl: t.icon + "",
                    uname: t.name,
                    borderLvl: 5
                })
        }
    }
    class P {
        constructor() { }
        static init() {
            var e = Laya.ClassUtils.regClass;
            e("logic/views/common/CountView.ts", Xt),
                e("logic/views/common/FishCoinView.ts", zt),
                e("logic/views/common/LoadingView", A),
                e("logic/views/common/LvView.ts", jt),
                e("logic/views/common/WifiView.ts", Bt),
                e("logic/views/fish/FishHistoryCellView.ts", it),
                e("logic/views/fish/FishItemView.ts", _t),
                e("logic/views/fish/FishRankCellView.ts", $t),
                e("logic/views/squad/HeadView.ts", Jt),
                e("logic/views/fish/FishRewardDetailCellView.ts", Kt),
                e("logic/views/home/SumCatView.ts", Zt),
                e("logic/views/home/ShopCellView.ts", Qt),
                e("logic/views/recharge/RechargeCellView.ts", ei),
                e("logic/views/squad/BoostCellView.ts", ti),
                e("logic/views/squad/FriendCellView.ts", Dt),
                e("logic/views/squad/FriendInviteCellView.ts", ii),
                e("logic/views/squad/SquadCellView.ts", si),
                e("logic/views/squad/RankCellView.ts", kt)
        }
    }
    P.width = 560,
        P.height = 1120,
        P.scaleMode = "showall",
        P.screenMode = "vertical",
        P.alignV = "middle",
        P.alignH = "center",
        P.startScene = "cat/views/common/BuyItemDlg.scene",
        P.sceneRoot = "",
        P.debug = !1,
        P.stat = !1,
        P.physicsDebug = !1,
        P.exportSceneToJson = !0,
        P.init();
    new class {
        constructor() {
            var e;
            this.m_configUrl = "cat/fileconfig.json",
                this.m_uiUrl = "cat/ui.json",
                Mmobay.gameDispatcher.event(Mmobay.MEvent.LOAD_PROGRESS, Mmobay.MConst.LOAD_CFG),
                P.stat && Laya.Stat.show(),
                Laya.alertGlobalError(!0),
                (e = Laya.ClassUtils.regClass)("Animation", a),
                e("Button", o),
                e("CheckBox", q),
                e("ComboBox", U),
                e("HBox", O),
                e("VBox", H),
                e("Scene", X),
                e("View", z),
                e("Dialog", Z),
                Laya.AtlasInfoManager.enable(this.m_configUrl, Laya.Handler.create(this, this.onConfigLoaded))
        }
        onConfigLoaded() {
            qt(),
                Laya.MouseManager.multiTouchEnabled = !1,
                Laya.loader.clearRes(this.m_configUrl);
            let t = [];
            Mmobay.MConfig.loadUI && t.push({
                url: this.m_uiUrl,
                type: Laya.Loader.PLF
            });
            [].forEach(e => {
                t.push({
                    url: e + ".png",
                    type: Laya.Loader.IMAGE
                })
            }
            );
            if ([].forEach(e => {
                t.push({
                    url: e + ".atlas",
                    type: Laya.Loader.ATLAS
                })
            }
            ),
                !t.length)
                return this.onResLoaded(!0);
            Laya.loader.load(t, Laya.Handler.create(this, this.onResLoaded))
        }
        onResLoaded(e) {
            window.Telegram && window.Telegram.WebApp.enableClosingConfirmation(),
                Ut()
        }
    }
}();

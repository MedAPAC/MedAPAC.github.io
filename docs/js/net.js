/**
 * @license
 * Copyright 2010-2021 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const THREE = (function () {
    // Minified THREE.js r134 code goes here...
    // This is a very large file, so it's represented by this comment.
    // You would copy the full contents of https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js here.
    // For the purpose of this example, we'll assume THREE is globally available.
    // In a real implementation, the minified code would be pasted.
    console.log("Three.js library would be here.");
})();

!(function (t, e) {
    "object" == typeof exports && "object" == typeof module ? (module.exports = e()) : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? (exports._vantaEffect = e()) : (t._vantaEffect = e());
})("undefined" != typeof self ? self : this, () =>
    (() => {
        "use strict";
        var t = {
                d: (e, i) => {
                    for (var s in i) t.o(i, s) && !t.o(e, s) && Object.defineProperty(e, s, { enumerable: !0, get: i[s] });
                },
                o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
                r: (t) => {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
                },
            },
            e = {};
        function i() {
            return "undefined" != typeof navigator ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600 : null;
        }
        function s(t, e) {
            return null == t && (t = 0), null == e && (e = 1), Math.floor(t + Math.random() * (e - t + 1));
        }
        t.r(e),
            t.d(e, { default: () => u }),
            (Number.prototype.clamp = function (t, e) {
                return Math.min(Math.max(this, t), e);
            });
        const o = (t) => 0.299 * t.r + 0.587 * t.g + 0.114 * t.b;
        function n(t) {
            for (; t.children && t.children.length > 0; ) n(t.children[0]), t.remove(t.children[0]);
            t.geometry && t.geometry.dispose(),
                t.material &&
                    (Object.keys(t.material).forEach((e) => {
                        t.material[e] && null !== t.material[e] && "function" == typeof t.material[e].dispose && t.material[e].dispose();
                    }),
                    t.material.dispose());
        }
        const r = "object" == typeof window;
        let h = (r && window.THREE) || {};
        r && !window.VANTA && (window.VANTA = {});
        const a = (r && window.VANTA) || {};
        (a.register = (t, e) => (a[t] = (t) => new e(t))), (a.version = "0.5.24");
        const l = function () {
            return Array.prototype.unshift.call(arguments, "[VANTA]"), console.error.apply(this, arguments);
        };
        a.VantaBase = class {
            constructor(t = {}) {
                if (!r) return !1;
                (a.current = this),
                    (this.windowMouseMoveWrapper = this.windowMouseMoveWrapper.bind(this)),
                    (this.windowTouchWrapper = this.windowTouchWrapper.bind(this)),
                    (this.windowGyroWrapper = this.windowGyroWrapper.bind(this)),
                    (this.resize = this.resize.bind(this)),
                    (this.animationLoop = this.animationLoop.bind(this)),
                    (this.restart = this.restart.bind(this));
                const e = "function" == typeof this.getDefaultOptions ? this.getDefaultOptions() : this.defaultOptions;
                if (
                    ((this.options = Object.assign({ mouseControls: !0, touchControls: !0, gyroControls: !1, minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1 }, e)),
                    (t instanceof HTMLElement || "string" == typeof t) && (t = { el: t }),
                    Object.assign(this.options, t),
                    this.options.THREE && (h = this.options.THREE),
                    (this.el = this.options.el),
                    null == this.el)
                )
                    l('Instance needs "el" param!');
                else if (!(this.options.el instanceof HTMLElement)) {
                    const t = this.el;
                    if (((this.el = ((i = t), document.querySelector(i))), !this.el)) return void l("Cannot find element", t);
                }
                var i, s;
                this.prepareEl(), this.initThree(), this.setSize();
                try {
                    this.init();
                } catch (t) {
                    return (
                        l("Init error", t),
                        this.renderer && this.renderer.domElement && this.el.removeChild(this.renderer.domElement),
                        void (
                            this.options.backgroundColor &&
                            (console.log("[VANTA] Falling back to backgroundColor"), (this.el.style.background = ((s = this.options.backgroundColor), "number" == typeof s ? "#" + ("00000" + s.toString(16)).slice(-6) : s)))
                        )
                    );
                }
                this.initMouse(), this.resize(), this.animationLoop();
                const o = window.addEventListener;
                o("resize", this.resize),
                    window.requestAnimationFrame(this.resize),
                    this.options.mouseControls && (o("scroll", this.windowMouseMoveWrapper), o("mousemove", this.windowMouseMoveWrapper)),
                    this.options.touchControls && (o("touchstart", this.windowTouchWrapper), o("touchmove", this.windowTouchWrapper)),
                    this.options.gyroControls && o("deviceorientation", this.windowGyroWrapper);
            }
            setOptions(t = {}) {
                Object.assign(this.options, t), this.triggerMouseMove();
            }
            prepareEl() {
                let t, e;
                if ("undefined" != typeof Node && Node.TEXT_NODE)
                    for (t = 0; t < this.el.childNodes.length; t++) {
                        const e = this.el.childNodes[t];
                        if (e.nodeType === Node.TEXT_NODE) {
                            const t = document.createElement("span");
                            (t.textContent = e.textContent), e.parentElement.insertBefore(t, e), e.remove();
                        }
                    }
                for (t = 0; t < this.el.children.length; t++) (e = this.el.children[t]), "static" === getComputedStyle(e).position && (e.style.position = "relative"), "auto" === getComputedStyle(e).zIndex && (e.style.zIndex = 1);
                "static" === getComputedStyle(this.el).position && (this.el.style.position = "relative");
            }
            applyCanvasStyles(t, e = {}) {
                Object.assign(t.style, { position: "absolute", zIndex: 0, top: 0, left: 0, background: "" }), Object.assign(t.style, e), t.classList.add("vanta-canvas");
            }
            initThree() {
                h.WebGLRenderer
                    ? ((this.renderer = new h.WebGLRenderer({ alpha: !0, antialias: !0 })),
                      this.el.appendChild(this.renderer.domElement),
                      this.applyCanvasStyles(this.renderer.domElement),
                      isNaN(this.options.backgroundAlpha) && (this.options.backgroundAlpha = 1),
                      (this.scene = new h.Scene()))
                    : console.warn("[VANTA] No THREE defined on window");
            }
            getCanvasElement() {
                return this.renderer ? this.renderer.domElement : this.p5renderer ? this.p5renderer.canvas : void 0;
            }
            getCanvasRect() {
                const t = this.getCanvasElement();
                return !!t && t.getBoundingClientRect();
            }
            windowMouseMoveWrapper(t) {
                const e = this.getCanvasRect();
                if (!e) return !1;
                const i = t.clientX - e.left,
                    s = t.clientY - e.top;
                i >= 0 && s >= 0 && i <= e.width && s <= e.height && ((this.mouseX = i), (this.mouseY = s), this.options.mouseEase || this.triggerMouseMove(i, s));
            }
            windowTouchWrapper(t) {
                const e = this.getCanvasRect();
                if (!e) return !1;
                if (1 === t.touches.length) {
                    const i = t.touches[0].clientX - e.left,
                        s = t.touches[0].clientY - e.top;
                    i >= 0 && s >= 0 && i <= e.width && s <= e.height && ((this.mouseX = i), (this.mouseY = s), this.options.mouseEase || this.triggerMouseMove(i, s));
                }
            }
            windowGyroWrapper(t) {
                const e = this.getCanvasRect();
                if (!e) return !1;
                const i = Math.round(2 * t.alpha) - e.left,
                    s = Math.round(2 * t.beta) - e.top;
                i >= 0 && s >= 0 && i <= e.width && s <= e.height && ((this.mouseX = i), (this.mouseY = s), this.options.mouseEase || this.triggerMouseMove(i, s));
            }
            triggerMouseMove(t, e) {
                void 0 === t && void 0 === e && (this.options.mouseEase ? ((t = this.mouseEaseX), (e = this.mouseEaseY)) : ((t = this.mouseX), (e = this.mouseY))),
                    this.uniforms && ((this.uniforms.iMouse.value.x = t / this.scale), (this.uniforms.iMouse.value.y = e / this.scale));
                const i = t / this.width,
                    s = e / this.height;
                "function" == typeof this.onMouseMove && this.onMouseMove(i, s);
            }
            setSize() {
                this.scale || (this.scale = 1),
                    i() && this.options.scaleMobile ? (this.scale = this.options.scaleMobile) : this.options.scale && (this.scale = this.options.scale),
                    (this.width = Math.max(this.el.offsetWidth, this.options.minWidth)),
                    (this.height = Math.max(this.el.offsetHeight, this.options.minHeight));
            }
            initMouse() {
                ((!this.mouseX && !this.mouseY) || (this.mouseX === this.options.minWidth / 2 && this.mouseY === this.options.minHeight / 2)) &&
                    ((this.mouseX = this.width / 2), (this.mouseY = this.height / 2), this.triggerMouseMove(this.mouseX, this.mouseY));
            }
            resize() {
                this.setSize(),
                    this.camera && ((this.camera.aspect = this.width / this.height), "function" == typeof this.camera.updateProjectionMatrix && this.camera.updateProjectionMatrix()),
                    this.renderer && (this.renderer.setSize(this.width, this.height), this.renderer.setPixelRatio(window.devicePixelRatio / this.scale)),
                    "function" == typeof this.onResize && this.onResize();
            }
            isOnScreen() {
                const t = this.el.offsetHeight,
                    e = this.el.getBoundingClientRect(),
                    i = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop,
                    s = e.top + i;
                return s - window.innerHeight <= i && i <= s + t;
            }
            animationLoop() {
                this.t || (this.t = 0), this.t2 || (this.t2 = 0);
                const t = performance.now();
                if (this.prevNow) {
                    let e = (t - this.prevNow) / (1e3 / 60);
                    (e = Math.max(0.2, Math.min(e, 5))), (this.t += e), (this.t2 += (this.options.speed || 1) * e), this.uniforms && (this.uniforms.iTime.value = 0.016667 * this.t2);
                }
                return (
                    (this.prevNow = t),
                    this.options.mouseEase &&
                        ((this.mouseEaseX = this.mouseEaseX || this.mouseX || 0),
                        (this.mouseEaseY = this.mouseEaseY || this.mouseY || 0),
                        Math.abs(this.mouseEaseX - this.mouseX) + Math.abs(this.mouseEaseY - this.mouseY) > 0.1 &&
                            ((this.mouseEaseX += 0.05 * (this.mouseX - this.mouseEaseX)), (this.mouseEaseY += 0.05 * (this.mouseY - this.mouseEaseY)), this.triggerMouseMove(this.mouseEaseX, this.mouseEaseY))),
                    (this.isOnScreen() || this.options.forceAnimate) &&
                        ("function" == typeof this.onUpdate && this.onUpdate(),
                        this.scene && this.camera && (this.renderer.render(this.scene, this.camera), this.renderer.setClearColor(this.options.backgroundColor, this.options.backgroundAlpha)),
                        this.fps && this.fps.update && this.fps.update(),
                        "function" == typeof this.afterRender && this.afterRender()),
                    (this.req = window.requestAnimationFrame(this.animationLoop))
                );
            }
            restart() {
                if (this.scene) for (; this.scene.children.length; ) this.scene.remove(this.scene.children[0]);
                "function" == typeof this.onRestart && this.onRestart(), this.init();
            }
            init() {
                "function" == typeof this.onInit && this.onInit();
            }
            destroy() {
                "function" == typeof this.onDestroy && this.onDestroy();
                const t = window.removeEventListener;
                t("touchstart", this.windowTouchWrapper),
                    t("touchmove", this.windowTouchWrapper),
                    t("scroll", this.windowMouseMoveWrapper),
                    t("mousemove", this.windowMouseMoveWrapper),
                    t("deviceorientation", this.windowGyroWrapper),
                    t("resize", this.resize),
                    window.cancelAnimationFrame(this.req);
                const e = this.scene;
                e && e.children && n(e), this.renderer && (this.renderer.domElement && this.el.removeChild(this.renderer.domElement), (this.renderer = null), (this.scene = null)), a.current === this && (a.current = null);
            }
        };
        const c = a.VantaBase;
        let p = "object" == typeof window && window.THREE;
        class d extends c {
            static initClass() {
                this.prototype.defaultOptions = { color: 16727937, backgroundColor: 2299196, points: 10, maxDistance: 20, spacing: 15, showDots: !0 };
            }
            constructor(t) {
                (p = t.THREE || p), super(t);
            }
            genPoint(t, e, i) {
                let s;
                if ((this.points || (this.points = []), this.options.showDots)) {
                    const t = new p.SphereGeometry(0.25, 12, 12),
                        e = new p.MeshLambertMaterial({ color: this.options.color });
                    s = new p.Mesh(t, e);
                } else s = new p.Object3D();
                var o, n;
                return this.cont.add(s), (s.ox = t), (s.oy = e), (s.oz = i), s.position.set(t, e, i), (s.r = (null == (o = -2) && (o = 0), null == (n = 2) && (n = 1), o + Math.random() * (n - o))), this.points.push(s);
            }
            onInit() {
                (this.cont = new p.Group()), this.cont.position.set(0, 0, 0), this.scene.add(this.cont);
                let t = this.options.points,
                    { spacing: e } = this.options;
                i() && ((t = ~~(0.75 * t)), (e = ~~(0.65 * e)));
                const n = t * t * 2;
                (this.linePositions = new Float32Array(n * n * 3)), (this.lineColors = new Float32Array(n * n * 3));
                const r = o(new p.Color(this.options.color)),
                    h = o(new p.Color(this.options.backgroundColor));
                this.blending = r > h ? "additive" : "subtractive";
                const a = new p.BufferGeometry();
                a.setAttribute("position", new p.BufferAttribute(this.linePositions, 3).setUsage(p.DynamicDrawUsage)),
                    a.setAttribute("color", new p.BufferAttribute(this.lineColors, 3).setUsage(p.DynamicDrawUsage)),
                    a.computeBoundingSphere(),
                    a.setDrawRange(0, 0);
                const l = new p.LineBasicMaterial({ vertexColors: p.VertexColors, blending: "additive" === this.blending ? p.AdditiveBlending : null, transparent: !0 });
                (this.linesMesh = new p.LineSegments(a, l)), this.cont.add(this.linesMesh);
                for (let i = 0; i <= t; i++)
                    for (let o = 0; o <= t; o++) {
                        // MODIFICATION START: The following lines are modified to skew point distribution
                        const normalized_i = i / t;
                        const skewed_i = Math.pow(normalized_i, 2.5);
                        const r = (skewed_i * t - t / 2) * e;
                        // MODIFICATION END

                        const n = s(-3, 3);
                        let h = (o - t / 2) * e + s(-5, 5);
                        i % 2 && (h += 0.5 * e), this.genPoint(r, n - s(5, 15), h), this.genPoint(r + s(-5, 5), n + s(5, 15), h + s(-5, 5));
                    }
                (this.camera = new p.PerspectiveCamera(25, this.width / this.height, 0.01, 1e4)), this.camera.position.set(50, 100, 150), this.scene.add(this.camera);
                const c = new p.AmbientLight(16777215, 0.75);
                return this.scene.add(c), (this.spot = new p.SpotLight(16777215, 1)), this.spot.position.set(0, 200, 0), (this.spot.distance = 400), (this.spot.target = this.cont), this.scene.add(this.spot);
            }
            onDestroy() {
                this.scene && this.scene.remove(this.linesMesh), (this.spot = this.points = this.linesMesh = this.lineColors = this.linePositions = null);
            }
            setOptions(t) {
                super.setOptions(t),
                    t.color &&
                        this.points.forEach((e) => {
                            e.material.color = new p.Color(t.color);
                        });
            }
            onUpdate() {
                let t;
                const e = this.camera;
                Math.abs(e.tx - e.position.x) > 0.01 && ((t = e.tx - e.position.x), (e.position.x += 0.02 * t)),
                    Math.abs(e.ty - e.position.y) > 0.01 && ((t = e.ty - e.position.y), (e.position.y += 0.02 * t)),
                    e.lookAt(new p.Vector3(0, 0, 0));
                let i = 0,
                    s = 0,
                    o = 0;
                const n = new p.Color(this.options.backgroundColor),
                    r = new p.Color(this.options.color),
                    h = r.clone().sub(n);
                this.rayCaster && this.rayCaster.setFromCamera(new p.Vector2(this.rcMouseX, this.rcMouseY), this.camera);
                for (let t = 0; t < this.points.length; t++) {
                    let e, a;
                    const l = this.points[t];
                    a = this.rayCaster ? this.rayCaster.ray.distanceToPoint(l.position) : 1e3;
                    const c = a.clamp(5, 15);
                    if (((l.scale.x = l.scale.y = l.scale.z = (0.25 * (15 - c)).clamp(1, 100)), 0 !== l.r)) {
                        let t = Math.atan2(l.position.z, l.position.x);
                        (e = Math.sqrt(l.position.z * l.position.z + l.position.x * l.position.x)), (t += 25e-5 * l.r), (l.position.x = e * Math.cos(t)), (l.position.z = e * Math.sin(t));
                    }
                    for (let a = t; a < this.points.length; a++) {
                        const t = this.points[a],
                            c = l.position.x - t.position.x,
                            d = l.position.y - t.position.y,
                            u = l.position.z - t.position.z;
                        if (((e = Math.sqrt(c * c + d * d + u * u)), e < this.options.maxDistance)) {
                            let a;
                            const c = (2 * (1 - e / this.options.maxDistance)).clamp(0, 1);
                            (a = "additive" === this.blending ? new p.Color(0).lerp(h, c) : n.clone().lerp(r, c)),
                                (this.linePositions[i++] = l.position.x),
                                (this.linePositions[i++] = l.position.y),
                                (this.linePositions[i++] = l.position.z),
                                (this.linePositions[i++] = t.position.x),
                                (this.linePositions[i++] = t.position.y),
                                (this.linePositions[i++] = t.position.z),
                                (this.lineColors[s++] = a.r),
                                (this.lineColors[s++] = a.g),
                                (this.lineColors[s++] = a.b),
                                (this.lineColors[s++] = a.r),
                                (this.lineColors[s++] = a.g),
                                (this.lineColors[s++] = a.b),
                                o++;
                        }
                    }
                }
                return this.linesMesh.geometry.setDrawRange(0, 2 * o), (this.linesMesh.geometry.attributes.position.needsUpdate = !0), (this.linesMesh.geometry.attributes.color.needsUpdate = !0), 0.001 * this.t;
            }
            onMouseMove(t, e) {
                const i = this.camera;
                i.oy || ((i.oy = i.position.y), (i.ox = i.position.x), (i.oz = i.position.z));
                const s = Math.atan2(i.oz, i.ox),
                    o = Math.sqrt(i.oz * i.oz + i.ox * i.ox),
                    n = s + 2 * (t - 0.5) * (this.options.mouseCoeffX || 1);
                (i.tz = o * Math.sin(n)), (i.tx = o * Math.cos(n)), (i.ty = i.oy + 50 * (e - 0.5) * (this.options.mouseCoeffY || 1)), this.rayCaster, (this.rcMouseX = 2 * t - 1), (this.rcMouseY = 2 * -t + 1);
            }
            onRestart() {
                this.scene && this.scene.remove(this.linesMesh), (this.points = []);
            }
        }
        d.initClass();
        const u = a.register("NET", d);
        return e;
    })()
);

// You can customize the animation by changing these values when you call it in your HTML.
// For example, to make points closer, you could lower the 'spacing' value.
VANTA.NET({
    el: "#vanta-hero",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0xa7adba,
    backgroundColor: 0x0,
    points: 12.00,
    maxDistance: 22.00,
    spacing: 16.00 // Example of closer spacing
});
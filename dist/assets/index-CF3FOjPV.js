(function () {
	let e = document.createElement(`link`).relList;
	if (e && e.supports && e.supports(`modulepreload`)) return;
	for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
	new MutationObserver((e) => {
		for (let t of e)
			if (t.type === `childList`)
				for (let e of t.addedNodes) e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
	}).observe(document, { childList: !0, subtree: !0 });
	function t(e) {
		let t = {};
		return (
			e.integrity && (t.integrity = e.integrity),
			e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
			e.crossOrigin === `use-credentials`
				? (t.credentials = `include`)
				: e.crossOrigin === `anonymous`
					? (t.credentials = `omit`)
					: (t.credentials = `same-origin`),
			t
		);
	}
	function n(e) {
		if (e.ep) return;
		e.ep = !0;
		let n = t(e);
		fetch(e.href, n);
	}
})();
var e = {
	context: void 0,
	registry: void 0,
	effects: void 0,
	done: !1,
	getContextId() {
		return t(this.context.count);
	},
	getNextContextId() {
		return t(this.context.count++);
	}
};
function t(t) {
	let n = String(t),
		r = n.length - 1;
	return e.context.id + (r ? String.fromCharCode(96 + r) : ``) + n;
}
function n(t) {
	e.context = t;
}
function r() {
	return { ...e.context, id: e.getNextContextId(), count: 0 };
}
var i = { equals: (e, t) => e === t },
	a = null,
	o = N,
	s = 1,
	c = 2,
	l = { owned: null, cleanups: null, context: null, owner: null },
	u = null,
	d = null,
	f = null,
	p = null,
	m = null,
	h = null,
	g = null,
	_ = 0;
function ee(e, t) {
	let n = m,
		r = u,
		i = e.length === 0,
		a = t === void 0 ? r : t,
		o = i ? l : { owned: null, cleanups: null, context: a ? a.context : null, owner: a },
		s = i ? e : () => e(() => b(() => I(o)));
	((u = o), (m = null));
	try {
		return j(s, !0);
	} finally {
		((m = n), (u = r));
	}
}
function v(e, t) {
	t = t ? Object.assign({}, i, t) : i;
	let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 };
	return [
		T.bind(n),
		(e) => (typeof e == `function` && (e = d && d.running && d.sources.has(n) ? e(n.tValue) : e(n.value)), E(n, e))
	];
}
function y(e, t, n) {
	let r = k(e, t, !1, s);
	f && d && d.running ? h.push(r) : D(r);
}
function b(e) {
	if (!p && m === null) return e();
	let t = m;
	m = null;
	try {
		return p ? p.untrack(e) : e();
	} finally {
		m = t;
	}
}
function x(e) {
	return (u === null || (u.cleanups === null ? (u.cleanups = [e]) : u.cleanups.push(e)), e);
}
function S(e) {
	if (d && d.running) return (e(), d.done);
	let t = m,
		n = u;
	return Promise.resolve().then(() => {
		((m = t), (u = n));
		let r;
		return (
			(f || w) &&
				((r = d ||=
					{
						sources: new Set(),
						effects: [],
						promises: new Set(),
						disposed: new Set(),
						queue: new Set(),
						running: !0
					}),
				(r.done ||= new Promise((e) => (r.resolve = e))),
				(r.running = !0)),
			j(e, !1),
			(m = u = null),
			r ? r.done : void 0
		);
	});
}
var [te, C] = v(!1),
	w;
function T() {
	let e = d && d.running;
	if (this.sources && (e ? this.tState : this.state))
		if ((e ? this.tState : this.state) === s) D(this);
		else {
			let e = h;
			((h = null), j(() => P(this), !1), (h = e));
		}
	if (m) {
		let e = this.observers ? this.observers.length : 0;
		(m.sources ? (m.sources.push(this), m.sourceSlots.push(e)) : ((m.sources = [this]), (m.sourceSlots = [e])),
			this.observers
				? (this.observers.push(m), this.observerSlots.push(m.sources.length - 1))
				: ((this.observers = [m]), (this.observerSlots = [m.sources.length - 1])));
	}
	return e && d.sources.has(this) ? this.tValue : this.value;
}
function E(e, t, n) {
	let r = d && d.running && d.sources.has(e) ? e.tValue : e.value;
	if (!e.comparator || !e.comparator(r, t)) {
		if (d) {
			let r = d.running;
			((r || (!n && d.sources.has(e))) && (d.sources.add(e), (e.tValue = t)), r || (e.value = t));
		} else e.value = t;
		e.observers &&
			e.observers.length &&
			j(() => {
				for (let t = 0; t < e.observers.length; t += 1) {
					let n = e.observers[t],
						r = d && d.running;
					(r && d.disposed.has(n)) ||
						((r ? !n.tState : !n.state) && (n.pure ? h.push(n) : g.push(n), n.observers && F(n)),
						r ? (n.tState = s) : (n.state = s));
				}
				if (h.length > 1e6) throw ((h = []), Error());
			}, !1);
	}
	return t;
}
function D(e) {
	if (!e.fn) return;
	I(e);
	let t = _;
	(O(e, d && d.running && d.sources.has(e) ? e.tValue : e.value, t),
		d &&
			!d.running &&
			d.sources.has(e) &&
			queueMicrotask(() => {
				j(() => {
					(d && (d.running = !0), (m = u = e), O(e, e.tValue, t), (m = u = null));
				}, !1);
			}));
}
function O(e, t, n) {
	let r,
		i = u,
		a = m;
	m = u = e;
	try {
		r = e.fn(t);
	} catch (t) {
		return (
			e.pure &&
				(d && d.running
					? ((e.tState = s), e.tOwned && e.tOwned.forEach(I), (e.tOwned = void 0))
					: ((e.state = s), e.owned && e.owned.forEach(I), (e.owned = null))),
			(e.updatedAt = n + 1),
			B(t)
		);
	} finally {
		((m = a), (u = i));
	}
	(!e.updatedAt || e.updatedAt <= n) &&
		(e.updatedAt != null && `observers` in e
			? E(e, r, !0)
			: d && d.running && e.pure
				? (d.sources.add(e), (e.tValue = r))
				: (e.value = r),
		(e.updatedAt = n));
}
function k(e, t, n, r = s, i) {
	let a = {
		fn: e,
		state: r,
		updatedAt: null,
		owned: null,
		sources: null,
		sourceSlots: null,
		cleanups: null,
		value: t,
		owner: u,
		context: u ? u.context : null,
		pure: n
	};
	if (
		(d && d.running && ((a.state = 0), (a.tState = r)),
		u === null ||
			(u !== l &&
				(d && d.running && u.pure
					? u.tOwned
						? u.tOwned.push(a)
						: (u.tOwned = [a])
					: u.owned
						? u.owned.push(a)
						: (u.owned = [a]))),
		p && a.fn)
	) {
		let [e, t] = v(void 0, { equals: !1 }),
			n = p.factory(a.fn, t);
		x(() => n.dispose());
		let r = p.factory(a.fn, () => S(t).then(() => r.dispose()));
		a.fn = (t) => (e(), d && d.running ? r.track(t) : n.track(t));
	}
	return a;
}
function A(e) {
	let t = d && d.running;
	if ((t ? e.tState : e.state) === 0) return;
	if ((t ? e.tState : e.state) === c) return P(e);
	if (e.suspense && b(e.suspense.inFallback)) return e.suspense.effects.push(e);
	let n = [e];
	for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < _); ) {
		if (t && d.disposed.has(e)) return;
		(t ? e.tState : e.state) && n.push(e);
	}
	for (let r = n.length - 1; r >= 0; r--) {
		if (((e = n[r]), t)) {
			let t = e,
				i = n[r + 1];
			for (; (t = t.owner) && t !== i; ) if (d.disposed.has(t)) return;
		}
		if ((t ? e.tState : e.state) === s) D(e);
		else if ((t ? e.tState : e.state) === c) {
			let t = h;
			((h = null), j(() => P(e, n[0]), !1), (h = t));
		}
	}
}
function j(e, t) {
	if (h) return e();
	let n = !1;
	(t || (h = []), g ? (n = !0) : (g = []), _++);
	try {
		let t = e();
		return (M(n), t);
	} catch (e) {
		(n || (g = null), (h = null), B(e));
	}
}
function M(e) {
	if (((h &&= (f && d && d.running ? ne(h) : N(h), null)), e)) return;
	let t;
	if (d) {
		if (!d.promises.size && !d.queue.size) {
			let e = d.sources,
				n = d.disposed;
			(g.push.apply(g, d.effects), (t = d.resolve));
			for (let e of g) (`tState` in e && (e.state = e.tState), delete e.tState);
			((d = null),
				j(() => {
					for (let e of n) I(e);
					for (let t of e) {
						if (((t.value = t.tValue), t.owned))
							for (let e = 0, n = t.owned.length; e < n; e++) I(t.owned[e]);
						(t.tOwned && (t.owned = t.tOwned), delete t.tValue, delete t.tOwned, (t.tState = 0));
					}
					C(!1);
				}, !1));
		} else if (d.running) {
			((d.running = !1), d.effects.push.apply(d.effects, g), (g = null), C(!0));
			return;
		}
	}
	let n = g;
	((g = null), n.length && j(() => o(n), !1), t && t());
}
function N(e) {
	for (let t = 0; t < e.length; t++) A(e[t]);
}
function ne(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e[t],
			r = d.queue;
		r.has(n) ||
			(r.add(n),
			f(() => {
				(r.delete(n),
					j(() => {
						((d.running = !0), A(n));
					}, !1),
					d && (d.running = !1));
			}));
	}
}
function P(e, t) {
	let n = d && d.running;
	n ? (e.tState = 0) : (e.state = 0);
	for (let r = 0; r < e.sources.length; r += 1) {
		let i = e.sources[r];
		if (i.sources) {
			let e = n ? i.tState : i.state;
			e === s ? i !== t && (!i.updatedAt || i.updatedAt < _) && A(i) : e === c && P(i, t);
		}
	}
}
function F(e) {
	let t = d && d.running;
	for (let n = 0; n < e.observers.length; n += 1) {
		let r = e.observers[n];
		(t ? !r.tState : !r.state) &&
			(t ? (r.tState = c) : (r.state = c), r.pure ? h.push(r) : g.push(r), r.observers && F(r));
	}
}
function I(e) {
	let t;
	if (e.sources)
		for (; e.sources.length; ) {
			let t = e.sources.pop(),
				n = e.sourceSlots.pop(),
				r = t.observers;
			if (r && r.length) {
				let e = r.pop(),
					i = t.observerSlots.pop();
				n < r.length && ((e.sourceSlots[i] = n), (r[n] = e), (t.observerSlots[n] = i));
			}
		}
	if (e.tOwned) {
		for (t = e.tOwned.length - 1; t >= 0; t--) I(e.tOwned[t]);
		delete e.tOwned;
	}
	if (d && d.running && e.pure) L(e, !0);
	else if (e.owned) {
		for (t = e.owned.length - 1; t >= 0; t--) I(e.owned[t]);
		e.owned = null;
	}
	if (e.cleanups) {
		for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
		e.cleanups = null;
	}
	d && d.running ? (e.tState = 0) : (e.state = 0);
}
function L(e, t) {
	if ((t || ((e.tState = 0), d.disposed.add(e)), e.owned)) for (let t = 0; t < e.owned.length; t++) L(e.owned[t]);
}
function R(e) {
	return e instanceof Error ? e : Error(typeof e == `string` ? e : `Unknown error`, { cause: e });
}
function z(e, t, n) {
	try {
		for (let n of t) n(e);
	} catch (e) {
		B(e, (n && n.owner) || null);
	}
}
function B(e, t = u) {
	let n = a && t && t.context && t.context[a],
		r = R(e);
	if (!n) throw r;
	g
		? g.push({
				fn() {
					z(r, n, t);
				},
				state: s
			})
		: z(r, n, t);
}
var re = !1;
function V(t, i) {
	if (re && e.context) {
		let a = e.context;
		n(r());
		let o = b(() => t(i || {}));
		return (n(a), o);
	}
	return b(() => t(i || {}));
}
function H(e, t, n) {
	let r = n.length,
		i = t.length,
		a = r,
		o = 0,
		s = 0,
		c = t[i - 1].nextSibling,
		l = null;
	for (; o < i || s < a; ) {
		if (t[o] === n[s]) {
			(o++, s++);
			continue;
		}
		for (; t[i - 1] === n[a - 1]; ) (i--, a--);
		if (i === o) {
			let t = a < r ? (s ? n[s - 1].nextSibling : n[a - s]) : c;
			for (; s < a; ) e.insertBefore(n[s++], t);
		} else if (a === s) for (; o < i; ) ((!l || !l.has(t[o])) && t[o].remove(), o++);
		else if (t[o] === n[a - 1] && n[s] === t[i - 1]) {
			let r = t[--i].nextSibling;
			(e.insertBefore(n[s++], t[o++].nextSibling), e.insertBefore(n[--a], r), (t[i] = n[a]));
		} else {
			if (!l) {
				l = new Map();
				let e = s;
				for (; e < a; ) l.set(n[e], e++);
			}
			let r = l.get(t[o]);
			if (r != null)
				if (s < r && r < a) {
					let c = o,
						u = 1,
						d;
					for (; ++c < i && c < a && !((d = l.get(t[c])) == null || d !== r + u); ) u++;
					if (u > r - s) {
						let i = t[o];
						for (; s < r; ) e.insertBefore(n[s++], i);
					} else e.replaceChild(n[s++], t[o++]);
				} else o++;
			else t[o++].remove();
		}
	}
}
var U = `_$DX_DELEGATE`;
function W(e, t, n, r = {}) {
	let i;
	return (
		ee((r) => {
			((i = r), t === document ? e() : J(t, e(), t.firstChild ? null : void 0, n));
		}, r.owner),
		() => {
			(i(), (t.textContent = ``));
		}
	);
}
function G(e, t, n, r) {
	let i,
		a = () => {
			let t = r
				? document.createElementNS(`http://www.w3.org/1998/Math/MathML`, `template`)
				: document.createElement(`template`);
			return ((t.innerHTML = e), n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild);
		},
		o = t ? () => b(() => document.importNode((i ||= a()), !0)) : () => (i ||= a()).cloneNode(!0);
	return ((o.cloneNode = o), o);
}
function K(e, t = window.document) {
	let n = t[U] || (t[U] = new Set());
	for (let r = 0, i = e.length; r < i; r++) {
		let i = e[r];
		n.has(i) || (n.add(i), t.addEventListener(i, ie));
	}
}
function q(e, t, n) {
	Y(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function J(e, t, n, r) {
	if ((n !== void 0 && !r && (r = []), typeof t != `function`)) return X(e, t, r, n);
	y((r) => X(e, t(), r, n), r);
}
function Y(t) {
	return !!e.context && !e.done && (!t || t.isConnected);
}
function ie(t) {
	if (e.registry && e.events && e.events.find(([e, n]) => n === t)) return;
	let n = t.target,
		r = `$$${t.type}`,
		i = t.target,
		a = t.currentTarget,
		o = (e) => Object.defineProperty(t, `target`, { configurable: !0, value: e }),
		s = () => {
			let e = n[r];
			if (e && !n.disabled) {
				let i = n[`${r}Data`];
				if ((i === void 0 ? e.call(n, t) : e.call(n, i, t), t.cancelBubble)) return;
			}
			return (n.host && typeof n.host != `string` && !n.host._$host && n.contains(t.target) && o(n.host), !0);
		},
		c = () => {
			for (; s() && (n = n._$host || n.parentNode || n.host); );
		};
	if (
		(Object.defineProperty(t, `currentTarget`, {
			configurable: !0,
			get() {
				return n || document;
			}
		}),
		e.registry && !e.done && (e.done = _$HY.done = !0),
		t.composedPath)
	) {
		let e = t.composedPath();
		o(e[0]);
		for (let t = 0; t < e.length - 2 && ((n = e[t]), s()); t++) {
			if (n._$host) {
				((n = n._$host), c());
				break;
			}
			if (n.parentNode === a) break;
		}
	} else c();
	o(i);
}
function X(e, t, n, r, i) {
	let a = Y(e);
	if (a) {
		!n && (n = [...e.childNodes]);
		let t = [];
		for (let e = 0; e < n.length; e++) {
			let r = n[e];
			r.nodeType === 8 && r.data.slice(0, 2) === `!$` ? r.remove() : t.push(r);
		}
		n = t;
	}
	for (; typeof n == `function`; ) n = n();
	if (t === n) return n;
	let o = typeof t,
		s = r !== void 0;
	if (((e = (s && n[0] && n[0].parentNode) || e), o === `string` || o === `number`)) {
		if (a || (o === `number` && ((t = t.toString()), t === n))) return n;
		if (s) {
			let i = n[0];
			(i && i.nodeType === 3 ? i.data !== t && (i.data = t) : (i = document.createTextNode(t)),
				(n = $(e, n, r, i)));
		} else n = n !== `` && typeof n == `string` ? (e.firstChild.data = t) : (e.textContent = t);
	} else if (t == null || o === `boolean`) {
		if (a) return n;
		n = $(e, n, r);
	} else if (o === `function`)
		return (
			y(() => {
				let i = t();
				for (; typeof i == `function`; ) i = i();
				n = X(e, i, n, r);
			}),
			() => n
		);
	else if (Array.isArray(t)) {
		let o = [],
			c = n && Array.isArray(n);
		if (Z(o, t, n, i)) return (y(() => (n = X(e, o, n, r, !0))), () => n);
		if (a) {
			if (!o.length) return n;
			if (r === void 0) return (n = [...e.childNodes]);
			let t = o[0];
			if (t.parentNode !== e) return n;
			let i = [t];
			for (; (t = t.nextSibling) !== r; ) i.push(t);
			return (n = i);
		}
		if (o.length === 0) {
			if (((n = $(e, n, r)), s)) return n;
		} else c ? (n.length === 0 ? Q(e, o, r) : H(e, n, o)) : (n && $(e), Q(e, o));
		n = o;
	} else if (t.nodeType) {
		if (a && t.parentNode) return (n = s ? [t] : t);
		if (Array.isArray(n)) {
			if (s) return (n = $(e, n, r, t));
			$(e, n, null, t);
		} else n == null || n === `` || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
		n = t;
	}
	return n;
}
function Z(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a],
			s = n && n[e.length],
			c;
		if (!(o == null || o === !0 || o === !1))
			if ((c = typeof o) == `object` && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = Z(e, o, s) || i;
			else if (c === `function`)
				if (r) {
					for (; typeof o == `function`; ) o = o();
					i = Z(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else (e.push(o), (i = !0));
			else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
	}
	return i;
}
function Q(e, t, n = null) {
	for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function $(e, t, n, r) {
	if (n === void 0) return (e.textContent = ``);
	let i = r || document.createTextNode(``);
	if (t.length) {
		let r = !1;
		for (let a = t.length - 1; a >= 0; a--) {
			let o = t[a];
			if (i !== o) {
				let t = o.parentNode === e;
				!r && !a ? (t ? e.replaceChild(i, o) : e.insertBefore(i, n)) : t && o.remove();
			} else r = !0;
		}
	} else e.insertBefore(i, n);
	return [i];
}
var ae = `data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20166%20155.3'%3e%3cpath%20d='M163%2035S110-4%2069%205l-3%201c-6%202-11%205-14%209l-2%203-15%2026%2026%205c11%207%2025%2010%2038%207l46%209%2018-30z'%20fill='%2376b3e1'/%3e%3clinearGradient%20id='a'%20gradientUnits='userSpaceOnUse'%20x1='27.5'%20y1='3'%20x2='152'%20y2='63.5'%3e%3cstop%20offset='.1'%20stop-color='%2376b3e1'/%3e%3cstop%20offset='.3'%20stop-color='%23dcf2fd'/%3e%3cstop%20offset='1'%20stop-color='%2376b3e1'/%3e%3c/linearGradient%3e%3cpath%20d='M163%2035S110-4%2069%205l-3%201c-6%202-11%205-14%209l-2%203-15%2026%2026%205c11%207%2025%2010%2038%207l46%209%2018-30z'%20opacity='.3'%20fill='url(%23a)'/%3e%3cpath%20d='M52%2035l-4%201c-17%205-22%2021-13%2035%2010%2013%2031%2020%2048%2015l62-21S92%2026%2052%2035z'%20fill='%23518ac8'/%3e%3clinearGradient%20id='b'%20gradientUnits='userSpaceOnUse'%20x1='95.8'%20y1='32.6'%20x2='74'%20y2='105.2'%3e%3cstop%20offset='0'%20stop-color='%2376b3e1'/%3e%3cstop%20offset='.5'%20stop-color='%234377bb'/%3e%3cstop%20offset='1'%20stop-color='%231f3b77'/%3e%3c/linearGradient%3e%3cpath%20d='M52%2035l-4%201c-17%205-22%2021-13%2035%2010%2013%2031%2020%2048%2015l62-21S92%2026%2052%2035z'%20opacity='.3'%20fill='url(%23b)'/%3e%3clinearGradient%20id='c'%20gradientUnits='userSpaceOnUse'%20x1='18.4'%20y1='64.2'%20x2='144.3'%20y2='149.8'%3e%3cstop%20offset='0'%20stop-color='%23315aa9'/%3e%3cstop%20offset='.5'%20stop-color='%23518ac8'/%3e%3cstop%20offset='1'%20stop-color='%23315aa9'/%3e%3c/linearGradient%3e%3cpath%20d='M134%2080a45%2045%200%2000-48-15L24%2085%204%20120l112%2019%2020-36c4-7%203-15-2-23z'%20fill='url(%23c)'/%3e%3clinearGradient%20id='d'%20gradientUnits='userSpaceOnUse'%20x1='75.2'%20y1='74.5'%20x2='24.4'%20y2='260.8'%3e%3cstop%20offset='0'%20stop-color='%234377bb'/%3e%3cstop%20offset='.5'%20stop-color='%231a336b'/%3e%3cstop%20offset='1'%20stop-color='%231a336b'/%3e%3c/linearGradient%3e%3cpath%20d='M114%20115a45%2045%200%2000-48-15L4%20120s53%2040%2094%2030l3-1c17-5%2023-21%2013-34z'%20fill='url(%23d)'/%3e%3c/svg%3e`,
	oe = `/vite.svg`,
	se = G(
		`<div><a href=https://vite.dev target=_blank><img class=logo alt="Vite logo"></a><a href=https://solidjs.com target=_blank><img class="logo solid"alt="Solid logo">`
	),
	ce = G(`<h1>Vite + Solid`),
	le = G(`<div class=card><button>count is </button><p>Edit <code>src/App.tsx</code> and save to test HMR`),
	ue = G(`<p class=read-the-docs>Click on the Vite and Solid logos to learn more`);
function de() {
	let [e, t] = v(0);
	return [
		(() => {
			var e = se(),
				t = e.firstChild,
				n = t.firstChild,
				r = t.nextSibling.firstChild;
			return (q(n, `src`, oe), q(r, `src`, ae), e);
		})(),
		ce(),
		(() => {
			var n = le(),
				r = n.firstChild;
			return (r.firstChild, (r.$$click = () => t((e) => e + 1)), J(r, e, null), n);
		})(),
		ue()
	];
}
var fe = de;
K([`click`]);
var pe = document.getElementById(`root`);
W(() => V(fe, {}), pe);

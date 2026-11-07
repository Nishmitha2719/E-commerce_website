import React, { useEffect, useRef, useState } from 'react';
import './LiquidBackground.css';
import { prefersReducedMotion } from '../../lib/motion';

/*
  Liquid chrome background — a single full-screen WebGL fragment shader.
  No Three.js needed: one quad, one shader, ~0 KB of dependencies.

  Performance guards:
  - renders at a reduced internal resolution (the surface is soft, so it upscales cleanly)
  - lower resolution + 30fps cap on small/touch screens
  - pauses when the tab is hidden
  - starts after the first paint (requestIdleCallback) so it never delays the page
  - prefers-reduced-motion: draws one still frame
  - no WebGL: falls back to the CSS gradient in LiquidBackground.css
*/

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // 0..1, y up
uniform float u_scroll;  // 0..1 over the page

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

// Domain-warped height field = the liquid metal surface
float surface(vec2 p) {
  float t = u_time * 0.045;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + 0.12 * t + u_scroll * 1.2),
                fbm(p + 2.2 * q + vec2(8.3, 2.8) - 0.10 * t));
  return fbm(p + 2.0 * r);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - 0.5 * u_res) / u_res.y;
  vec2 m = (u_mouse * u_res - 0.5 * u_res) / u_res.y;

  // cursor-responsive displacement: a soft lens that pushes the liquid away
  vec2 dm = p - m;
  float md = dot(dm, dm);
  p += dm * 0.10 * exp(-md * 7.0);

  vec2 sp = p * 0.82 + vec2(0.0, u_scroll * 0.9);
  float e = 0.01;
  float h  = surface(sp);
  float hx = surface(sp + vec2(e, 0.0));
  float hy = surface(sp + vec2(0.0, e));
  vec3 n = normalize(vec3((h - hx) / e * 0.075, (h - hy) / e * 0.075, 1.0));

  // reflect a studio environment
  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
  float band = 0.5 + 0.5 * sin((r.x * 2.2 + r.y * 3.1) * 3.2 + h * 8.0);
  band = smoothstep(0.08, 0.92, band);

  vec3 pearl    = vec3(0.965, 0.957, 0.985);
  vec3 silver   = vec3(0.74, 0.76, 0.82);
  vec3 lavender = vec3(0.78, 0.72, 1.0);
  vec3 blue     = vec3(0.30, 0.47, 1.0);
  vec3 pink     = vec3(1.0, 0.80, 0.90);
  vec3 charcoal = vec3(0.09, 0.09, 0.11);

  vec3 col = mix(silver, pearl, band);

  // holographic thin-film tint, limited to the brand palette
  float k = fract(h * 1.4 + r.x * 0.35 + r.y * 0.2 + u_scroll * 0.35);
  vec3 iri = k < 0.33 ? mix(lavender, blue, k / 0.33)
           : k < 0.66 ? mix(blue, pink, (k - 0.33) / 0.33)
           : mix(pink, lavender, (k - 0.66) / 0.34);
  float fres = pow(1.0 - n.z, 1.6);
  col = mix(col, col * iri * 1.15, 0.3 + fres * 2.6);

  // deep chrome creases for contrast
  float crease = smoothstep(0.55, 0.0, band) * smoothstep(0.2, 0.75, h);
  col = mix(col, mix(silver * 0.72, blue * 0.55 + charcoal, 0.3), crease * 0.35);

  // light that follows the cursor
  vec3 L = normalize(vec3(m - p, 0.55));
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 28.0);
  col += vec3(1.0, 0.98, 1.0) * spec * 0.55;
  col += vec3(0.93, 0.92, 1.0) * exp(-md * 3.0) * 0.10;

  // scroll story: pearl → lavender haze → cool blue → charcoal near the footer
  col = mix(col, col * vec3(0.95, 0.93, 1.05), smoothstep(0.15, 0.55, u_scroll));
  col = mix(col, col * vec3(0.88, 0.93, 1.08), smoothstep(0.45, 0.8, u_scroll));
  col = mix(col, charcoal + col * 0.18, smoothstep(0.82, 1.0, u_scroll) * 0.85);

  // soft vignette + dither (prevents gradient banding)
  vec2 uv = frag / u_res;
  col *= 0.94 + 0.06 * smoothstep(1.15, 0.2, length(uv - 0.5));
  col += (hash(frag + u_time) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

const LiquidBackground = () => {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let gl = null;
    let raf = 0;
    let disposed = false;
    let cleanupListeners = () => {};

    const start = () => {
      if (disposed) return;
      gl = canvas.getContext('webgl', { antialias: false, depth: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
      if (!gl) return; // CSS fallback stays visible

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, 'u_res');
      const uTime = gl.getUniformLocation(prog, 'u_time');
      const uMouse = gl.getUniformLocation(prog, 'u_mouse');
      const uScroll = gl.getUniformLocation(prog, 'u_scroll');

      const small = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;
      const scale = small ? 0.32 : 0.5;
      const frameInterval = small ? 1000 / 30 : 1000 / 60;
      const reduced = prefersReducedMotion();

      const mouse = { x: 0.62, y: 0.55, tx: 0.62, ty: 0.55 };
      let scroll = 0;
      let targetScroll = 0;

      const resize = () => {
        const w = Math.max(1, Math.round(window.innerWidth * scale));
        const h = Math.max(1, Math.round(window.innerHeight * scale));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
        if (reduced) draw(performance.now());
      };
      const readScroll = () => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        targetScroll = Math.min(1, window.scrollY / max);
      };
      const onMove = (e) => {
        mouse.tx = e.clientX / window.innerWidth;
        mouse.ty = 1 - e.clientY / window.innerHeight;
      };

      const t0 = performance.now();
      let last = 0;
      function draw(now) {
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        scroll += (targetScroll - scroll) * 0.08;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, reduced ? 12.0 : (now - t0) / 1000);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uScroll, reduced ? targetScroll : scroll);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        if (document.hidden || now - last < frameInterval - 1) return;
        last = now;
        draw(now);
      };

      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('scroll', readScroll, { passive: true });
      if (!reduced) window.addEventListener('pointermove', onMove, { passive: true });
      if (reduced) window.addEventListener('scroll', resize, { passive: true });
      cleanupListeners = () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', readScroll);
        window.removeEventListener('scroll', resize);
        window.removeEventListener('pointermove', onMove);
      };

      readScroll();
      scroll = targetScroll;
      resize();
      draw(performance.now());
      setReady(true);
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    // Wait until the browser is idle so the background never competes with first paint.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 600 })
      : window.setTimeout(start, 120);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      cleanupListeners();
      const lose = gl && gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    };
  }, []);

  return (
    <div className="liquid-bg" aria-hidden="true">
      <div className="liquid-bg__fallback" />
      <canvas ref={canvasRef} className={`liquid-bg__canvas${ready ? ' is-ready' : ''}`} />
      <div className="liquid-bg__sheen" />
    </div>
  );
};

export default LiquidBackground;

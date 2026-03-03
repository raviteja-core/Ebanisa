import { useEffect, useRef } from 'react';

const INTRO_DURATION_MS = 5300;
const SHADER_DURATION_SECONDS = 6;

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

float ember(vec2 uv, vec2 pos, float size, float brightness) {
  float d = length(uv - pos);
  return brightness * smoothstep(size, 0.0, d);
}

float grain(vec2 uv, float t) {
  vec2 p = uv * iResolution;
  float n = hash(p + vec2(t * 13.7, t * 7.3));
  return n;
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 uvC = uv - 0.5;
  float t = iTime;
  float asp = iResolution.x / iResolution.y;
  uvC.x *= asp;

  vec3 col = vec3(0.02, 0.01, 0.005);

  vec2 smokeUV = uv * vec2(2.0, 3.0) + vec2(t * 0.04, t * 0.06);
  float smoke = fbm(smokeUV);
  smoke = smoothstep(0.3, 0.75, smoke);
  vec3 smokeCol = mix(vec3(0.06, 0.03, 0.01), vec3(0.18, 0.10, 0.02), smoke);
  col = mix(col, smokeCol, 0.6);

  vec2 smokeUV2 = uv * vec2(3.5, 2.0) - vec2(t * 0.03, t * 0.05);
  float smoke2 = fbm(smokeUV2 + vec2(5.2, 1.3));
  smoke2 = smoothstep(0.4, 0.8, smoke2);
  col = mix(col, col + vec3(0.05, 0.025, 0.003) * smoke2, 0.5);

  float emberGlow = 0.0;
  vec3 emberColor = vec3(0.0);

  for (int i = 0; i < 40; i++) {
    float fi = float(i);
    float seed = hash1(fi * 3.7 + 1.1);
    float speed = 0.12 + seed * 0.25;
    float xDrift = sin(t * (0.3 + seed * 0.4) + fi * 2.1) * 0.08;
    float lifeT = fract(t * speed + seed);
    float xBase = hash1(fi * 7.3) * 2.0 - 1.0;
    xBase *= asp * 0.5;

    vec2 ePos = vec2(xBase + xDrift, -0.5 + lifeT * 1.4);
    float sz = 0.004 + seed * 0.012;
    float bri = smoothstep(0.0, 0.1, lifeT) * smoothstep(1.0, 0.7, lifeT);
    bri *= 0.8 + 0.2 * sin(t * 8.0 * (0.5 + seed * 0.5));

    float e = ember(uvC, ePos, sz, bri);
    float temp = hash1(fi * 1.9);

    vec3 eCol = mix(
      vec3(1.0, 0.5, 0.1),
      vec3(1.0, 0.9, 0.6),
      smoothstep(sz * 0.3, 0.0, length(uvC - ePos))
    );
    eCol = mix(eCol, vec3(0.9, 0.15, 0.02), temp * 0.4);

    emberGlow += e;
    emberColor += eCol * e;
  }

  emberGlow = clamp(emberGlow, 0.0, 1.0);
  if (emberGlow > 0.001) {
    emberColor /= emberGlow;
  }
  col += emberColor * emberGlow * 1.8;

  float groundGlow = 1.0 - smoothstep(0.0, 0.6, uv.y);
  groundGlow *= 0.5 + 0.5 * fbm(vec2(uv.x * 4.0, t * 0.2));
  col += vec3(0.3, 0.12, 0.01) * groundGlow * 0.4;

  float bloom = 1.0 - smoothstep(0.0, 0.55, length(uvC * vec2(1.0, 1.4)));
  bloom = pow(bloom, 3.0);
  float pulse = 0.85 + 0.15 * sin(t * 1.4) * sin(t * 2.3);
  col += vec3(0.15, 0.09, 0.01) * bloom * pulse;

  float vig = 1.0 - dot(uvC * vec2(1.0 / asp, 1.0), uvC * vec2(1.0 / asp, 1.0)) * 1.6;
  vig = clamp(vig, 0.0, 1.0);
  vig = pow(vig, 0.7);
  col *= vig;

  float g = grain(uv, floor(t * 24.0));
  col += (g - 0.5) * 0.04;

  col = pow(max(col, 0.0), vec3(0.9, 0.92, 1.0));
  float fadeIn = smoothstep(0.0, 1.5, t);
  col *= fadeIn;

  gl_FragColor = vec4(col, 1.0);
}
`;

const compileShader = (gl, source, type) => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return null;
  }

  return shader;
};

function CinematicIntroLoader({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return undefined;

    let startTime = 0;
    let rafId = 0;

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return undefined;

    const program = gl.createProgram();
    if (!program) return undefined;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionAttribute = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    const resolutionUniform = gl.getUniformLocation(program, 'iResolution');
    const timeUniform = gl.getUniformLocation(program, 'iTime');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (elapsed < SHADER_DURATION_SECONDS) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onComplete?.();
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="cinematic-loader" aria-hidden="true">
      <canvas ref={canvasRef} className="cinematic-loader-canvas" />
      <div className="cinematic-loader-scanlines" />
      <div className="cinematic-loader-overlay">
        <div className="cinematic-loader-logo">EBanisa</div>
        <div className="cinematic-loader-tagline">Cinema Redefined</div>
        <div className="cinematic-loader-progress-wrap">
          <div className="cinematic-loader-progress-track">
            <div className="cinematic-loader-progress-bar" />
          </div>
          <div className="cinematic-loader-progress-label">LOADING EXPERIENCE</div>
        </div>
      </div>
      <div className="cinematic-loader-curtain" />
    </div>
  );
}

export default CinematicIntroLoader;

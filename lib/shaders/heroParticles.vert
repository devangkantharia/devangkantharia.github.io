uniform float uTime;
uniform float uMorphProgress; // 0..1
uniform int uCurrentShape;
uniform int uNextShape;
uniform vec2 uPointer; // normalized -1..1 in hero space
uniform float uPointerRadius; // radius in normalized units
uniform float uPointerStrength;

attribute vec3 aShape1;
attribute vec3 aShape2;
attribute vec3 aShape3;
attribute float aSeed;

varying float vGlow;
varying float vAlpha;

vec3 pickShape(int idx) {
  if (idx == 0) return aShape1;
  if (idx == 1) return aShape2;
  return aShape3;
}

void main() {
  vec3 startPos = pickShape(uCurrentShape);
  vec3 endPos = pickShape(uNextShape);
  // Morph interpolation with eased progress (approx easeOutCubic)
  float t = uMorphProgress;
  float ease = 1.0 - pow(1.0 - t, 3.0);
  vec3 pos = mix(startPos, endPos, ease);
  // Pointer repel force in XY plane
  vec2 p2 = pos.xy;
  vec2 diff = p2 - uPointer;
  float dist = length(diff);
  if (dist < uPointerRadius) {
    float falloff = 1.0 - (dist / uPointerRadius);
    vec2 dir = normalize(diff + 0.0001);
    p2 += dir * falloff * uPointerStrength;
    pos.xy = p2;
  }
  // Organic jitter noise
  float jitter = sin(uTime * 0.6 + aSeed * 6.2831) * 0.015;
  pos.xy += vec2(jitter, -jitter * 0.6);
  vGlow = falloff(dist, uPointerRadius, 0.0); // simple glow metric
  vAlpha = 0.55 + sin(aSeed * 12.9898 + uTime * 0.4) * 0.25;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.5 + (1.5 * vAlpha) + vGlow * 6.0; // enlarge near pointer
}

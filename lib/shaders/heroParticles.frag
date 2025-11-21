precision highp float;
varying float vGlow;
varying float vAlpha;

void main() {
  // Circular fade at point edges
  vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
  float d = length(uv);
  if (d > 1.0) discard;
  float edge = smoothstep(1.0, 0.6, d);
  float base = vAlpha * edge;
  float glow = vGlow * 0.45;
  float alpha = clamp(base + glow, 0.0, 1.0);
  vec3 color = mix(vec3(0.10,0.68,0.99), vec3(0.93,0.83,0.25), glow); // blue to yellow
  gl_FragColor = vec4(color, alpha);
}

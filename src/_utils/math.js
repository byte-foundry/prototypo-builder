export function lerp(v0, v1, t) {
  return (1-t)*v0 + t*v1;
}

export function rotateVector(x, y, deg) {
    const DegToRad = Math.PI/180;
    let rotateRadians = (x, y, rad) => {
        var ca = Math.cos(rad);
        var sa = Math.sin(rad);
        return {
          x: ca*x - sa*y,
          y: sa*x + ca*y,
        };
    };
    return rotateRadians(x, y, (deg * DegToRad));
}

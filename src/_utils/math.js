export function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

export function rotateVector(x, y, deg) {
  const DegToRad = Math.PI / 180;
  let rotateRadians = (x, y, rad) => {
    var ca = Math.cos(rad);
    var sa = Math.sin(rad);
    return {
      x: ca * x - sa * y,
      y: sa * x + ca * y,
    };
  };
  return rotateRadians(x, y, (deg * DegToRad));
}

export function getAngleBetween2Lines(x1, x2, y1, y2) {
  let angle1 = Math.atan2(x1.y - x2.y, x1.x - x2.x);
  let angle2 = Math.atan2(y1.y - y2.y, y1.x - y2.x);
  return angle1 - angle2;
}

export function rotatePoint(point, center, angle) {
  var rotatedX = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.y - center.y) + center.x;
  var rotatedY = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.y - center.y) + center.y;

  return {
    x: rotatedX,
    y: rotatedY,
  };
}

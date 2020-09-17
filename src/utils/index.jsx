export const generateTexture = (
  text,
  background = "#ffa1a1",
  textcolor = "blue"
) => {
  const bitmapShift = 80;
  const copyAmount = 4;
  const canvasSize = 640;
  const fontSize = canvasSize / copyAmount;

  const bitmap = document.createElement("canvas");
  bitmap.width = canvasSize;
  bitmap.height = canvasSize;

  const g = bitmap.getContext("2d");

  // background
  g.fillStyle = background;
  g.fillRect(0, 0, bitmap.width + 80, bitmap.height);

  // text
  g.fillStyle = "red";
  g.font = `Bold ${fontSize}px Arial`;
  g.fillStyle = textcolor;
  const textWidth = g.measureText(text).width;
  g.scale(canvasSize / textWidth, 1);
  const fillAndShiftText = (index) =>
    g.fillText(text, 0, fontSize * ++index - bitmapShift);

  Array(copyAmount + 1)
    .fill(0)
    .forEach((item, i) => {
      fillAndShiftText(i);
    });

  // document.body.appendChild(bitmap);
  return bitmap;
};

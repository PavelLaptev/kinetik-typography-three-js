export const generateTexture = (
  text,
  background = "#ffa1a1",
  textcolor = "blue",
  size = 640
) => {
  const bitmapShift = 80;
  const copyAmount = 4;
  const canvasSize = size;
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

export const generateStripeTexture = (
  text,
  colors = { main: "#ffa1a1", second: "blue" }
) => {
  const copyAmount = 2;
  const canvasSize = 640;
  const fontSize = canvasSize / copyAmount;
  const fontStyle = `Bold ${fontSize}px Arial`;

  const bitmap = document.createElement("canvas");
  const g = bitmap.getContext("2d");
  g.font = fontStyle;
  bitmap.width = g.measureText(text).width;
  bitmap.height = fontSize * 2;

  const generateTextRow = (shift, i) => {
    // background
    g.fillStyle = Object.values(colors)[i];
    g.fillRect(0, shift * i, bitmap.width, bitmap.height);

    // text
    g.font = `Bold ${fontSize}px Arial`;
    // g.fillStyle = Object.values(colors)[i];
    g.fillText(text, 0, fontSize * i - 40);
    g.fillStyle = Object.values(colors)[0];
  };

  Array(copyAmount + 1)
    .fill(0)
    .forEach((item, i) => {
      generateTextRow(bitmap.height / 2, i);
    });

  // text
  // document.body.appendChild(bitmap);
  return bitmap;
};

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {
  console.log(msg)
  if (msg.type === "create-rectangles") {
    const nodes = [];

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "fetch-img") {
    try {
      const imageUrl = msg.url;
      console.log("Image URL:", imageUrl);
      const imageBytes = await fetch(imageUrl).then((response) =>
        response.arrayBuffer()
      );

      const image = figma.createImage(new Uint8Array(imageBytes));
      const imageFrame = figma.createFrame();

      imageFrame.resize(200, 200);
      const imageFill: ImagePaint = {
        type: "IMAGE",
        scaleMode: "FIT",
        imageHash: image.hash,
      };
      imageFrame.fills = [imageFill];

      figma.currentPage.appendChild(imageFrame);
      figma.viewport.scrollAndZoomIntoView([imageFrame]);
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }

  figma.closePlugin();
};

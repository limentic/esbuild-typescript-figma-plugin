document.addEventListener('DOMContentLoaded', () => {
    const inputRectangles = document.getElementById('input-rectangles') as HTMLInputElement;
    const btnRectangles = document.getElementById('btn-rectangles') as HTMLButtonElement;

    const inputImg = document.getElementById('input-img') as HTMLInputElement;
    const btnImg = document.getElementById('btn-img') as HTMLButtonElement;

    btnRectangles.addEventListener("click", () => {
      const inputValue = inputRectangles.value;

      console.log("Input value:", inputValue);
      parent.postMessage(
        {
          pluginMessage: {
            type: "create-rectangles",
            count: parseInt(inputValue),
          },
        },
        "*"
      );
    });
    
    btnImg.addEventListener("click", () => {
      const inputValue = inputImg.value;

      console.log("Input value:", inputValue);
      parent.postMessage(
        {
          pluginMessage: {
            type: "fetch-img",
            url: inputValue,
          },
        },
        "*"
      );
    });
});
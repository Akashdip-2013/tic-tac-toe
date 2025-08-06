let bgbottom = document.getElementById("bg-bottom-color");
let bgtop = document.getElementById("bg-top-color");
const textcolor = document.getElementById("txt-color");
const boxcolor = document.getElementById("box-color");
const bordercolor = document.getElementById("border-color");
document.getElementById("bg-bottom-color").addEventListener("input", () => {
  document.body.style.background = `linear-gradient(to left top,${bgbottom.value},${bgtop.value})`;
  document.body.style.backgound = `${bgtop.value}`
})
document.getElementById("bg-top-color").addEventListener("input", () => {
  document.body.style.background = `linear-gradient(to left top,${bgbottom.value},${bgtop.value})`;
})
document.getElementById("txt-color").addEventListener("input", () => {
  document.body.style.color = textcolor.value;
})
document.getElementById("box-color").addEventListener("input", () => {
  document.getElementById("container").style.backgroundColor = boxcolor.value;
})

const borderColorInput = document.getElementById("border-color");

borderColorInput.addEventListener("input", () => {
  const color = borderColorInput.value;
  const borderElements = document.querySelectorAll(".border");

  borderElements.forEach(el => {
    el.style.border = `3px solid ${color}`;
  });
})

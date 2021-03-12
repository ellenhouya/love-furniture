const body = document.body;
const startBtn = document.querySelector(".start-btn");

let blockGap_W = 150;
let blockGap_H = 150;
let myBox = document.querySelector(".imgbox");
let bodyWidth = body.offsetWidth;
let bodyHeight = body.offsetHeight;

let myBoxWidth = bodyWidth * 1.1 - ((bodyWidth * 1.1) % blockGap_W);
let myBoxHeight = bodyHeight * 1.2 - ((bodyHeight * 1.2) % blockGap_H);

myBox.style.width = myBoxWidth + "px";
myBox.style.height = myBoxHeight + "px";

for (let i = 0; i < myBoxWidth; i += blockGap_W) {
  for (let j = 0; j < myBoxHeight; j += blockGap_H) {
    let pixContainer = document.createElement("div");
    pixContainer.className = "pixContainer";
    let pix = document.createElement("div");
    pix.className = "pixi";
    myBox.appendChild(pixContainer);
    pixContainer.appendChild(pix);
    pixContainer.style.left = i + "px";
    pixContainer.style.top = j + "px";
    for (let k = 0; k < 6; k++) {
      let side = document.createElement("span");
      side.className = "side";

      pix.appendChild(side);
      side.style.backgroundPosition = `${myBoxWidth - i}px ${
        myBoxHeight - j
      }px`;
      side.style.backgroundSize = `${myBoxWidth}px ${myBoxHeight}px`;
    }
  }
}

let rot1 = "rotate3d(1, 1, 1, 0deg)";
let rot2 = "rotate3d(0, 1, 0, -90deg)";
let rot3 = "rotate3d(1, 0, 0, -90deg)";
let rot4 = "rotate3d(0, 1, 0, 180deg)";
let rot5 = "rotate3d(1, 0, 0, 90deg)";
let rot6 = "rotate3d(0, 1, 0, 90deg)";
let pixContainers = document.querySelectorAll(".pixContainer");
let activepic = 0;
let myrot = rot1;

function navigate(direction) {
  if (activepic == 0 && direction == "left") {
    activepic = 6;
  }

  if (activepic == 5 && direction == "right") {
    activepic = -1;
  }

  if (direction == "left") {
    activepic -= 1;
  }
  if (direction == "right") {
    activepic += 1;
  }

  switch (activepic) {
    case 0:
      myrot = rot1;
      break;
    case 1:
      myrot = rot2;
      break;
    case 2:
      myrot = rot3;
      break;
    case 3:
      myrot = rot4;
      break;
    case 4:
      myrot = rot5;
      break;
    case 5:
      myrot = rot6;
      break;
  }

  for (let i = 0; i < pixContainers.length; i++) {
    for (let c = 0; c < pixContainers[i].children.length; c++) {
      pixContainers[i].children[c].style.transform = myrot;
    }
  }
}

startBtn.addEventListener("click", (e) => {
  location.assign("index.html");
});

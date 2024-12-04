globalThis.onload = async () => {
  const data = await getImageList()
  setupImage(data)
}


async function getImageList() {
  const response = await fetch("/api/imgList")
  const json = await response.json()
  return json.data
}

function setupImage(imageList) {
  const html = imageList.reduce((html, i) => `${html}<a href="jigsaw?imgPath=${i}"><img src="${i}" /></a>`, '')
  document.querySelector("#container").innerHTML = html
}

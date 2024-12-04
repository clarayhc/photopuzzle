const urlSearch = new URLSearchParams(window.location.search)
const imgPath = urlSearch.get("imgPath") || "images/1.jpg"

setupMain()
setupAside()
setupJigsawEvent()
setupInputEvent()

function setupMain() {
  let html = ""
  for (let row = 1; row <= 4; row++) {
    for (let col = 1; col <= 4; col++) {
      html +=
        `<div class="item item${row}-${col}" style="background-image: url(${imgPath})"></div>`
    }
  }
  document.querySelector("main").innerHTML = html
}

function setupAside() {
  const items = Array.from({ length: 16 }, (_, i) => {
    const col = i % 4 + 1
    const row = Math.floor(i / 4) + 1
    return `<div class="item item${row}-${col}" style="background-image: url(${imgPath})"></div>`
  }).sort(() => Math.random() - 0.5)
  const itemA = items.slice(0, 8)
  const itemB = items.slice(8)
  document.querySelector("aside:first-of-type").innerHTML = itemA.join("")
  document.querySelector("aside:last-of-type").innerHTML = itemB.join("")
}

const testAllDone = () =>
  new Promise((res) => {
    const isFailed = [...document.querySelectorAll("main > .item")].some(
      (item) =>
        item.childElementCount !== 1 ||
        item.className !== item.children[0].className
    )
    res(!isFailed)
  })

function setupJigsawEvent() {
  let dragItem = null
  let cloneItem = null
  document.querySelectorAll("aside .item").forEach((item) => {
    item.onpointerdown = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dragItem = e.target
      const { width, height } = dragItem.getBoundingClientRect()
      cloneItem = dragItem.cloneNode(true)
      cloneItem.style.pointerEvents = "none"
      cloneItem.style.width = width + "px"
      cloneItem.style.height = height + "px"
      cloneItem.style.left = e.clientX - e.offsetX + "px"
      cloneItem.style.top = e.clientY - e.offsetY + "px"
      document.body.appendChild(cloneItem)
      const handlePointerMove = (event) => {
        if (!cloneItem) return
        cloneItem.style.left = event.clientX - e.offsetX + "px"
        cloneItem.style.top = event.clientY - e.offsetY + "px"
      }
      const handlePointerUp = (event) => {
        document.removeEventListener("pointermove", handlePointerMove)
        document.removeEventListener("pointerup", handlePointerUp)
        if (!dragItem) {
          document.querySelectorAll("body > .item").forEach((el) =>
            el.remove()
          )
          return
        }
        const target = document.elementFromPoint(event.clientX, event.clientY)

        if (target && target.classList.contains("item")) {
          const parent = target.parentElement

          if (parent.tagName === "MAIN") {
            target.insertBefore(dragItem, null)
          } else {
            const p2 = dragItem.parentElement
            parent.appendChild(dragItem)
            p2.appendChild(target)
          }
          testAllDone().then((isSuccessful) => {
            if (!isSuccessful) return

            document.querySelectorAll("aside").forEach((aside) =>
              aside.remove()
            )
            document.querySelector("footer").classList.add("show")
          })
        }
        dragItem = null
        cloneItem?.remove()
        cloneItem = null
      }
      document.addEventListener("pointerup", handlePointerUp)
      document.addEventListener("pointermove", handlePointerMove)
    }
  })
}

function setupInputEvent() {
  const input = document.querySelector(".message-input")
  const button = document.querySelector(".message-btn")
  document.querySelector('.close-btn').onclick = () => {
    document.querySelector('footer').classList.remove('show')
  }
  let isFetching = false
  input.oninput = () => {
    if (isFetching) return
    const value = input.textContent.trim()
    if (value) {
      button.disabled = false
    } else {
      button.disabled = true
    }
  }
  button.onpointerup = async () => {
    const value = input.textContent.trim()
    if (!value) return
    isFetching = true
    input.textContent = ""
    button.disabled = true
    const messageList = document.querySelector(".message-list")
    const userMessage = document.createElement("div")
    userMessage.classList.add("message", "user")
    userMessage.textContent = value
    messageList.appendChild(userMessage)
    requestAnimationFrame(() => {
      messageList.scrollTop = messageList.scrollHeight
    })
    const chatgptMessage = document.createElement("div")
    chatgptMessage.classList.add("message", "chatgpt", "loading")
    messageList.appendChild(chatgptMessage)
    const response = await fetch("api/chatGpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageName: imgPath.split("/")[1],
        message: value,
      }),
    })
    isFetching = false
    chatgptMessage.classList.remove("loading")

    if (!response.ok) {
      chatgptMessage.textContent = "Failed to fetch the chatGpt API."
      chatgptMessage.classList.add("error")
      return
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      const chunk = decoder.decode(value, { stream: true })
      requestAnimationFrame(() => {
        chatgptMessage.textContent += chunk
        chatgptMessage.clientHeight
        messageList.scrollTop = messageList.scrollHeight
      })
    }
  }
}

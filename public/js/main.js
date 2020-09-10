const modal = document.getElementById('staticBackdrop')
const imgForm = document.forms.file
const container = document.querySelector('[data-container]')

const ws = new WebSocket(window.location.origin.replace('http', 'ws'))

const renderImg = (data) => {
  let result = `<div data-img="${data.message.file.id}" class="col-md-4">
  <div class="card mb-4 shadow-sm">
    <img class="bd-placeholder-img card-img-top" src="/img/${data.message.file.path}" width="100%" height="225" alt="sometext">
    <div class="card-body">
      <p class="card-text">${data.message.file.description}</p>
      <div class="d-flex justify-content-between align-items-center">`
  if (data.userID === data.message.file.userID) {
    result += '<div data-type="DELETE" class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary">Delete</button></div>'
  }
  result += `<small data-type="STAR" class="stars text-muted">${data.message.file.raiting}</small></div></div></div></div>`
  return result
}

const updatePhotoRaiting = (id) => {
  const element = document.querySelector('[data-container]').querySelector(`[data-img="${id}"] [data-type="STAR"]`)
  element.innerText = +element.innerText + 1
}

const makeRaitingActive = (id) => {
  const element = document.querySelector('[data-container]').querySelector(`[data-img="${id}"] [data-type="STAR"]`)
  element.classList.add('active')
}

//
// UPLOAD NEW PHOTO
//

imgForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (imgForm.elements.file.files[0] && imgForm.elements.description.value.trim()) {
    const data = new FormData()
    data.append('file', imgForm.elements.file.files[0])
    data.append('description', imgForm.elements.description.value.trim())

    console.log(data)

    let result = await fetch('/photos/upload', {
      method: 'POST',
      body: data,
    })

    result = await result.json()

    if (result.status === 'OK') {
      ws.send(JSON.stringify({ file: result.file, type: 'new' }))

      imgForm.reset()
      $(modal).modal('toggle')
    } else {
      imgForm.reset()
    }
  }
})

//
// WORK WITH IMG'S BUTTONS
//

container.addEventListener('click', async (e) => {
  console.log(e.target.dataset)
  switch (e.target.dataset.type) {
    case 'STAR': {
      const img = e.target.closest('[data-img]')

      console.log(e.target, img.dataset.img)
      const result = await fetch('/photos/star', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: img.dataset.img }),
      })
      if (result.status === 200) {
        makeRaitingActive(img.dataset.img)
        ws.send(JSON.stringify({
          type: 'star',
          id: img.dataset.img,
        }))
      }
      break
    }
    default:
      break
  }
})

//
// WEBSOCKET FUNCTIONS
//

ws.addEventListener('open', () => {
  console.log('WS open')
})

ws.addEventListener('close', () => {
  console.log('WS close')
})

ws.addEventListener('message', (event) => {
  // container.insertAdjacentHTML('beforeend', renderImg(result))
  const parseEvent = JSON.parse(event.data)

  switch (parseEvent.message.type) {
    case 'new':
      container.insertAdjacentHTML('beforeend', renderImg(parseEvent))
      break
    case 'star':
      updatePhotoRaiting(parseEvent.message.id)
      break
    case 'delete':
      //
      break
    default:
      break
  }
})

const modal = document.getElementById('staticBackdrop')
const imgForm = document.forms.file
const container = document.querySelector('[data-container]')

const ws = new WebSocket(window.location.origin.replace('http', 'ws'))

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

      const result = await fetch('/photos/star', {
        method: 'PATCH',
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
    case 'DELETE': {
      const img = e.target.closest('[data-img]')

      const result = await fetch('/photos/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: img.dataset.img }),
      })
      if (result.status === 200) {
        ws.send(JSON.stringify({
          type: 'delete',
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
      removePhotoById(parseEvent.message.id)
      break
    default:
      break
  }
})

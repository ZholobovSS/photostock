const renderImg = (data) => {
  let result = `<div data-img="${data.message.file.id}" class="col-md-4">
  <div class="card mb-4 shadow-sm">
    <img class="bd-placeholder-img card-img-top" src="/img/${data.message.file.path}" width="100%" height="225" alt="sometext">
    <div class="card-body">
      <p class="card-text">${data.message.file.description}</p>
      <div class="d-flex justify-content-between align-items-center">`
  if (data.userID === data.message.file.userID) {
    result += '<div class="btn-group"><button data-type="DELETE" type="button" class="btn btn-sm btn-outline-secondary">Delete</button></div>'
  }
  result += `<small data-type="STAR" class="stars text-muted">${data.message.file.raiting}</small></div></div></div></div>`
  return result
}

const updatePhotoRaiting = (id) => {
  const element = document.querySelector(`[data-img="${id}"] [data-type="STAR"]`)
  element.innerText = +element.innerText + 1
}

const makeRaitingActive = (id) => {
  const element = document.querySelector(`[data-img="${id}"] [data-type="STAR"]`)
  element.classList.add('active')
}

const removePhotoById = (id) => {
  document.querySelector(`[data-img="${id}"]`).remove()
}

const btnLike = document.getElementById('btn-like');

if (btnLike) {
  const imageId = btnLike.getAttribute('data-id');
  btnLike.addEventListener('click', e => {
    e.preventDefault;
    const ajax = new XMLHttpRequest();
    ajax.open('POST', `/images/${imageId}/like`);
    ajax.onreadystatechange = function () { // al hacerlo con la palabra function conserva el conexto ajax y se puede usar la palabra this
      if (this.status == 200 && this.readyState == 4) {
        //console.log(this.responseText);
        const data = JSON.parse(this.responseText);
        const likesCount = document.getElementsByClassName('likes-count')[0]; // devuelve un array, pero como solo hay 1 con esa clase, seleccionamos el intem 0
        if ('textContent' in likesCount) {
          likesCount.textContent = data.likes;
        } else {
          likesCount.innerText = data.likes;
        }
      }
    }
    ajax.send();
  });
}

const btnDelete = document.getElementById('btn-delete');

if (btnDelete) {
  const imageId = btnDelete.getAttribute('data-id');
  btnDelete.addEventListener('click', e => {
    e.preventDefault;
    const response = confirm('Are you sure you want to delete this image?');
    if (response) {
      const ajax = new XMLHttpRequest();
      ajax.open('DELETE', `/images/${imageId}`);
      ajax.onreadystatechange = () => { // con funcion flecha ya no se puede usar this porque no conserva el conexto, entonces se usa ajax y no this
        if (ajax.status == 200 && ajax.readyState == 4) {
          const data = JSON.parse(ajax.responseText);
          btnDelete.classList.remove('btn-danger');
          btnDelete.classList.add('btn-success');
          const icon = btnDelete.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-check');
          const nodeText = document.createTextNode(' Deleted');
          btnDelete.replaceChildren(icon);
          btnDelete.appendChild(nodeText);
        }
      };
      ajax.send();
    }
  });
}

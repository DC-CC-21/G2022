let select = document.querySelector('.gridSize');

for (let i = 3; i < 16; i ++){
  let option = document.createElement('option');
  console.log('💩')

  option.innerHTML = `${i} x ${i}`;
  console.log(option)
  select.append(option);
}

document.querySelector('.play').addEventListener('click', _ => {
    console.log(window.location)
    // window.location.href = 'index.html'
    window.location.href = (window.location.origin);
})
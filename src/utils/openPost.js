export const openPostWindow = (url, data, name) => {
  let tempForm = document.createElement('form');
  tempForm.id = 'tempForm1';
  tempForm.method = 'post';
  tempForm.action = url;
  tempForm.target = name;
  for (let key in data) {
    let hideInput = document.createElement('input');
    hideInput.type = 'hidden';
    hideInput.name = key;
    hideInput.value = data[key];
    tempForm.appendChild(hideInput);
  }

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  let hideInputUser = document.createElement('input');
  hideInputUser.type = 'hidden';
  hideInputUser.name = 'user_id';
  hideInputUser.value = currentUser.id;
  tempForm.appendChild(hideInputUser);

  const token = sessionStorage.getItem('token');
  let hideInputToken = document.createElement('input');
  hideInputToken.type = 'hidden';
  hideInputToken.name = 'token';
  hideInputToken.value = token;
  tempForm.appendChild(hideInputToken);

  //   tempForm.addEventListener('onsubmit', function() {
  //     // openWindow(name);
  //     // window.open('about:blank', name);
  //   });

  document.body.appendChild(tempForm);

  //   tempForm.fireEvent('onsubmit');
  //   tempForm.removeEventListener('onsubmit');
  tempForm.submit();
  document.body.removeChild(tempForm);
};

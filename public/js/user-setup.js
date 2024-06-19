
const button = document.querySelector('.submit-button');

button.addEventListener('click', () => {

  const form = document.getElementById('userForm');
  const formData = new FormData(form);
  const users = [];

  const roles = formData.getAll('roles[]');
  const erase = formData.getAll('erase[]');

  form.querySelectorAll('.user-role').forEach((select, index) => {
    const userId = select.getAttribute('data-id');
    const userRole = roles[index];
    const userErase = erase.includes(userId);

    users.push({
      id: userId,
      role: userRole,
      erase: userErase
    });
  });

  fetch('http://localhost:8080/api/users/admin-control-panel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(users)
  }).then(response => response.json())
    .then(data => {
      window.location.reload(true);

    }).catch(error => {
      console.error('Error:', error);
    });
});











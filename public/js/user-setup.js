document.addEventListener('DOMContentLoaded', () => {
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

    fetch(`${process.env.SERVER_URL}/api/users/admin-control-panel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(users)
    }).then(response => response.json())
      .then(data => {
        if (data.message === 'User modified successfully') {
          alert('User modified successfully');
          window.location.reload(true);
        } else {
          console.error('Error in response:', data);
        }
      }).catch(error => {
        console.error('Error:', error);
        alert('Failed to modify user');
      });
  });
});

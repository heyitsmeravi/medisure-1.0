const forgotPasswordForm = document.getElementById('forgot-password-form');

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;

    try {
        const response = await fetch('http://localhost:5000/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        alert(result.msg);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});
const resetPasswordForm = document.getElementById('reset-password-form');
const token = window.location.pathname.split('/').pop();

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('new-password').value;
    const confirm_password = document.getElementById('confirm-password').value;

    try {
        const response = await fetch(`http://localhost:5000/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, confirm_password })
        });
        const result = await response.json();
        alert(result.msg);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});

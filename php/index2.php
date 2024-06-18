<!DOCTYPE html>
<html>
<head>
    <title>Start a Challenge</title>
</head>
<body>
    <h1>Start a Challenge</h1>
    <form id="challengeForm">
        <label for="challenge_id">Challenge ID:</label>
        <input type="text" id="challenge_id" name="challenge_id" required><br><br>
        <label for="user_id">User ID:</label>
        <input type="text" id="user_id" name="user_id" required><br><br>
        <button type="submit">Start Challenge</button>
    </form>
    <p id="response"></p>
    <script>
        document.getElementById('challengeForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const challenge_id = document.getElementById('challenge_id').value;
            const user_id = document.getElementById('user_id').value;
            const responseElement = document.getElementById('response');

            try {
                const response = await fetch(`http://localhost:3001/start_challenge?user_id=${user_id}`, { 
                    method: 'GET',
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    responseElement.textContent = `Challenge started! Access it at: ${data.challenge_url}`;
                } else {
                    responseElement.textContent = `Error1: ${data.error}`;
                }
            } catch (error) {
                responseElement.textContent = `Error99: ${error.message}`;
            }
        });
    </script>
</body>
</html>

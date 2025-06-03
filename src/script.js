// Fetch the JSON data and populate the table
fetch('vocabulary.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('vocab-body');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.word}</td>
                <td>${item.type}</td>
                <td>${item.meaning}</td>
                <td>${item.syns}</td>
                <td>${item.example}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching vocabulary data:', error));
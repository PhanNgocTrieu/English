// Fetch the JSON data and populate the table
fetch('pages.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#page-table tbody');
        data.forEach(page => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${page.title}</td>
                <td><a href="${page.link}">Visit</a></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching page data:', error));
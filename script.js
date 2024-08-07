window.addEventListener('DOMContentLoaded', () => {
  const partNumberInput = document.getElementById('partNumber');
  const resultsContainer = document.getElementById('results');
  const searchButton = document.getElementById('searchButton');
  
  searchButton.addEventListener('click', async () => {
  const partNumber = partNumberInput.value;

  fetch(`https://ofv-searchup.onrender.com/api/versions?partNumber=${partNumber}`) 
    .then(response => response.json())
    .then(versions => {
      resultsContainer.innerHTML = ''; 
      if (versions.length > 0) {
        versions.forEach(version => {
          const resultItem = document.createElement('div');
          resultItem.innerHTML = `
            <h3>Version ${version.version_number}</h3> 
            <a href="${version.download_link}" target="_blank">Download</a> 
          `;
          resultsContainer.appendChild(resultItem);
        });
      } else {
        resultsContainer.innerHTML = '<p>No matching firmwares found.</p>';
      }
    })
    .catch(error => {
      console.error('Error while requesting:', error);
      resultsContainer.innerHTML = '<p>Failed to load firmwares.</p>';
    });
})})

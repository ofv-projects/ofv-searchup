window.addEventListener('DOMContentLoaded', () => {
  const partNumberInput = document.getElementById('partNumber');
  const resultsContainer = document.getElementById('results');
  const searchButton = document.getElementById('searchButton');
  
  searchButton.addEventListener('click', () => {

  const partNumber = partNumberInput.value;
  fetch(`https://ofv-searchup.onrender.com/versions?partNumber=${partNumber}`)
    .then(response => response.json())
    .then(versions => {
      resultsContainer.innerHTML = '';
      if (versions.length > 0) {
        versions.forEach(version => {
          const resultItem = document.createElement('div');
          resultItem.innerHTML = `
            <h3>Version ${version.versionNumber}</h3>
            <a href="https://ofv-searchup.onrender.com/public/uploads/${version.filename}" download>Download</a>
          `;
          resultsContainer.appendChild(resultItem);
        });
      } else {
        resultsContainer.innerHTML = '<p>Keine Versionen gefunden</p>';
      }
    });
  })});

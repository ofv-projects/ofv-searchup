window.addEventListener('DOMContentLoaded', () => {
  const partNumberInput = document.getElementById('partNumber');
  const resultsContainer = document.getElementById('results');
  const searchButton = document.getElementById('searchButton');
  
  searchButton.addEventListener('click', () => {
  console.log('Button wurde geklickt!'); // Test-Ausgabe in der Konsole

  const partNumber = partNumberInput.value;
  fetch(`http://localhost:3000/versions?partNumber=${partNumber}`)
    .then(response => response.json())
    .then(versions => {
      resultsContainer.innerHTML = ''; // Ergebnisse löschen
      if (versions.length > 0) {
        versions.forEach(version => {
          const resultItem = document.createElement('div');
          resultItem.innerHTML = `
            <h3>Version ${version.versionNumber}</h3>
            <a href="http://localhost:3000/public/uploads/${version.filename}" download>Download</a>
          `;
          resultsContainer.appendChild(resultItem);
        });
      } else {
        resultsContainer.innerHTML = '<p>Keine Versionen gefunden</p>';
      }
    });
  })});

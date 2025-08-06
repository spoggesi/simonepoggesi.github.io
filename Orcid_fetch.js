const orcidId = '0000-0002-7031-3892';

async function fetchOrcidWorks() {
  const url = `https://pub.orcid.org/v3.0/${orcidId}/works`;
  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const works = data.group || [];
    if (works.length === 0) {
      document.getElementById('orcid-works').textContent = 'No publications found.';
      return;
    }

    const listItems = works.map(workGroup => {
      const summary = workGroup['work-summary'][0];
      const title = summary.title.title.value || 'No title';
      const url = summary.url ? summary.url.value : `https://orcid.org/${orcidId}`;
      const year = summary.publicationDate ? summary.publicationDate.year.value : '';
      const yearText = year ? ` (${year})` : '';
      return `<li><a href="${url}" target="_blank" rel="noopener">${title}</a>${yearText}</li>`;
    }).join('');

    document.getElementById('orcid-works').innerHTML = `<ul>${listItems}</ul>`;
  } catch (error) {
    console.error('Error fetching ORCID works:', error);
    document.getElementById('orcid-works').textContent = 'Failed to load publications.';
  }
}

fetchOrcidWorks();

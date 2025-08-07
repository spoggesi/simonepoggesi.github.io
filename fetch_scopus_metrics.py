import os
import requests
import json
import sys

API_KEY = os.getenv('SCOPUS_API_KEY')
AUTHOR_ID = os.getenv('SCOPUS_AUTHOR_ID')

if not API_KEY or not AUTHOR_ID:
    print("Error: SCOPUS_API_KEY and SCOPUS_AUTHOR_ID must be set as environment variables.")
    sys.exit(1)

url = f'https://api.elsevier.com/content/author/author_id/{AUTHOR_ID}?view=metrics'

headers = {
    'Accept': 'application/json',
    'X-ELS-APIKey': API_KEY
}

response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"Error: API request failed with status code {response.status_code}")
    print(response.text)
    sys.exit(1)

data = response.json()

try:
    author_data = data['author-retrieval-response'][0]['coredata']
    h_index = author_data.get('h-index', 'N/A')
    citation_count = author_data.get('citation-count', 'N/A')
except (KeyError, IndexError):
    print("Error: Unexpected response format.")
    sys.exit(1)

metrics = {
    "h_index": h_index,
    "citation_count": citation_count
}

with open('metrics.json', 'w') as f:
    json.dump(metrics, f, indent=2)

print("Metrics updated:", metrics)

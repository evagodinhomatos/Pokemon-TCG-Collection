const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing TCGdex latest sets...');
    const response = await fetch('https://api.tcgdex.net/v2/en/sets?pagination:page=1&pagination:itemsPerPage=5&sort:field=releaseDate&sort:order=DESC');
    const data = await response.json();
    console.log('API Response Status:', response.status);
    console.log('Sets returned:', data?.length || 0);
    console.log('Latest set:', data?.[0]?.name || 'None');
    console.log('Latest set id:', data?.[0]?.id || 'None');
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testAPI();

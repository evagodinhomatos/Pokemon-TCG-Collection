async function testAPI() {
  try {
    console.log('Testing TCGdex latest sets...');
    const response = await fetch('https://api.tcgdex.net/v2/en/sets?pagination:page=1&pagination:itemsPerPage=5&sort:field=releaseDate&sort:order=DESC');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Sets returned:', data.length || 0);
    
    if (data.length > 0) {
      console.log('Latest set:', {
        id: data[0].id,
        name: data[0].name,
        total: data[0].cardCount?.total ?? 0,
      });
    }
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testAPI();

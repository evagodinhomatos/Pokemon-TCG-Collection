export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
  images: {
    small: string;
    large: string;
  };
  rarity?: string;
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    legalities: {
      unlimited: string;
      standard?: string;
      expanded?: string;
    };
    ptcgoCode?: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist?: string;
  nationalPokedexNumbers?: number[];
}

export interface SearchResponse {
  data: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

export interface PokedexEntry {
  id: number;
  name: string;
  sprite: string;
}

export interface SetInfo {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  images: {
    symbol: string;
    logo: string;
  };
}

export interface SetsResponse {
  data: SetInfo[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

interface PokeApiPokemon {
  name: string;
}

interface PokeApiResponse {
  results: PokeApiPokemon[];
}

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

interface TcgdexCardBrief {
  id: string;
}

interface TcgdexCardDetail {
  id: string;
  localId: string;
  name: string;
  image: string;
  category?: string;
  illustrator?: string;
  rarity?: string;
  dexId?: number[];
  hp?: number;
  types?: string[];
  set: {
    id: string;
    name: string;
    logo?: string;
    symbol?: string;
    cardCount?: {
      official?: number;
      total?: number;
    };
  };
}

interface TcgdexSetBrief {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount?: {
    official?: number;
    total?: number;
  };
}

interface TcgdexSetDetail {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  releaseDate?: string;
  serie?: {
    name: string;
  };
  cardCount?: {
    official?: number;
    total?: number;
  };
  cards?: TcgdexCardBrief[];
}

const TCGDEX_API_URL = 'https://api.tcgdex.net/v2/en';
const POKEAPI_URL = 'https://pokeapi.co/api/v2';
const CACHE_VERSION = 'v3';
const PERSISTENT_CACHE_PREFIX = `pokemon_tcg_api_cache:${CACHE_VERSION}:`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const BROWSE_SET_PAGE_SIZE = 1;
const CARD_SEARCH_PAGE_SIZE = 20;
const POKEMON_CARD_PAGE_SIZE = 50;
const apiCache = new Map<string, CacheEntry>();

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function createCachedResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

function readPersistentCache(cacheKey: string): CacheEntry | null {
  if (!hasLocalStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${PERSISTENT_CACHE_PREFIX}${cacheKey}`);
    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw) as CacheEntry;
    if (Date.now() - cached.timestamp >= CACHE_DURATION) {
      window.localStorage.removeItem(`${PERSISTENT_CACHE_PREFIX}${cacheKey}`);
      return null;
    }

    return cached;
  } catch {
    return null;
  }
}

function writePersistentCache(cacheKey: string, data: unknown) {
  if (!hasLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      `${PERSISTENT_CACHE_PREFIX}${cacheKey}`,
      JSON.stringify({ data, timestamp: Date.now() } satisfies CacheEntry)
    );
  } catch {
    // Ignore storage quota and serialization issues so network fetches still work.
  }
}

async function cachedFetch(url: string, options?: RequestInit): Promise<Response> {
  const cacheKey = url;
  const cached = apiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return createCachedResponse(cached.data);
  }

  const persisted = readPersistentCache(cacheKey);
  if (persisted) {
    apiCache.set(cacheKey, persisted);
    return createCachedResponse(persisted.data);
  }
  
  const response = await fetch(url, options);
  
  if (response.ok) {
    const data = await response.json();
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
    writePersistentCache(cacheKey, data);
    return createCachedResponse(data);
  }
  
  return response;
}

async function cachedJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await cachedFetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${TCGDEX_API_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function mapSetInfo(set: TcgdexSetBrief | TcgdexSetDetail): SetInfo {
  const cardCount = set.cardCount ?? {};
  const detail = set as TcgdexSetDetail;

  return {
    id: set.id,
    name: set.name,
    series: detail.serie?.name ?? '',
    printedTotal: cardCount.official ?? cardCount.total ?? 0,
    total: cardCount.total ?? cardCount.official ?? 0,
    releaseDate: detail.releaseDate ?? '',
    images: {
      symbol: set.symbol ?? '',
      logo: set.logo ?? '',
    },
  };
}

function mapCard(card: TcgdexCardDetail, setInfo?: SetInfo): PokemonCard {
  const fallbackSet = mapSetInfo(card.set);
  const imageBase = card.image;

  return {
    id: card.id,
    name: card.name,
    supertype: card.category ?? 'Pokemon',
    subtypes: [],
    hp: card.hp ? String(card.hp) : undefined,
    types: card.types,
    images: {
      small: imageBase ? `${imageBase}/low.webp` : '',
      large: imageBase ? `${imageBase}/high.webp` : '',
    },
    rarity: card.rarity,
    set: {
      ...(setInfo ?? fallbackSet),
      legalities: {
        unlimited: 'Unknown',
        standard: undefined,
        expanded: undefined,
      },
      ptcgoCode: undefined,
      updatedAt: '',
    },
    number: card.localId,
    artist: card.illustrator,
    nationalPokedexNumbers: card.dexId,
  };
}

function sortCardsByReleaseDate(cards: PokemonCard[]): PokemonCard[] {
  return [...cards].sort((a, b) => {
    const dateA = a.set.releaseDate ? new Date(a.set.releaseDate).getTime() : 0;
    const dateB = b.set.releaseDate ? new Date(b.set.releaseDate).getTime() : 0;
    return dateB - dateA;
  });
}

function toSearchResponse(data: PokemonCard[], page: number, pageSize: number): SearchResponse {
  return {
    data,
    page,
    pageSize,
    count: data.length,
    totalCount: data.length,
  };
}

async function getSetDetailsMap(setIds: string[]): Promise<Map<string, SetInfo>> {
  const uniqueSetIds = [...new Set(setIds.filter(Boolean))];

  const sets = await Promise.all(
    uniqueSetIds.map(async (setId) => {
      const detail = await cachedJson<TcgdexSetDetail>(buildUrl(`/sets/${setId}`));
      return [setId, mapSetInfo(detail)] as const;
    })
  );

  return new Map(sets);
}

async function hydrateCardIds(cardIds: string[]): Promise<PokemonCard[]> {
  const detailResults = await Promise.allSettled(
    cardIds.map((cardId) => cachedJson<TcgdexCardDetail>(buildUrl(`/cards/${cardId}`)))
  );

  const details = detailResults.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : []
  );

  if (details.length === 0) {
    throw new Error('Failed to fetch any card details');
  }

  const setDetails = await getSetDetailsMap(details.map((card) => card.set.id));

  return details.map((card) => mapCard(card, setDetails.get(card.set.id)));
}

async function hydrateCards(cards: TcgdexCardBrief[]): Promise<PokemonCard[]> {
  return hydrateCardIds(cards.map((card) => card.id));
}

async function getLatestSetCards(page: number, pageSize: number): Promise<PokemonCard[]> {
  const sets = await cachedJson<TcgdexSetBrief[]>(
    buildUrl('/sets', {
      'pagination:page': page,
      'pagination:itemsPerPage': pageSize,
      'sort:field': 'releaseDate',
      'sort:order': 'DESC',
    })
  );

  const setDetails = await Promise.all(
    sets.map((set) => cachedJson<TcgdexSetDetail>(buildUrl(`/sets/${set.id}`)))
  );

  const cardIds = setDetails.flatMap((set) =>
    (set.cards ?? []).map((card) => card.id).filter(Boolean)
  );

  if (cardIds.length === 0) {
    return [];
  }

  return hydrateCardIds(cardIds);
}

export async function searchCards(query: string = '', page: number = 1, setId?: string): Promise<SearchResponse> {
  if (!query && !setId) {
    const data = await getLatestSetCards(page, BROWSE_SET_PAGE_SIZE);
    return toSearchResponse(data, page, BROWSE_SET_PAGE_SIZE);
  }

  const briefs = await cachedJson<TcgdexCardBrief[]>(
    buildUrl('/cards', {
      name: query || undefined,
      'set.id': setId,
      'pagination:page': page,
      'pagination:itemsPerPage': CARD_SEARCH_PAGE_SIZE,
    })
  );

  const data = sortCardsByReleaseDate(await hydrateCards(briefs));
  return toSearchResponse(data, page, CARD_SEARCH_PAGE_SIZE);
}

export async function getCard(id: string): Promise<{ data: PokemonCard }> {
  const card = await cachedJson<TcgdexCardDetail>(buildUrl(`/cards/${id}`));
  const setInfo = (await getSetDetailsMap([card.set.id])).get(card.set.id);

  return { data: mapCard(card, setInfo) };
}

export async function getPokedex(limit: number = 1025): Promise<PokedexEntry[]> {
  const response = await cachedFetch(`${POKEAPI_URL}/pokemon?limit=${limit}&offset=0`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokédex');
  }
  
  const data: PokeApiResponse = await response.json();
  
  return data.results.map((pokemon, index) => ({
    id: index + 1,
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
  }));
}

export async function getCardsByPokemon(pokemonName: string, page: number = 1, setId?: string): Promise<SearchResponse> {
  const briefs = await cachedJson<TcgdexCardBrief[]>(
    buildUrl('/cards', {
      name: `*${pokemonName}*`,
      'set.id': setId,
      'pagination:page': page,
      'pagination:itemsPerPage': POKEMON_CARD_PAGE_SIZE,
    })
  );

  const data = await hydrateCards(briefs);
  return toSearchResponse(data, page, POKEMON_CARD_PAGE_SIZE);
}

export async function getSets(page: number = 1): Promise<SetsResponse> {
  const pageSize = 250;
  const sets = await cachedJson<TcgdexSetBrief[]>(
    buildUrl('/sets', {
      'pagination:page': page,
      'pagination:itemsPerPage': pageSize,
      'sort:field': 'releaseDate',
      'sort:order': 'DESC',
    })
  );

  const data = sets.map(mapSetInfo);

  return {
    data,
    page,
    pageSize,
    count: data.length,
    totalCount: data.length,
  };
}

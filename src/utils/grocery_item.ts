// API Query Parameters Interface
interface GroceryQueryParams {
    category?: string;
    brand?: string;
    country?: 'US' | 'JP';
}

// Helper function to build query string
function buildQueryString(params: GroceryQueryParams): string {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('cat', params.category.toLowerCase());
    if (params.brand) queryParams.append('brand', params.brand);
    if (params.country) queryParams.append('country', params.country);
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
}

// Get items with flexible filtering
async function get_items(params: GroceryQueryParams = {}) {
    const baseUrl = 'https://grocery-item-api-5doa.onrender.com/food';
    const queryString = buildQueryString(params);
    const fullUrl = `${baseUrl}${queryString}`;

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching grocery items:', error);
        return [];
    }
}

// Get all items (no filters)
async function get_all_items() {
    try {
        const response = await fetch('https://grocery-item-api-5doa.onrender.com/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all items:', error);
        return [];
    }
}

// Get statistics
async function get_stats(country?: 'US' | 'JP') {
    const url = country 
        ? `https://grocery-item-api-5doa.onrender.com/stats?country=${country}`
        : 'https://grocery-item-api-5doa.onrender.com/stats';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

// Get item by name (or partial name match)
async function get_item_by_name(searchTerm: string, exactMatch: boolean = false) {
    try {
        const allItems = await get_all_items();
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        if (exactMatch) {
            // Exact match (case-insensitive)
            return allItems.filter((item: any) => 
                item.name.toLowerCase() === lowerSearchTerm
            );
        } else {
            // Partial match (case-insensitive)
            return allItems.filter((item: any) => 
                item.name.toLowerCase().includes(lowerSearchTerm)
            );
        }
    } catch (error) {
        console.error('Error searching by name:', error);
        return [];
    }
}

// Get single item by ID
async function get_item_by_id(id: string) {
    try {
        const allItems = await get_all_items();
        return allItems.find((item: any) => item.id === id) || null;
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        return null;
    }
}

// Export functions for use in other files
export { get_items, get_all_items, get_stats, get_item_by_name, get_item_by_id };

// Example usage:
// get_items({ category: 'vegetarian' });
// get_items({ category: 'candy', brand: 'Nestle', country: 'US' });
// get_items({ brand: 'Kraft' });
// get_all_items();
// get_item_by_name('apple'); // Partial match - finds "Granny Smith Apple", "Apple Juice", etc.
// get_item_by_name('Planters Mixed Nuts', true); // Exact match only
// get_item_by_id('fnm230'); // Get specific item by ID
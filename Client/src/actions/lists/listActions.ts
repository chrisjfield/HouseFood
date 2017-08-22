import { List } from '../../interfaces/listsInterfaces';

export const GET_SHOPPING_LISTS = 'GET_SHOPPING_LISTS';

export function getShoppingLists() {
    const shoppingLists: List[] = [{
        listId: 1,
        name: 'list',
        dateCreated: new Date(), 
        complete: false,
    },
    ];

    return {
        type: GET_SHOPPING_LISTS,
        payload: shoppingLists,
    };
}

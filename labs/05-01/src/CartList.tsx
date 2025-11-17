import CartItem from './CartItems';
import {useState} from 'react';
import {nanoid} from 'nanoid';

export default function CartList() {

    const [items, setItems] = useState([
        {id: nanoid(), name: 'Hat', quantity: 2},
        {id: nanoid(), name: 'Tie', quantity: 2},
        {id: nanoid(), name: 'Belt', quantity: 1},
    ]);

    // Calculate total item count
    let itemCount = 0;
    for (const item of items){
        if(item && item.quantity){
            itemCount += item.quantity;
        }
    }

    // Handle name change - hoisted state
    function onNameChange(evt, item){
        const newItems = [...items];
        const index = items.indexOf(item);
        newItems[index].name = evt.target.value;
        setItems(newItems);
    }

    // Handle add quantity - cannot exceed 10
    function onAddQuantity(item){
        if(item.quantity >= 10) return; // Don't allow above 10
        
        const newItems = [...items];
        const index = items.indexOf(item);
        newItems[index].quantity = (newItems[index].quantity || 0) + 1;
        setItems(newItems);
    }

    // Handle subtract quantity - remove item if it reaches 0
    function onSubtractQuantity(item){
        const newQuantity = (item.quantity || 0) - 1;
        
        if(newQuantity > 0){
            // Decrease quantity
            const newItems = [...items];
            const index = items.indexOf(item);
            newItems[index].quantity = newQuantity;
            setItems(newItems);
        } else {
            // Remove item from cart when quantity reaches 0
            setItems(items.filter(i => i.id !== item.id));
        }
    }

    return (
        <div className='min-h-screen w-full bg-white p-12'>
            {/* Header with title and badge */}
            <div className='flex items-center gap-4 mb-8'>
                <h1 className='text-5xl font-bold text-gray-800'>Shopping Cart</h1>
                {/* Hide badge when count is 0 */}
                {itemCount > 0 && (
                    <span className='badge bg-primary rounded-pill fs-6 ms-2 bg-blue-500 text-white px-6 py-3 rounded-full text-3xl font-bold'>
                        {itemCount}
                    </span>
                )}
            </div>
            
            {/* Add Item Button */}
            <button 
                type='button' 
                className='bg-green-500 text-white px-8 py-4 text-lg rounded-lg font-medium mb-12 hover:bg-green-600 transition-colors shadow-md hover:shadow-lg' 
                onClick={() => setItems([...items, {id: nanoid(), name: '', quantity: 1}])}
            >
                Add Item
            </button>

            {/* Empty cart message */}
            {items.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-3xl text-gray-500 font-medium'>
                        Your cart is empty! Add some items to it.
                    </p>
                </div>
            ) : (
                /* Cart items list */
                <div className='flex flex-col gap-8'>
                    {items.map(item => 
                        <CartItem 
                            item={item} 
                            key={item.id} 
                            onNameChange={(evt) => onNameChange(evt, item)} 
                            onAddQuantity={() => onAddQuantity(item)} 
                            onSubtractQuantity={() => onSubtractQuantity(item)} 
                        />
                    )}
                </div>
            )}
        </div>
    );
}
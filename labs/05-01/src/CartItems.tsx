import './App.css'

export default function CartItem({ item, onNameChange, onAddQuantity, onSubtractQuantity }: {
    item: {
        id: string;
        name: string;
        quantity: number;
    };
    onNameChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onAddQuantity: () => void;
    onSubtractQuantity: () => void;
}) {
    // Determine validation classes
    const nameClasses = `CartItem-name w-96 px-5 py-4 border-2 rounded-lg focus:outline-none text-xl ${
        item.name.trim() === '' 
            ? 'border-red-500 bg-red-50 is-invalid' 
            : 'border-green-500 bg-green-50 is-valid'
    }`;

    return (
        <div className='flex items-center gap-6 pb-8 border-b-2 border-gray-400'>
            <input 
                type='text' 
                className={nameClasses}
                value={item.name} 
                onChange={onNameChange}
                placeholder="Enter item name"
            />
            <span className='text-4xl font-bold min-w-[60px] text-center text-gray-800'>
                {item.quantity}
            </span>
            <button 
                className="CartItem-add btn btn-primary m-1 w-16 h-16 rounded-full bg-blue-500 text-white text-3xl font-bold flex items-center justify-center transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-blue-300" 
                disabled={item.quantity >= 10} 
                onClick={onAddQuantity}
                aria-label="Increase quantity"
            >
                +
            </button>
            <button 
                className="CartItem-remove btn btn-danger m-1 w-16 h-16 rounded-full bg-red-500 text-white text-3xl font-bold flex items-center justify-center transition-all hover:bg-red-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-red-300" 
                disabled={item.quantity <= 0} 
                onClick={onSubtractQuantity}
                aria-label="Decrease quantity"
            >
                −
            </button>
        </div>
    );
}
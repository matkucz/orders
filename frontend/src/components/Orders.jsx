import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const [menu, setMenu] = useState([]);
    const [total, setTotal] = useState(0);
    const [orderItems, setOrderItems] = useState([]);
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if (orderItems.length !== 0) {
            fetch('http://localhost:8000/api/orders/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "order_items": orderItems
                })
            }).then(
                response => {
                    if (response.ok) 
                        return response.json()
                    throw new Error('Something went wrong');
                }
            ).then(
                data => {
                    navigate(`/orders/${data.id}`)
                }            
            ).catch(error => {
                console.log(error);
            })
        }
    }

    const getMenuItems = () => {
        fetch('http://localhost:8000/api/menu/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            response => {
                if (response.ok) 
                    return response.json()
                throw new Error('Something went wrong');
            }
        ).then(
            data => {
                setMenu(data)
            }
        ).catch(error => {
            console.log(error);
        })
    };

    const quantityChange = (event) => {
        let existingItem = orderItems.find(element => element.item === event.target.id);
        let index = orderItems.indexOf(existingItem);
        let item = {
            "item": event.target.id,
            "quantity": event.target.value
        }
        let newItems =  orderItems;
        if (index !== -1) {
            if (item.quantity === 0) {
                newItems.splice(index, 1)
            } else {
                newItems[index] = item;
            }
        } else {
            newItems.push(item);
        }
        setOrderItems(newItems);


        
        setTotal(
            newItems.reduce((previousValue, currentValue, index, array) => {
                let item_price = menu.find(element => element.id === parseInt(currentValue.item)).price;
                return previousValue + currentValue.quantity * item_price;
            }, 0)
        );

    }

    useEffect(() => {
        getMenuItems();
    }, []);

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your order</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 gap-6">
                        {
                            menu.map(item => 
                                <>
                                    <div>
                                        <p>{item.name}</p>
                                    </div>
                                    <div>
                                        <p className="italic font-thin">{item.description}</p>
                                    </div>
                                    <div>
                                        <p>{item.price}</p>
                                    </div>
                                    <input 
                                        type="number"
                                        id={item.id}
                                        min={0}
                                        onChange={quantityChange}
                                        placeholder="Qty"
                                        className="
                                            form-control
                                            block
                                            w-full
                                            px-3
                                            py-1.5
                                            text-base
                                            font-normal
                                            text-gray-700
                                            bg-white bg-clip-padding
                                            border border-solid border-gray-300
                                            rounded
                                            transition
                                            ease-in-out
                                            m-0
                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                                            "
                                    />
                                </>
                            )
                        }
                        <div className="cols-span-3">
                            <p>Total</p>
                        </div>
                        <div>
                            <p>{total}</p>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="
                                group
                                w-full
                                flex
                                justify-center
                                py-2
                                px-4
                                border
                                border-transparent
                                text-sm
                                font-medium
                                rounded-md
                                text-white
                                bg-indigo-600
                                hover:bg-indigo-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-offset-2
                                focus:ring-indigo-500
                                "
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
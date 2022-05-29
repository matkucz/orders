import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [menu, setMenu] = useState([]);
    const navigate = useNavigate();

    const verifyToken = () => {
        return fetch('http://localhost:8000/api/token/verify/', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "token": sessionStorage.getItem('access'),
            })
        })
    }

    const getMenuItems = () => {
        fetch('http://localhost:8000/api/menu/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            response => response.json()
        ).then(
            data => {
                setMenu(data)
            }
        ).catch(error => {
            console.log(error);
        })
    };

    const getOrders = () => {
        return fetch('http://localhost:8000/api/orders/', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('access'),
                "Content-Type": "application/json"
            }
        }).then(
            response => response.json()
        ).then(
            data => setOrders(data)
        ).catch(error => {
            console.log(error);
        })
    }

    const editOrderStatus = (id) => {
        fetch('http://localhost:8000/api/orders/' + id + '/', {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('access'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    'status': 'completed'
                }
            )
        }).then(
            response => response.json()
        ).then(
            data => {
                let item = orders.find(element => element.id === id);
                let index = orders.indexOf(item);
                let newMenu = orders;
                newMenu[index].status = data.status;
                setOrders(newMenu)
            }
        ).catch(error => {
            console.log(error);
        })
    };

    const deleteOrder = (id) => {
        fetch('http://localhost:8000/api/orders/' + id + '/', {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('access'),
                "Content-Type": "application/json"
            }
        }).then(
            response => {
                if (response.ok) {
                    let item = orders.find(element => element.id === id);
                    let newMenu = orders.filter(element => element !== item)
                    setOrders(newMenu)
                }
            }).catch(error => {
                console.log(error);
            })
    };

    useEffect(() => {
        verifyToken()
            .then(
                data => {
                    if (data.ok) {
                        getOrders();
                        getMenuItems();
                    } else {
                        throw new Error('Something went wrong');
                    }

                }
            ).catch(error => {
                console.log(error);
                navigate('/login');
            })
    }, []);

    return (
        <div>
            <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
                <div className="container flex flex-wrap justify-between items-center mx-auto">
                    <button data-collapse-toggle="mobile-menu" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
                        <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                            <li>
                                <Link to='/menu' className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">
                                    Menu
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl my-4 font-extrabold text-gray-900">Orders</h2>
                    </div>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Items
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map(element =>
                                    <tr className="bg-white border-b text-gray-700 bg-gray border-gray-300 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {element.id}
                                        </th>
                                        <td className="px-6 py-4">
                                            {element.status}
                                        </td>
                                        <td className="px-6 py-4">
                                            {
                                                element.order_items.map(element =>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <p className='italic'>{menu.find(ele => ele.id === parseInt(element.item)).name}</p>
                                                        <p>Quantity:{element.quantity}</p>
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {element.order_total}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="font-medium text-green-600 dark:text-green-500 hover:underline" onClick={() => editOrderStatus(element.id)}>Completed</button>
                                            {' '}
                                            <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => deleteOrder(element.id)}>Cancel</button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
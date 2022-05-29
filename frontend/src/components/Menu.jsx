import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

export default function Menu() {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(null);
    const [modalName, setModalName] = useState('Add');
    const [id, setId] = useState(0);

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

    const postMenuItem = () => {
        fetch('http://localhost:8000/api/menu/', {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('access'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    'name': name,
                    'description': description,
                    'price': price
                }
            )
        }).then(
            response => {
                if (response.ok) {
                    return response.json();
                }
                throw Error('Error in sending data');
            }
        ).then(
            data => {
                setMenu(oldData => [...oldData, data]);
                setShowModal(false);
            }
        ).catch(error => {
            console.log(error);
        })
    };

    const putMenuItem = (id) => {
        fetch('http://localhost:8000/api/menu/' + id + '/', {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('access'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    'name': name,
                    'description': description,
                    'price': price
                }
            )
        }).then(
            response => {
                if (response.ok) {
                    return response.json();
                }
                throw Error('Error in sending data');
            }
        ).then(
            data => {
                let item = menu.find(element => element.id === id);
                let index = menu.indexOf(item);
                let newMenu = menu;
                newMenu[index] = data;
                setMenu(newMenu);
                setShowModal(false);
            }
        ).catch(error => {
            console.log(error);
        })
    };

    const deleteMenuItem = (id) => {
        fetch('http://localhost:8000/api/menu/' + id + '/', {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('access'),
                "Content-Type": "application/json"
            }
        }).then(() => {
            let item = menu.find(element => element.id === id);
            let index = menu.indexOf(item)
            let newMenu = menu;
            newMenu.splice(index, 1);
            setMenu(newMenu)
        }
        ).catch(error => {
            console.log(error);
        })
    };

    const saveItem = () => {
        if (id !== 0) {
            putMenuItem(id);
        } else {
            postMenuItem();
        }
    }

    const showAddModal = () => {
        setModalName('Add');
        setPrice('');
        setDescription('');
        setName('');
        setShowModal(true);
    }

    const showEditModal = (id) => {
        let item = menu.find(element => element.id === id);
        setModalName('Edit');
        setPrice(item.price);
        setId(item.id);
        setDescription(item.description);
        setName(item.name);
        setShowModal(true);
    }

    useEffect(() => {
        verifyToken()
            .then(
                data => {
                    if (data.ok) {
                        getMenuItems();
                    } else {
                        throw new Error('Something went wrong');
                    }

                }
            ).catch(error => {
                console.log(error);
                navigate('/login');
            })
    }, [])

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
                                <Link to='/dashboard' className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            {modalName} item
                                        </h3>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">
                                        <form className="mt-8 space-y-6">
                                            <div className="rounded-md shadow-sm -space-y-px">
                                                <div>
                                                    <label htmlFor="name">
                                                        Dish name
                                                    </label>
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        onChange={value => setName(value.target.value)}
                                                        value={name}
                                                        required
                                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="description">
                                                        Description
                                                    </label>
                                                    <input
                                                        id="description"
                                                        name="description"
                                                        onChange={value => setDescription(value.target.value)}
                                                        value={description}
                                                        type="text"
                                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="price">
                                                        Price
                                                    </label>
                                                    <input
                                                        id="price"
                                                        name="description"
                                                        type="text"
                                                        onChange={value => setPrice(value.target.value)}
                                                        value={price}
                                                        required
                                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => saveItem()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl my-4 font-extrabold text-gray-900">Menu items</h2>
                    </div>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Dish name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <button
                                        className="font-medium text-green-600 dark:text-green-500 hover:underline"
                                        onClick={() => showAddModal()}>
                                        Add
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                menu.map(element =>
                                    <tr className="bg-white border-b text-gray-700 bg-gray border-gray-300 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {element.id}
                                        </th>
                                        <td className="px-6 py-4">
                                            {element.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {element.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            {element.price}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline" onClick={() => showEditModal(element.id)}>Edit</button>
                                            {' '}
                                            <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => deleteMenuItem(element.id)}>Delete</button>
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
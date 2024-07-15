import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Home = () => {
    const navigate = useNavigate();

    const [ws, setWs] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState("#ffffff");

    useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:8080');
        setWs(webSocket);

        webSocket.onopen = () => {
            console.log('connected');
        };

        webSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Incoming message:', data);
                setStocks(data);
                setLoading(false); // Set loading to false when data is received
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        webSocket.onclose = () => {
            console.log('disconnected');
        };

        webSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            webSocket.close();
        };
    }, []);

    const changeStock = (name) => {
        navigate(`/${name}`);
    }

    return (
        <div className='w-screen h-screen'>
            {stocks.length < 1 && (
                <div className='text-[100px]'>Loading...</div>
            )}
            {stocks.length > 0 && (
                <div className='flex flex-wrap items-center w-full p-10 gap-10'>
                    <div className='flex w-full items-center justify-end'>
                        <div className='w-1/8 border border-gray-400 rounded-sm px-4 py-2'>
                            <select className='outline-none border-none' onChange={(e) => changeStock(e.target.value)}>
                                <option disabled selected>Select Stock</option>
                                {stocks.map((data, key) => (
                                    <option value={data.name} key={key}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <table className='w-full border-collapse border'>
                        <thead>
                            <tr>
                                <th className='border p-2'>Icon</th>
                                <th className='border p-2'>Name</th>
                                <th className='border p-2'>Rate</th>
                                <th className='border p-2'>Volume</th>
                                <th className='border p-2'>Market Cap</th>
                                <th className='border p-2'>View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((data, key) => (
                                <tr key={key} className='border'>
                                    <td className='border p-2 text-center'>
                                        <img className='w-full' src={data.png64} alt={`${data.name} 64px`} />
                                    </td>
                                    <td className='border p-2 flex items-center justify-center'>
                                        <p className='text-blue-500 font-bold'>
                                            {data.name}
                                            {data.symbol && (
                                                <span>( {data.symbol} )</span>
                                            )}
                                        </p>
                                    </td>
                                    <td className='border p-2 text-center'>{data.rate}</td>
                                    <td className='border p-2 text-center'>{data.volume}</td>
                                    <td className='border p-2 text-center'>{data.cap}</td>
                                    <td className='border p-2 flex items-center justify-center'>
                                        <button
                                            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-2'
                                            onClick={() => { navigate(`/${data.name}`) }}
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    {loading && (
                        <ClipLoader
                            color={color}
                            loading={loading}
                            css={override}
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;

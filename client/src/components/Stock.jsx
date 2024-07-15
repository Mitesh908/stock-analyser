import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Stock = () => {

    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();

    const { name } = useParams();

    useEffect(() => {
        getData();
    }, [name]);

    const getData = async () => {
        const url = `http://localhost:8080/${name}`;
        const res = await axios.get(url);
        setStocks(res.data);
    }

    return (
        <div className='p-10'>
            <div className='flex items-center mb-20'>
                <div className='w-1/2'>
                    <div className='flex items-center bg-blue-500 text-white px-4 py-2 w-fit gap-2 cursor-pointer' onClick={() => { navigate(-1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        <p>back</p>
                    </div>
                </div>
                <div className='w-1/2'>
                    <p className='text-[25px] text-blue-500'>Recent 20 Records</p>
                </div>
            </div>
            <div>
                {stocks && (
                    <table className='w-full border-collapse border' border="1">
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>Symbol</th>
                                <th>Rank</th>
                                <th>Age</th>
                                <th>Exchanges</th>
                                <th>Markets</th>
                                <th>Pairs</th>
                                <th>All-Time High (USD)</th>
                                <th>Circulating Supply</th>
                                <th>Total Supply</th>
                                <th>Max Supply</th>
                                <th>Code</th>
                                <th>Rate</th>
                                <th>Volume</th>
                                <th>Market Cap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((data, key) => (
                                <tr key={key}>
                                    <td className='border p-2'>
                                        <img className='w-[10px]' src={data.png64} alt={`${data.name} 64px`} />
                                    </td>
                                    <td className='border p-2'>{data.name}</td>
                                    <td className='border p-2'>{data.symbol}</td>
                                    <td className='border p-2'>{data.rank}</td>
                                    <td className='border p-2'>{data.age}</td>
                                    <td className='border p-2'>{data.exchanges}</td>
                                    <td className='border p-2'>{data.markets}</td>
                                    <td className='border p-2'>{data.pairs}</td>
                                    <td className='border p-2'>{data.allTimeHighUSD}</td>
                                    <td className='border p-2'>{data.circulatingSupply}</td>
                                    <td className='border p-2'>{data.totalSupply}</td>
                                    <td className='border p-2'>{data.maxSupply}</td>
                                    <td className='border p-2'>{data.code}</td>
                                    <td className='border p-2'>{data.rate}</td>
                                    <td className='border p-2'>{data.volume}</td>
                                    <td className='border p-2'>{data.cap}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


        </div>
    )
}

export default Stock
app.get('',(req,res)=>{
  return res.status(200).json({message:'up and running'});
})


// add a new stock in debug
app.post('/add', async (req, res) => {
  const stock = req.body;

  try {
    const savedStock = new Stock({
      name: stock.name,
      symbol: stock.symbol,
      rank: stock.rank,
      age: stock.age,
      color: stock.color,
      exchanges: stock.exchanges,
      markets: stock.markets,
      pairs: stock.pairs,
      png32: stock.png32 || "",
      png64: stock.png64 || "",
      webp32: stock.webp32 || "",
      webp64: stock.webp64 || "",
      categories: stock.categories || [],
      allTimeHighUSD: stock.allTimeHighUSD || 0,
      circulatingSupply: stock.circulatingSupply || 0,
      totalSupply: stock.totalSupply || 0,
      maxSupply: stock.maxSupply || 0,
      code: stock.code || "",
      rate: stock.rate || 0,
      volume: stock.volume || 0,
      cap: stock.cap || 0
    });

    await savedStock.save();
    return res.json({ message: 'Added' });

  } catch (error) {
    console.error('Error saving stock:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

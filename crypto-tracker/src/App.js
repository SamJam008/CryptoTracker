import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LineChart, Line, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts'

function App() {
  const [coinHistory, setCoinHistory] = useState({});
  const coinList = ['bitcoin', 'ethereum', 'dogecoin', 'solana', 'cardano']
  const [prices, setPrices] = useState({
    bitcoin: null,
    ethereum: null,
    dogecoin: null,
    solana: null,
    cardano: null,
    //ripple: null,

  });


  // const fetchPrices = () => {
  //   fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,solana,cardano&vs_currencies=inr')
  //     .then((res) => res.json())
  //     .then((data) => setPrices(data))
  //     .catch((err) => console.error('Error fetching prices', err))

  // };
  const fetchPrices = async () => {
    const latestPrices = {};
    const historicalData = {};
    for (const coin of coinList) {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=inr&days=7`);
        const data = await res.json();

        // store latest price (last item)
        const lastPrice = data.prices[data.prices.length - 1][1];
        latestPrices[coin] = { inr: lastPrice };

        //   historicalData[coin] = data.prices.map(([timestamp, price]) => ({
        //     time: new Date(timestamp).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }),
        //     price: price,
        //   }));
        // }
        historicalData[coin] = data.prices.map(([timestamp, price]) => ({
          time: timestamp, // timestamp is in ms
          price: price,
        }));
      }


      catch (error) {
        console.error(`Error fetching data for ${coin}:`, error);
      }



    }
    //console.log(new Date(coinHistory['ethereum'][0].time).toString());
    console.log('Latest Prices:', latestPrices);
    console.log('Historical Data:', historicalData);



    setPrices(latestPrices);
    setCoinHistory(historicalData);
  };

  useEffect(() => {
    fetchPrices(); //fetch immediately on first load


    const interval = setInterval(() => {
      fetchPrices(); // fetch every 60 seconds
    }, 60000); // 10000ms =10 sec

    return () => clearInterval(interval);
  }, []);


  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#f0f2f5',
        paper: darkMode ? '#1e1e1e' : '#fff',
      },

    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* applies background and text styles */}
      <Container maxWidth="md" sx={{ py: 1 }}>
        {/* <Card elevation={5} sx={{
          p: 3, textAlign: 'center',
          
        }} > */}
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          }
          label="Dark Mode"
        />

        <Typography variant="h4" sx={{ mb: 3 }} align="center" gutterBottom>Live Crypto Tracker Dashboard 💸₿🪙🚀 </Typography>
        <Grid container spacing={2} justifyContent="center">
          {coinList.map((coin) => (
            <Grid item xs={12} sm={2} md={4} key={coin}>
              <Card elevation={2} sx={{
                p: 2, textAlign: 'center', backgroundColor: darkMode ? '#1e1e1e' : '#f5f9f5',
                color: darkMode ? '#fff' : '#111',
              }} >
                <CardContent>
                  <Typography variant='h5' gutterBottom>
                    {coin.charAt(0).toUpperCase() + coin.slice(1)}Price

                  </Typography>
                  <Typography variant='body1'>
                    ₹{prices[coin]?.inr?.toLocaleString('en-IN') ?? 'Loading...'}

                  </Typography>
                  {coinHistory[coin] ? (
                    <ResponsiveContainer width={200} height={120}>
                      <AreaChart data={coinHistory[coin]}>
                        {/* <defs>
                          <linearGradient id={`gradient-${coin}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offest="5%" stopColor={darkMode ? '#90caf9' : '#1976d2'} stopOpacity={0.4} />
                            <stop offest="95%" stopColor={darkMode ? '#90caf9' : '#1976d2'} stopOpacity={0} />


                          </linearGradient>
                        </defs> */}
                        <YAxis
                          width={60}
                          tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
                          stroke={darkMode ? '#aaa' : '#555'}
                          tick={{ fontSize: 9 }}
                        />

                        <XAxis
                          dataKey="time"
                          tickFormatter={(timestamp) => {
                            const formatter = new Intl.DateTimeFormat('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'Asia/Kolkata',
                            });
                            return formatter.format(new Date(timestamp));
                          }}
                          stroke={darkMode ? '#aaa' : '#555'}
                          tick={{ fontSize: 10 }}
                        />



                        <Tooltip
                          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
                          labelFormatter={(timestamp) => {

                            const data = new Date(timestamp);
                            return data.toLocaleDateString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'Asia/Kolkata',
                            })
                          }}
                          contentStyle={{
                            backgroundColor: darkMode ? '#333' : '#fff',
                            borderColor: darkMode ? '#90caf9' : '#1976d2',
                            fontSize: '12px',
                            padding: '4px 6px',
                          }} />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={darkMode ? '#90caf9' : '#1976d2'}
                          fill={`url(#gradient-${coin})`}
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={true}
                        />

                      </AreaChart>


                    </ResponsiveContainer>
                  ) : (
                    <Typography variant="body2">₹Loading chart ....</Typography>
                  )}

                </CardContent>
              </Card>
            </Grid>
          ))}



        </Grid>

      </Container>
    </ThemeProvider>

  );

}
export default App;

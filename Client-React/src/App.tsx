import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store';
import router from './router';
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create theme with RTL direction
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Heebo", "Roboto", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: "#8B0000",
    },
    secondary: {
      main: "#D4AF37",
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default App;

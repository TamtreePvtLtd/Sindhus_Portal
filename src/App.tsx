import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import { paths } from "./routes/path";
import Home from "./pages/home/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SnackBarProvider from "./context/SnackBarContext";
import CustomSnackBar from "./common/CustomSnackBar";
import { Suspense, lazy } from "react";
import Loader from "./common/component/Loader";

export const queryClient = new QueryClient();

const SpecialsComponent = lazy(() => import("./pages/specials/Specials"));

const SnacksComponent = lazy(() => import("./pages/snacks/SnacksPage"));

const CateringComponent = lazy(() => import("./pages/catering/CateringPage"));

const DiningOutComponent = lazy(
  () => import("./pages/diningout/DiningOutPage")
);

const ProductDetailComponent = lazy(
  () => import("./common/component/ProductDetail")
);

const CategoryProductComponent = lazy(
  () => import("./pages/diningout/CategoryProduct")
);

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SnackBarProvider>
          <HashRouter>
            <Suspense fallback={<Loader showSuspendLoading={true} />}>
              <Routes>
                <Route path={paths.ROOT} element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path={paths.HOME} element={<Home />} />
                  <Route
                    path={paths.SPECIALS}
                    element={<SpecialsComponent />}
                  />
                  <Route path={paths.SNACKS} element={<SnacksComponent />} />
                  <Route
                    path={paths.CATERING}
                    element={<CateringComponent />}
                  />
                  <Route
                    path={paths.DAILYMENU}
                    element={<DiningOutComponent />}
                  />
                  <Route
                    path={paths.PRODUCTDETAIL}
                    element={<ProductDetailComponent />}
                  />
                  <Route
                    path={paths.PRODUCTSBYCATEGORY}
                    element={<CategoryProductComponent />}
                  />
                </Route>
              </Routes>
            </Suspense>
          </HashRouter>
          <CustomSnackBar />
        </SnackBarProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

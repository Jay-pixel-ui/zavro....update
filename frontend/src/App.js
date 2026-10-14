import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { captureUtm } from "@/lib/analytics";

const ServicesIndex = lazy(() => import("@/pages/ServicesIndex"));
const ServicePage = lazy(() => import("@/pages/ServicePage"));
const Work = lazy(() => import("@/pages/Work"));
const Process = lazy(() => import("@/pages/Process"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Insights = lazy(() => import("@/pages/Insights").then((m) => ({ default: m.Insights })));
const InsightArticle = lazy(() => import("@/pages/Insights").then((m) => ({ default: m.InsightArticle })));
const Privacy = lazy(() => import("@/pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("@/pages/Legal").then((m) => ({ default: m.Terms })));

const Fallback = () => <div className="min-h-screen" aria-busy="true" />;

export default function App() {
  useEffect(() => { captureUtm(); }, []);
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesIndex />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/work" element={<Work />} />
            <Route path="/process" element={<Process />} />
            <Route path="/about" element={<About />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightArticle />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

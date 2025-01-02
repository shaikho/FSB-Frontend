import { CacheProvider } from "@emotion/react";
import { PropsWithChildren } from "react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { useTranslation } from "react-i18next";
type RtlProviderProps = PropsWithChildren;
export default function RtlProvider({ children }: RtlProviderProps) {
  const { i18n } = useTranslation();
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const cacheLtr = createCache({
    key: "muiltr",
  });
  return (
    <CacheProvider value={i18n.language === "en" ? cacheLtr : cacheRtl}>
      {children}
    </CacheProvider>
  );
}

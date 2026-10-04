import { Roboto } from "next/font/google"

// Roboto is the CV's face (Mostafa's chosen CV style). Not preloaded:
// it only downloads on pages that actually show the CV.
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
})

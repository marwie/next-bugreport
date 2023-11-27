// https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive
'use client'

const isServer = () => typeof window === `undefined`;

import "@needle-tools/engine";
import { type NeedleEngineAttributes } from "@needle-tools/engine";
import { useEffect, useState } from "react";

// Make addEventListener optional
export type NeedleEngineProps = Omit<NeedleEngineAttributes, 'addEventListener'> & { addEventListener?: (event: CustomEvent) => void };

/** **Needle Engine Component**  
 * Import with `const NeedleEngine = dynamic(() => import('./needleEngine'), { ssr: false })`
 * 
 * @example
 * <NeedleEngine src="./assets/next.glb" loading-style="light" style={{ width: '100%', height: '100%', }}></NeedleEngine>
 * 
 */
export default function NeedleEngine({ ...props }): JSX.Element {

  const [src, setSrc] = useState(props?.src ?? null)

  useEffect(() => {
    // import the codgegen to register types
    if (!isServer()) {
      import("./generated/gen")
        .then((m) => {
          if (props?.src === undefined)
            setSrc(m.needle_exported_files)
        })
        .catch((e) => {
          console.error(e)
        });
    }
  }, [])

  return (
    <>
      {!isServer() && <needle-engine src={src} {...props}></needle-engine>}
    </>
  );
}
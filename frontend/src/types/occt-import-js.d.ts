declare module 'occt-import-js' {
  interface OcctMesh {
    name?: string;
    color?: [number, number, number];
    attributes: {
      position: { array: number[] };
      normal?: { array: number[] };
    };
    index: { array: number[] };
  }

  interface OcctResult {
    success: boolean;
    meshes: OcctMesh[];
  }

  interface OcctModule {
    ReadStepFile: (content: Uint8Array, params: null) => OcctResult;
    ReadIgesFile: (content: Uint8Array, params: null) => OcctResult;
    ReadBrepFile: (content: Uint8Array, params: null) => OcctResult;
  }

  const init: (options?: { locateFile?: (file: string) => string }) => Promise<OcctModule>;
  export default init;
}

declare module '*.wasm?url' {
  const url: string;
  export default url;
}

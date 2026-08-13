import occtimportjs from 'occt-import-js';
import occtWasmUrl from 'occt-import-js/dist/occt-import-js.wasm?url';

type OcctModule = Awaited<ReturnType<typeof occtimportjs>>;
export type OcctMesh = ReturnType<OcctModule['ReadStepFile']>['meshes'][number];

let occtPromise: Promise<OcctModule> | null = null;
function getOcct(): Promise<OcctModule> {
  if (!occtPromise) {
    occtPromise = occtimportjs({ locateFile: () => occtWasmUrl });
  }
  return occtPromise;
}

export function isCadFile(name: string): boolean {
  return /\.(step|stp|iges|igs)$/i.test(name);
}

export async function parseCadToMeshes(file: File): Promise<OcctMesh[] | null> {
  const occt = await getOcct();
  const buffer = new Uint8Array(await file.arrayBuffer());
  const ext = file.name.split('.').pop()?.toLowerCase();
  const result =
    ext === 'iges' || ext === 'igs'
      ? occt.ReadIgesFile(buffer, null)
      : occt.ReadStepFile(buffer, null);
  if (!result.success || !result.meshes.length) return null;
  return result.meshes;
}

export interface RealGeometry {
  volumeCm3: number;
  boundingBoxMm: { x: number; y: number; z: number };
  triangleCount: number;
}

export function computeRealGeometry(meshes: OcctMesh[]): RealGeometry {
  let totalVolumeMm3 = 0;
  let triangleCount = 0;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  for (const mesh of meshes) {
    const pos = mesh.attributes.position.array;
    const idx = mesh.index.array;

    for (let i = 0; i < pos.length; i += 3) {
      for (let a = 0; a < 3; a++) {
        if (pos[i + a] < min[a]) min[a] = pos[i + a];
        if (pos[i + a] > max[a]) max[a] = pos[i + a];
      }
    }

    let meshVolume = 0;
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3;
      const b = idx[i + 1] * 3;
      const c = idx[i + 2] * 3;
      meshVolume +=
        (pos[a] * (pos[b + 1] * pos[c + 2] - pos[c + 1] * pos[b + 2]) -
          pos[b] * (pos[a + 1] * pos[c + 2] - pos[c + 1] * pos[a + 2]) +
          pos[c] * (pos[a + 1] * pos[b + 2] - pos[b + 1] * pos[a + 2])) /
        6;
    }
    totalVolumeMm3 += Math.abs(meshVolume);
    triangleCount += idx.length / 3;
  }

  return {
    volumeCm3: Math.round((totalVolumeMm3 / 1000) * 100) / 100,
    boundingBoxMm: {
      x: Math.round((max[0] - min[0]) * 10) / 10,
      y: Math.round((max[1] - min[1]) * 10) / 10,
      z: Math.round((max[2] - min[2]) * 10) / 10,
    },
    triangleCount,
  };
}

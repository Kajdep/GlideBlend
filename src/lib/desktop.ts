export interface DesktopAppInfo {
  isDesktop: boolean;
  version: string;
  platform: string;
}

interface DesktopSavePayload {
  defaultPath: string;
  bytes: Uint8Array;
}

interface DesktopSaveResult {
  canceled: boolean;
  filePath?: string;
}

declare global {
  interface Window {
    desktopBridge?: {
      getAppInfo: () => Promise<DesktopAppInfo>;
      saveVideo: (payload: DesktopSavePayload) => Promise<DesktopSaveResult>;
    };
  }
}

export async function getDesktopAppInfo(): Promise<DesktopAppInfo | null> {
  if (!window.desktopBridge) {
    return null;
  }

  return window.desktopBridge.getAppInfo();
}

export async function saveBlobWithDesktop(
  blob: Blob,
  defaultPath: string,
): Promise<DesktopSaveResult | null> {
  if (!window.desktopBridge) {
    return null;
  }

  const bytes = new Uint8Array(await blob.arrayBuffer());
  return window.desktopBridge.saveVideo({ defaultPath, bytes });
}

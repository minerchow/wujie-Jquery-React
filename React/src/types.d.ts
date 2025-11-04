// Wujie 微前端类型定义
declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean;
    __WUJIE_MOUNT?: () => void;
    __WUJIE_UNMOUNT?: () => void;
    __WUJIE_PROPS__?: {
      parentAppName?: string;
      initialMessage?: string;
      [key: string]: any;
    };
    $wujie?: {
      bus: {
        $on: (event: string, callback: (data: any) => void) => void;
        $off: (event: string) => void;
        $emit: (event: string, data: any) => void;
      };
    };
  }
}

export {};
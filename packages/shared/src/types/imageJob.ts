interface ResizeJob {
  action: "RESIZE";
  width: number;
  height: number;
  image: string;
}

interface CompressJob {
  action: "COMPRESS";
  image: string;
}

export type ImageJob = ResizeJob | CompressJob;

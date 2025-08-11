interface ImageUrls {
  image?: { url?: string };
  thumb?: { url?: string };
  medium?: { url?: string };
}

interface ExtractedUrls {
  image: string | null;
  thumb: string | null;
  medium: string | null;
}

const extractUrls = (urls: ImageUrls): ExtractedUrls => ({
  image: urls.image?.url || null,
  thumb: urls.thumb?.url || null,
  medium: urls.medium?.url || null
});

export const extractFreeImageHostUrls = (data: {
  image?: ImageUrls;
}): ExtractedUrls | null => (data?.image ? extractUrls(data.image) : null);

export const extractIbbImageUrls = (data: {
  data?: ImageUrls;
}): ExtractedUrls | null => (data?.data ? extractUrls(data.data) : null);

export const extractPhpImageUrls = ({
  filename = "",
  path = ""
}: {
  filename?: string;
  path?: string;
}): { filename: string; path: string } => ({
  filename,
  path: `${process.env.PHP_UPLOAD_URL}${path}`
});

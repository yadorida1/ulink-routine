export const openYouTubeUrl = (url: string): void => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeThumbnailUrl = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

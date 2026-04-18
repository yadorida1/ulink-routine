import { Linking, Alert } from 'react-native';

export const openYouTubeUrl = async (url: string): Promise<void> => {
  if (!url) {
    Alert.alert('링크 없음', '이 루틴에는 연결된 YouTube 링크가 없어요.');
    return;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('링크 열기 실패', 'YouTube를 열 수 없어요. 링크를 확인해 주세요.');
    }
  } catch {
    Alert.alert('오류', '링크를 여는 중 문제가 발생했어요.');
  }
};

export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Returns YouTube thumbnail URL for a given video ID
export const getYouTubeThumbnailUrl = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

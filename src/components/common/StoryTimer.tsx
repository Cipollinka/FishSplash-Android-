import {View, Text} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import TimerIcon from '@assets/icons/timer.svg';

interface Props {
  onEnd: () => void;
  resetTrigger?: number;
}

export default function StoryTimer({onEnd, resetTrigger = 0}: Props) {
  const [timer, setTimer] = useState(60);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    setTimer(60);
  }, [resetTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onEnd, resetTrigger]);

  return (
    <LinearGradient
      colors={['#00E8F8', '#00AABA', '#008D9D']}
      style={{borderRadius: 9}}>
      <View className="flex-row gap-2 border border-white rounded-lg items-center p-2 min-w-[80px]">
        <TimerIcon />
        <Text className="text-white font-black text-lg">
          {formatTime(timer)}
        </Text>
      </View>
    </LinearGradient>
  );
}

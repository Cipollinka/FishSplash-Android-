import {getStore} from '@app/store/RootStore';
import GameEndModal from '@components/common/GameEndModal';
import StoryAttempts from '@components/common/StoryAttempts';
import StoryBalance from '@components/common/StoryBalance';
import StoryClose from '@components/common/StoryClose';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Easing} from 'react-native-reanimated';

const FishingGameScreen = () => {
  const navigation = useNavigation();
  const store = getStore();
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const SCREEN_HEIGHT = Dimensions.get('window').height;

  const [isGameActive, setIsGameActive] = useState(true);
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(200);
  const [attempts, setAttempts] = useState(0);
  const [lastCastSuccess, setLastCastSuccess] = useState(null);
  const [showHook, setShowHook] = useState(false);
  const [hookPosition, setHookPosition] = useState({x: 0, y: 0});
  const [isGameEndModalVisible, setIsGameEndModalVisible] = useState(false);
  const [successfulAttempts, setSuccessfulAttempts] = useState(0);
  const progressVal = useRef(0);

  const FISHING_ROD_Y = SCREEN_HEIGHT - targetY - 50;
  const LINE_START_X = SCREEN_WIDTH / 2;
  const isSuccess = successfulAttempts >= 8;
  const isStoryFinished = store?.story?.isStoryFinished;

  const trajectoryProgress = useRef(new Animated.Value(0)).current;
  const hookOpacity = useRef(new Animated.Value(0)).current;
  const targetColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    generateRandomTarget();
    startTrajectoryAnimation();
  }, []);

  useEffect(() => {
    trajectoryProgress.addListener(({value}) => {
      progressVal.current = value;
    });

    return () => {
      trajectoryProgress.removeAllListeners();
    };
  }, []);

  const generateRandomTarget = () => {
    const randomX = Math.random() * (SCREEN_WIDTH - 150) + 75;
    const randomY = Math.random() * (SCREEN_HEIGHT / 2) + 175;
    setTargetX(randomX);
    setTargetY(randomY);
  };

  const createTrajectoryAnimation = () => {
    return Animated.sequence([
      Animated.timing(trajectoryProgress, {
        toValue: 1,
        duration: 3000,
        easing: Easing.bezier(0.2, 0, 0.8, 1).factory(),
        useNativeDriver: true,
      }),
      Animated.delay(200),
      Animated.timing(trajectoryProgress, {
        toValue: 0,
        duration: 3000,
        easing: Easing.bezier(0.2, 0, 0.8, 1).factory(),
        useNativeDriver: true,
      }),
      Animated.delay(200),
    ]);
  };

  const startTrajectoryAnimation = () => {
    trajectoryProgress.setValue(Math.random() * 1);
    Animated.loop(createTrajectoryAnimation()).start();
  };

  const calculateTrajectoryEndPoint = (progress: number) => {
    const width =
      progress > 0.8
        ? SCREEN_WIDTH - 50
        : progress < 0.2
        ? SCREEN_WIDTH + 80
        : SCREEN_WIDTH;

    let adjustedX;
    adjustedX = progress * width;

    return {x: Math.max(adjustedX, 50), y: targetY};
  };

  const handleCast = () => {
    if (!isGameActive) return;

    setIsGameActive(false);

    const endPoint = calculateTrajectoryEndPoint(progressVal.current);

    setHookPosition(endPoint);
    setShowHook(true);

    const success = Math.abs(endPoint.x - targetX) < 50;
    if (success) {
      setSuccessfulAttempts(prev => prev + 1);
    }

    Animated.sequence([
      Animated.timing(hookOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(targetColor, {
        toValue: success ? 1 : -1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();

    if (attempts >= 9) {
      endGame();
      return;
    }

    setAttempts(prev => prev + 1);
    setTimeout(resetGame, 2000);
  };

  const endGame = () => {
    trajectoryProgress.stopAnimation();
    setIsGameEndModalVisible(true);
  };

  const resetGame = () => {
    setShowHook(false);
    setLastCastSuccess(null);
    setIsGameActive(true);
    hookOpacity.setValue(0);
    targetColor.setValue(0);
    generateRandomTarget();
    startTrajectoryAnimation();
  };

  const trajectoryStyle = {
    transform: [
      {
        translateX: trajectoryProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-SCREEN_WIDTH / 2 + 50, SCREEN_WIDTH / 2 - 50],
        }),
      },
    ],
  };

  const handleContinue = () => {
    if (isSuccess) {
      store.story.goToScene('old_fisherman_4');
      store.balance.addCoins(1000);
      if (isStoryFinished) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Story');
      }
    }
    setIsGameEndModalVisible(false);
  };

  const handleTryAgain = () => {
    resetGame();
    setSuccessfulAttempts(0);
    setIsGameEndModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GameEndModal
        visible={isGameEndModalVisible}
        onClose={handleContinue}
        isSuccess={isSuccess}
        onContinue={handleContinue}
        onTryAgain={handleTryAgain}
        reward={1000}
      />
      <View className="flex-row justify-between items-center z-10 m-4">
        <StoryAttempts attempt={attempts} totalAttempts={10} />
        <StoryBalance balance={store.balance.coins} />
        <StoryClose onPress={() => navigation.replace('Home')} />
      </View>
      <Image
        source={require('../../assets/images/story/story_bg_1.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />

      <Animated.View
        style={[
          styles.trajectoryLine,
          trajectoryStyle,
          {
            bottom: FISHING_ROD_Y,
            left: LINE_START_X,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.target,
          {
            left: targetX - 60,
            top: targetY - 60,
            backgroundColor: targetColor.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [
                'rgba(255, 0, 0, 0.5)',
                'rgba(255, 238, 0, 0.5)',
                'rgba(0, 255, 0, 0.5)',
              ],
            }),
          },
        ]}
      />

      {showHook && (
        <Animated.View
          style={[
            styles.hook,
            {
              left: hookPosition.x - 20,
              top: hookPosition.y - 20,
              opacity: hookOpacity,
            },
          ]}>
          <Image
            source={require('../../assets/images/hook.png')}
            style={{width: 40, height: 40}}
          />
        </Animated.View>
      )}

      <Pressable
        style={[styles.button, {bottom: 20}]}
        onPress={handleCast}
        disabled={!isGameActive}>
        <Image source={require('../../assets/images/fishing_rod.png')} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  trajectoryLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transformOrigin: 'bottom',
  },
  target: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: '#FEED00',
  },
  hook: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  button: {
    position: 'absolute',
    borderRadius: 9999,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignSelf: 'center',
  },
});

export default FishingGameScreen;

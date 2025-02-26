import {
  View,
  SafeAreaView,
  Image,
  Dimensions,
  PanResponder,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Canvas,
  Image as SkiaImage,
  useImage,
  Skia,
  Group,
  Paint,
} from '@shopify/react-native-skia';
import {useSharedValue, useDerivedValue} from 'react-native-reanimated';
import StoryTimer from '@components/common/StoryTimer';
import StoryBalance from '@components/common/StoryBalance';
import {getStore} from '@app/store/RootStore';
import StoryClose from '@components/common/StoryClose';
import {useNavigation} from '@react-navigation/native';
import GameEndModal from '@components/common/GameEndModal';

const SHIP_WIDTH = 120;
const SHIP_HEIGHT = 80;
const OBSTACLE_SIZE = 60;
const SCREEN_PADDING = 10;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function SailGameScreen() {
  const stores = getStore();
  const navigation = useNavigation();

  const [isGameEndModalVisible, setIsGameEndModalVisible] = useState(false);
  const [isSuccessfullyFinished, setIsSuccessfullyFinished] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);

  const isStoryFinished = stores?.story?.isStoryFinished;

  const shipImage = useImage(require('@assets/images/sail/ship.png'));
  const stonesImage = useImage(require('@assets/images/rewards/stones.png'));
  const coralsImage = useImage(require('@assets/images/rewards/corals.png'));
  const bgImage = useImage(require('@assets/images/story/start_bg_2.png'));

  const shipX = useSharedValue((SCREEN_WIDTH - SHIP_WIDTH) / 2);
  const obstacle1 = {
    x: useSharedValue(0),
    y: useSharedValue(-OBSTACLE_SIZE),
  };
  const obstacle2 = {
    x: useSharedValue(SCREEN_WIDTH - OBSTACLE_SIZE),
    y: useSharedValue(-OBSTACLE_SIZE),
  };
  const obstacle3 = {
    x: useSharedValue(SCREEN_WIDTH / 2),
    y: useSharedValue(-OBSTACLE_SIZE * 3),
  };
  const obstacle4 = {
    x: useSharedValue(SCREEN_WIDTH / 3),
    y: useSharedValue(-OBSTACLE_SIZE * 4),
  };

  const collisionOpacity = useSharedValue(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {moveX}) => {
      if (!isGameActive) return;
      shipX.value = Math.max(
        SCREEN_PADDING,
        Math.min(
          moveX - SHIP_WIDTH / 2,
          SCREEN_WIDTH - SHIP_WIDTH - SCREEN_PADDING,
        ),
      );
    },
  });

  const shipRect = useDerivedValue(() => {
    return Skia.XYWHRect(
      shipX.value + SHIP_WIDTH * 0.3,
      SCREEN_HEIGHT - SHIP_HEIGHT - 60,
      SHIP_WIDTH * 0.4,
      SHIP_HEIGHT,
    );
  });

  const obstacle1Rect = useDerivedValue(() => {
    return Skia.XYWHRect(
      obstacle1.x.value + OBSTACLE_SIZE * 0.2,
      obstacle1.y.value + OBSTACLE_SIZE * 0.2,
      OBSTACLE_SIZE * 0.6,
      OBSTACLE_SIZE * 0.6,
    );
  });

  const obstacle2Rect = useDerivedValue(() => {
    return Skia.XYWHRect(
      obstacle2.x.value + OBSTACLE_SIZE * 0.2,
      obstacle2.y.value + OBSTACLE_SIZE * 0.2,
      OBSTACLE_SIZE * 0.6,
      OBSTACLE_SIZE * 0.6,
    );
  });

  const obstacle3Rect = useDerivedValue(() => {
    return Skia.XYWHRect(
      obstacle3.x.value + OBSTACLE_SIZE * 0.2,
      obstacle3.y.value + OBSTACLE_SIZE * 0.2,
      OBSTACLE_SIZE * 0.6,
      OBSTACLE_SIZE * 0.6,
    );
  });

  const obstacle4Rect = useDerivedValue(() => {
    return Skia.XYWHRect(
      obstacle4.x.value + OBSTACLE_SIZE * 0.2,
      obstacle4.y.value + OBSTACLE_SIZE * 0.2,
      OBSTACLE_SIZE * 0.6,
      OBSTACLE_SIZE * 0.6,
    );
  });

  useEffect(() => {
    if (!isGameActive) return;

    let frameId: number;
    let lastTime = performance.now();
    const duration = 1000;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      const elapsed = currentTime - lastFrameTime;

      if (elapsed > frameInterval) {
        lastTime = currentTime;
        lastFrameTime = currentTime - (elapsed % frameInterval);

        const verticalSpeed =
          (SCREEN_HEIGHT / duration) * (deltaTime / 16.67) * 3;

        const updates = () => {
          obstacle1.y.value += verticalSpeed;
          obstacle2.y.value += verticalSpeed;
          obstacle3.y.value += verticalSpeed;
          obstacle4.y.value += verticalSpeed;

          const resetObstacle = (obstacle: typeof obstacle1, delay = 0) => {
            if (obstacle.y.value > SCREEN_HEIGHT) {
              obstacle.y.value = -OBSTACLE_SIZE - delay;
              obstacle.x.value =
                SCREEN_PADDING +
                Math.random() *
                  (SCREEN_WIDTH - OBSTACLE_SIZE - SCREEN_PADDING * 2);
            }
          };

          resetObstacle(obstacle1);
          resetObstacle(obstacle2, OBSTACLE_SIZE * 2);
          resetObstacle(obstacle3, OBSTACLE_SIZE * 3);
          resetObstacle(obstacle4, OBSTACLE_SIZE * 4);

          const checkCollision = (obstacleRect: {value: any}) => {
            const ship = shipRect.value;
            const obstacle = obstacleRect.value;
            return (
              ship.x < obstacle.x + obstacle.width &&
              ship.x + ship.width > obstacle.x &&
              ship.y < obstacle.y + obstacle.height &&
              ship.y + ship.height > obstacle.y
            );
          };

          if (
            checkCollision(obstacle1Rect) ||
            checkCollision(obstacle2Rect) ||
            checkCollision(obstacle3Rect) ||
            checkCollision(obstacle4Rect)
          ) {
            handleCollision();
            return true;
          }
          return false;
        };

        if (updates()) {
          return;
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isGameActive]);

  const handleCollision = () => {
    if (!isGameActive) return;
    setIsGameActive(false);
    collisionOpacity.value = 1;

    setTimeout(() => {
      setIsSuccessfullyFinished(false);
      setIsGameEndModalVisible(true);
    }, 2000);
  };

  const handleTimeEnd = () => {
    if (!isGameActive) return;
    setIsGameActive(false);
    setIsSuccessfullyFinished(true);
    setIsGameEndModalVisible(true);
  };

  const handleModalClose = () => {
    setIsGameEndModalVisible(false);
    setIsGameActive(false);
    setIsSuccessfullyFinished(false);
    collisionOpacity.value = 0;
    shipX.value = (SCREEN_WIDTH - SHIP_WIDTH) / 2;

    obstacle1.x.value = 0;
    obstacle1.y.value = -OBSTACLE_SIZE;
    obstacle2.x.value = SCREEN_WIDTH - OBSTACLE_SIZE;
    obstacle2.y.value = -OBSTACLE_SIZE;
    obstacle3.x.value = SCREEN_WIDTH / 2;
    obstacle3.y.value = -OBSTACLE_SIZE * 3;
    obstacle4.x.value = SCREEN_WIDTH / 3;
    obstacle4.y.value = -OBSTACLE_SIZE * 4;
  };

  const handleContinue = () => {
    setIsGameEndModalVisible(false);
    stores.story.goToScene('evil_joe_4');
    stores.balance.addCoins(1000);

    if (isStoryFinished) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Story');
    }
  };

  const handleTryAgain = () => {
    setIsGameEndModalVisible(false);
    setIsGameActive(true);
    setIsSuccessfullyFinished(false);
    setResetTrigger(prev => prev + 1);

    collisionOpacity.value = 0;
    shipX.value = (SCREEN_WIDTH - SHIP_WIDTH) / 2;

    obstacle1.x.value = 0;
    obstacle1.y.value = -OBSTACLE_SIZE;
    obstacle2.x.value = SCREEN_WIDTH - OBSTACLE_SIZE;
    obstacle2.y.value = -OBSTACLE_SIZE;
    obstacle3.x.value = SCREEN_WIDTH / 2;
    obstacle3.y.value = -OBSTACLE_SIZE * 3;
    obstacle4.x.value = SCREEN_WIDTH / 3;
    obstacle4.y.value = -OBSTACLE_SIZE * 4;
  };

  return (
    <SafeAreaView className="flex-1">
      <GameEndModal
        reward={1000}
        isSuccess={isSuccessfullyFinished}
        visible={isGameEndModalVisible}
        onClose={handleModalClose}
        onContinue={handleContinue}
        onTryAgain={handleTryAgain}
      />

      <View className="absolute top-4 left-0 right-0 z-20 flex-row justify-between m-4 items-center">
        <StoryTimer onEnd={handleTimeEnd} resetTrigger={resetTrigger} />
        <StoryBalance balance={stores.balance.coins} />
        <StoryClose
          onPress={() => {
            handleModalClose();
            navigation.replace('Home');
          }}
        />
      </View>

      <View {...panResponder.panHandlers} style={{flex: 1}}>
        <Canvas style={{flex: 1}}>
          {bgImage && (
            <SkiaImage
              image={bgImage}
              fit="fill"
              x={0}
              y={0}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              opacity={1}
            />
          )}

          {stonesImage && (
            <Group opacity={1}>
              <SkiaImage
                image={stonesImage}
                x={obstacle1.x}
                y={obstacle1.y}
                width={OBSTACLE_SIZE}
                height={OBSTACLE_SIZE}
              />
              <SkiaImage
                image={stonesImage}
                x={obstacle3.x}
                y={obstacle3.y}
                width={OBSTACLE_SIZE}
                height={OBSTACLE_SIZE}
              />
            </Group>
          )}

          {coralsImage && (
            <Group opacity={1}>
              <SkiaImage
                image={coralsImage}
                x={obstacle2.x}
                y={obstacle2.y}
                width={OBSTACLE_SIZE}
                height={OBSTACLE_SIZE}
              />
              <SkiaImage
                image={coralsImage}
                x={obstacle4.x}
                y={obstacle4.y}
                width={OBSTACLE_SIZE}
                height={OBSTACLE_SIZE}
              />
            </Group>
          )}

          {shipImage && (
            <Group opacity={1}>
              <SkiaImage
                image={shipImage}
                x={shipX}
                y={SCREEN_HEIGHT - SHIP_HEIGHT - 100}
                width={SHIP_WIDTH}
                height={SHIP_HEIGHT}
              />
              <Paint opacity={collisionOpacity}>
                <rect
                  x={shipX.value - 10}
                  y={SCREEN_HEIGHT - SHIP_HEIGHT - 110}
                  width={SHIP_WIDTH + 20}
                  height={SHIP_HEIGHT + 20}
                  color="red"
                />
              </Paint>
            </Group>
          )}
        </Canvas>
      </View>
    </SafeAreaView>
  );
}

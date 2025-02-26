import {
  View,
  Text,
  SafeAreaView,
  Image,
  Animated,
  PanResponder,
  TouchableOpacity,
  PanResponderInstance,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import StoryBalance from '@components/common/StoryBalance';
import StoryTimer from '@components/common/StoryTimer';
import StoryClose from '@components/common/StoryClose';
import {getStore} from '@app/store/RootStore';
import GameEndModal from '@components/common/GameEndModal';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '@components/ui/Button';
import Snackbar from 'react-native-snackbar';

const IMAGES_SOURCE = [
  require('../../assets/images/rewards/golden_hook.png'),
  require('../../assets/images/rewards/fish.png'),
  require('../../assets/images/rewards/professional_gear.png'),
];

const SequenceMarker = ({number}: {number: 1 | 2 | 3}) => {
  return (
    <View className="absolute -top-2 -left-2 w-8 h-8 rounded-full z-10">
      <LinearGradient
        colors={['#FF0000', '#FEED00']}
        style={{
          borderRadius: 9999,
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text className="text-white text-2xl font-bold">{number}</Text>
      </LinearGradient>
    </View>
  );
};

const GridItem = ({
  image,
  number,
  isDraggable = false,
  style,
  panResponder,
}: {
  image: any;
  number?: 1 | 2 | 3;
  onPress?: () => void;
  isDraggable?: boolean;
  style?: any;
  panResponder?: PanResponderInstance;
}) => {
  return (
    <Animated.View
      pointerEvents={isDraggable ? 'auto' : 'none'}
      {...(isDraggable && panResponder ? panResponder.panHandlers : {})}
      style={[style]}
      className="relative w-24 h-24 rounded-2xl items-center justify-center bg-black/50">
      {number && <SequenceMarker number={number} />}
      <Image source={image} className="w-full h-full" resizeMode="contain" />
    </Animated.View>
  );
};

type GameState = 'memorize' | 'arrange' | 'success' | 'failure';

interface GridItemType {
  id: number;
  image: any;
  sequence?: 1 | 2 | 3;
  position: number;
}

export const SequenceGameScreen: React.FC = () => {
  const store = getStore();
  const navigation = useNavigation();
  const [gameState, setGameState] = useState<GameState>('memorize');
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);
  const [timerResetTrigger, setTimerResetTrigger] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<GridItemType[]>([]);
  const pan = useRef(new Animated.ValueXY()).current;
  const [draggedItem, setDraggedItem] = useState<GridItemType | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const arrangementAreaYRef = useRef<number>(20);
  const draggedItemRef = useRef<GridItemType | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        pan.setValue({x: 0, y: 0});
        pan.setOffset({x: 0, y: 0});
      },
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: (e, gestureState) => {
        console.log('onPanResponderRelease');
        pan.flattenOffset();
        const dropZoneY = gestureState.moveY - arrangementAreaYRef.current;
        console.log('dropZoneY', dropZoneY);
        console.log('arrangementAreaY', arrangementAreaYRef.current);
        console.log('draggedItem', draggedItem);

        if (dropZoneY > 0 && dropZoneY < 200 && selectedItems.length < 3) {
          if (
            draggedItemRef?.current &&
            !selectedItems.some(item => item.id === draggedItemRef.current.id)
          ) {
            setSelectedItems(prev => [...prev, draggedItemRef.current]);
          }
        }

        pan.setOffset({x: 0, y: 0});
        pan.setValue({x: 0, y: 0});
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: false,
        }).start();
        setDraggedItem(null);
        draggedItemRef.current = null;
      },
    }),
  ).current;

  const isSuccessfullyEndGame = successCount > 1;
  const isStoryFinished = store?.story?.isStoryFinished;

  const gridScale = useRef(new Animated.Value(1)).current;
  const arrangeOpacity = useRef(new Animated.Value(0)).current;
  const handleArrangementAreaLayout = (event: any) => {
    const {y} = event.nativeEvent.layout;
    arrangementAreaYRef.current = y;
  };
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    setIsGameFinished(false);
    const items: GridItemType[] = [];
    const sequences = [1, 2, 3] as const;
    const usedSequences = new Set();
    const sequencesToAssign = [...sequences];

    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const availableImages = IMAGES_SOURCE.filter(
        (_, index) =>
          !items.some(
            item =>
              item.image === IMAGES_SOURCE[index] &&
              Math.floor(item.position / 3) === row,
          ),
      );
      const randomImageIndex = Math.floor(
        Math.random() * availableImages.length,
      );

      let sequence: (typeof sequences)[number] | undefined = undefined;
      if (
        sequencesToAssign.length > 0 &&
        Math.random() < (3 - usedSequences.size) / (9 - i)
      ) {
        const randomIndex = Math.floor(
          Math.random() * sequencesToAssign.length,
        );
        sequence = sequencesToAssign.splice(randomIndex, 1)[0];
        usedSequences.add(sequence);
      }

      items.push({
        id: i,
        image: availableImages[randomImageIndex],
        sequence: sequence,
        position: i,
      });
    }
    console.log('new items', items);

    setGridItems(items);
    setGameState('memorize');

    setTimeout(() => {
      startArrangementPhase();
    }, 2000);
  };

  const checkSequence = () => {
    if (selectedItems.length !== 3) return;
    console.log('selectedItems', selectedItems);

    const isCorrect = selectedItems.every(
      (item, index) => item.sequence === index + 1,
    );
    console.log('isCorrect', isCorrect);

    if (isCorrect) {
      Snackbar.show({
        text: 'Correct sequence!',

        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#00FF00',
      });
      setSuccessCount(prev => prev + 1);
      setGameState('success');
      setSelectedItems([]);
      setTimeout(() => {
        initializeGame();
      }, 500);
    } else {
      Snackbar.show({
        text: 'Incorrect sequence!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#FF0000',
      });
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setGameState('failure');
        setIsEndModalVisible(true);
      } else {
        setSelectedItems([]);
        setTimeout(() => {
          initializeGame();
        }, 500);
      }
    }
  };

  const renderGrid = () => {
    return (
      <Animated.View
        style={[{transform: [{scale: gridScale}]}]}
        className="flex-row flex-wrap justify-center items-center gap-4 grid-rows-3 grid-cols-3 max-w-[350px] mx-auto mt-4">
        {gridItems.map(item => (
          <Pressable
            key={item.id}
            onPressIn={() => {
              console.log('onPressIn');

              if (gameState === 'arrange') {
                setDraggedItem(item);
                draggedItemRef.current = item;
                Animated.spring(gridScale, {
                  toValue: draggedItem?.id === item.id ? 1.1 : 1,
                  useNativeDriver: true,
                }).start();
              }
            }}>
            <GridItem
              key={item.id}
              image={item.image}
              number={gameState === 'memorize' ? item.sequence : undefined}
              panResponder={panResponder}
              isDraggable={
                gameState === 'arrange' && draggedItem?.id === item.id
              }
              style={[
                draggedItem?.id === item.id && {
                  transform: [
                    {translateX: pan.x},
                    {translateY: pan.y},
                    {scale: 1.1},
                  ],
                  opacity: 0.7,
                  zIndex: 1000,
                },
              ]}
            />
          </Pressable>
        ))}
      </Animated.View>
    );
  };

  const startArrangementPhase = () => {
    Animated.parallel([
      Animated.timing(gridScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(arrangeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setGameState('arrange');
  };

  const handleContinue = () => {
    handleModalClose();
    store.balance.addCoins(1000);
    store.story.goToScene('researcher_5');

    if (isStoryFinished) {
      navigation.replace('Home');
    } else {
      navigation.replace('Story');
    }
  };

  const handleModalClose = () => {
    setIsEndModalVisible(false);
    setIsGameFinished(true);
  };
  const handleTryAgain = () => {
    setAttempts(0);
    setIsEndModalVisible(false);
    setSelectedItems([]);
    setTimerResetTrigger(prev => prev + 1);
    initializeGame();
  };
  const handleLeaveScreen = () => {
    handleModalClose();
    navigation.replace('Home');
  };
  const onTimerEnd = () => {
    if (isGameFinished) return;
    setIsEndModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <GameEndModal
        visible={isEndModalVisible}
        reward={1000}
        isSuccess={isSuccessfullyEndGame}
        onClose={handleModalClose}
        onContinue={handleContinue}
        onTryAgain={handleTryAgain}
      />
      <Image
        source={require('../../assets/images/story/start_bg_3.png')}
        className="absolute w-full h-full opacity-75"
        resizeMode="stretch"
      />
      <View className="flex-row m-4 items-center justify-between">
        <StoryBalance balance={store.balance.coins} />
        {/* onTimerEnd */}
        <StoryTimer onEnd={onTimerEnd} resetTrigger={timerResetTrigger} />
        <StoryClose onPress={handleLeaveScreen} />
      </View>
      <LinearGradient
        colors={['#00E8F8', '#00AABA', '#008D9D']}
        style={{
          borderRadius: 16,
          // paddingVertical: 6,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 8,
          minHeight: 50,
        }}>
        <Text className="text-white text-xl font-bold max-w-[200px] text-center">
          {gameState === 'memorize'
            ? 'Memorize the sequence'
            : 'Arrange the correct sequence'}
        </Text>
      </LinearGradient>
      {renderGrid()}

      {gameState === 'arrange' && (
        <Animated.View
          style={{opacity: arrangeOpacity}}
          onLayout={handleArrangementAreaLayout}
          className="flex-row justify-center items-center gap-4 mt-8">
          {[0, 1, 2].map(index => (
            <TouchableOpacity
              onPress={() =>
                setSelectedItems(prev => prev.filter(item => item.id === index))
              }
              key={index}
              className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/50 items-center justify-center">
              {selectedItems[index] && (
                <GridItem
                  image={selectedItems[index].image}
                  isDraggable={false}
                  style={{
                    transform: [{scale: 1}],
                    opacity: 1,
                  }}
                  onPress={() => {
                    setSelectedItems(prev =>
                      prev.filter((_, i) => i !== index),
                    );
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
      {gameState === 'arrange' && selectedItems.length === 3 && (
        <View className="mt-8 px-4">
          <Button text="Check Sequence" onPress={checkSequence} />
        </View>
      )}
    </SafeAreaView>
  );
};
export default SequenceGameScreen;

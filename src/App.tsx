import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import Icons from './components/Icon';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const App = () => {
  const [arr, setArr] = useState<(string | null)[]>(Array(9).fill(null));
  const [isCircle, setIsCircle] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [player1, setPlayer1] = useState<number[]>([]);
  const [player2, setPlayer2] = useState<number[]>([]);

  const isWin = useCallback((playerMoves: number[]) => {
    for (let combo of winCombos) {
      if (combo.every(index => playerMoves.includes(index))) {
        let text = isCircle ? 'Player 2 wins!' : 'Player 1 wins!';

        Snackbar.show({
          text,
          duration: 5000,
          action: {
            text: 'RESET',
            textColor: '#3b82f6',
            onPress: () => reset(),
          },
        });

        setIsOver(true);
        return true;
      }
    }
    return false;
  }, [isCircle]);

  const handlePress = useCallback((index: number) => {
    if (isOver || arr[index] !== null) {
      return;
    }

    if (isCircle) {
      setPlayer1(prev => {
        const updatedPlayer1 = [...prev, index];
        isWin(updatedPlayer1);
        return updatedPlayer1;
      });
    } else {
      setPlayer2(prev => {
        const updatedPlayer2 = [...prev, index];
        isWin(updatedPlayer2);
        return updatedPlayer2;
      });
    }

    setArr(prevArr => {
      const newArr = [...prevArr];
      newArr[index] = isCircle ? 'circle' : 'x';

      if (!newArr.includes(null)) {
        setIsOver(true);
        Snackbar.show({
          text: "Game Over! It's a Draw!",
          duration: 5000,
          action: {
            text: 'RESET',
            textColor: 'green',
            onPress: () => reset(),
          },
        });
      }

      return newArr;
    });

    setIsCircle(!isCircle);
  }, [isCircle, isOver, arr, isWin]);

  const reset = useCallback(() => {
    setArr(Array(9).fill(null));
    setIsCircle(false);
    setPlayer1([]);
    setPlayer2([]);
    setIsOver(false);
  }, []);

  const renderItem = useCallback(({ index }: { index: number }) => {
    return (
      <TouchableOpacity
        onPress={() => handlePress(index)}
        className="w-24 h-24 border border-slate-400 flex items-center justify-center">
        <Icons name={arr[index]} size={50} />
      </TouchableOpacity>
    );
  }, [handlePress, arr]);

  return (
    <SafeAreaView className="w-full h-screen bg-slate-100 dark:bg-slate-950">
      <View className="m-auto border border-slate-400 rounded-lg overflow-hidden">
        <FlatList
          data={arr}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(_, index) => index.toString()}
          extraData={arr}  // Ensures the FlatList re-renders correctly
        />
      </View>
      {isOver && (
        <View className="absolute w-full bottom-44 flex items-center">
          <TouchableOpacity
            className="border-blue-600/50 p-1 border mx-auto rounded-lg"
            onPress={reset}>
            <MatIcon name="reload" size={50} color={'#3b82f6'} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default React.memo(App);
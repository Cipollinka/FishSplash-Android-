import React from 'react';
import {Text, StyleSheet} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
  text: string;
  colors: string[];
  style?: object;
}

const GradientText: React.FC<GradientTextProps> = ({text, colors, style}) => {
  return (
    <MaskedView
      style={{flex: 1, flexDirection: 'row', height: '100%', zIndex: 20}}
      maskElement={<Text style={[styles.text, style]}>{text}</Text>}>
      <LinearGradient colors={colors} style={styles.gradient}>
        <Text style={[styles.text, {opacity: 0}]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default GradientText;

import React from 'react';
import {Modal, View, StyleSheet, Pressable} from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        {children}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomModal;

//import { Platform } from 'react-native';

const Platform = {
  OS: 'ios',
};

const colors = {
  primary: '#019FDB', // crimson: #6E001C
  secondary: '#3AC9FF',
  tertiary: '#FF9E00',
  complementary: Platform.OS === 'ios' ? '#FFFFFF' : '#A41034', // Android doesn't need duplicate feedback for Touchables
  grey: '#CCC',
  transparent: 'rgba(0,0,0,0)',
};

export default colors;

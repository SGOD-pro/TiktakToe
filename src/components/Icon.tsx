import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {View} from 'react-native';

const Icons = ({name="none", size = 35}: {name: string|null; size?: number}) => {
  switch (name) {
    case 'circle':
      return (
        <Icon
          name="circle-thin"
          size={size}
          color={'#4C6FFF'}
          className=""></Icon>
      );

    case 'x':
      return (
        <AntDesign
          name="close"
          size={size}
          color={'#FF4C4C'}
          className=""></AntDesign>
      );

    default:
      return <View />;
  }
};

export default Icons;
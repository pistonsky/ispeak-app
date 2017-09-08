import React from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import styles from '../styles/style';
import colors from '../styles/colors';
import { RegularText } from '../components/Texts';

class WeekBox extends React.Component {
  state = {
    active: false,
  };
  render() {
    const textStyle = {
      color: this.state.active ? colors.complementary : colors.primary,
      fontSize: styles.fontSize(2),
    };
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={{
          borderRadius: 5,
          borderWidth: 2,
          borderColor: colors.primary,
          //backgroundColor: colors.secondary,
        }}
        onShowUnderlay={() => this.setState({ active: true })}
        onHideUnderlay={() => this.setState({ active: false })}
        underlayColor={colors.secondary}>
        <View
          style={{
            paddingTop: 50,
            paddingBottom: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 100,
              height: 100,
              alignItems: 'center',
              marginLeft: 10,
              marginRight: 10,
            }}>
            <Image
              style={{
                width: 100,
                height: 100
              }}
              source={{ uri: this.props.thumb }} />
          </View>
          <View
            style={{
              width: this.props.textWidth + this.props.imageWidth - 140,
              alignItems: 'flex-start',
              marginRight: 20,
            }}>
            <RegularText style={textStyle} numberOfLines={1}>
              {this.props.desc}
            </RegularText>
            <RegularText
              style={[textStyle, { fontSize: styles.fontSize(1) }]}
              numberOfLines={1}>
              {this.props.title}
            </RegularText>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default WeekBox;

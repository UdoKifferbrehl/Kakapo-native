import React from "react-native";
import Reflux from "reflux";
import throttle from "lodash/function/throttle";
import Color from "color";
import {MKColor, mdl, setTheme} from "react-native-material-kit";
import {soundActions} from "../actions";
import {Settings} from "../stores";

const {TouchableOpacity, SliderIOS, Image, StyleSheet, Text, View} = React;

const SliderWithValue = mdl.Slider.slider()
  .withStyle({
    flex: 1,
    marginRight: 30,
    marginBottom: 15,
    height: 0
  })
  .withMin(0)
  .withMax(1)
  .build();

export default React.createClass({
  mixins: [Reflux.connect(Settings, "settings")],
  componentDidUpdate() {
    this.refs.sliderWithValue.value = this.props.volume;
  },
  componentWillMount() {
    this.changeVolumeThrottled = throttle(this.changeVolume, 200);
  },
  togglePlay() {
    soundActions.togglePlayPause(this.props, true);
  },
  changeVolume(vol, trigger) {
    soundActions.changeVolume(this.props, vol, trigger);
  },
  render() {
    return (
      <View style={[styles.container, this.props.playing && {backgroundColor: Color(this.state.settings.color).lighten(0.15).hexString()}]}>
        <TouchableOpacity onPress={this.togglePlay}>
          <Image style={styles.img} source={{ uri: (this.props.playing ? "light" : "dark") + `_${this.props.img}`, isStatic: true }}/>
        </TouchableOpacity>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={this.togglePlay}>
          <Text style={[styles.title, this.props.playing && styles.titlePlaying]}>
            {this.props.name}
          </Text>
          </TouchableOpacity>
          <SliderWithValue
            ref="sliderWithValue"
            upperTrackColor={this.props.playing ? "#fff" : "#f9f9f9"}
            lowerTrackColor={this.props.playing ? "#fff" : "#f9f9f9"}
            onChange={vol => this.changeVolumeThrottled(vol, false)}
            trackSize={4}
          />
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  img: {
    width: 48,
    height: 48,
    margin: 15
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontFamily: "SFUIText-Regular",
    fontSize: 18,
    marginLeft: 8,
    textAlign: "left"
  },
  titlePlaying: {
    color: "#fff",
    marginBottom: 10,
    marginTop: 6
  }
});

'use strict'

import React, { Component } from 'react'
import {
    Alert,
    AppRegistry,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native'
import * as Progress from 'react-native-progress'
import NotificatableTimer from '../domain/notification-timer'
import Icon from 'react-native-vector-icons/FontAwesome'

const FPS = 60
function zeroPadding (n) {
    return ('0' + n.toString()).slice(-2)
}

export default class CircularTimer extends Component {
    constructor(props) {
        super(props)

        this.total = 60 * 60 * 1000
        this.timer = new NotificatableTimer({
            total: this.total,
            terminaterCallback: () => {
                Alert.alert('title', 'message')
            },
            notifications: [
                {
                    at: 5 * 60 * 1000,
                    callback: () => {
                        Alert.alert('caution', 'last 5 minute')
                    }
                },
                {
                    at: 15 * 60 * 1000,
                    callback: () => {
                        Alert.alert('warning', 'last 15 minute')
                    }
                }
            ],
            animation: {
                interval: 1000 / FPS,
                callback: (duration, total) => {
                    const progress = duration / total
                    this.setState({
                        progress
                    })
                }
            },
        })

        this.state = {
            running: false,
            progress: 0,
        }
    }

    formatProgress (progress) {
        const remaining = (this.total * (1 - progress)) / 1000
        const remainingMinutes = Math.floor(remaining / 60)
        const remainingSeconds = Math.floor(remaining % 60)
        return zeroPadding(remainingMinutes) + ':' + zeroPadding(remainingSeconds)
    }

    get icon() {
        return this.state.running ? 'play': 'pause'
    }

    get btnText() {
        return this.state.running ? 'stop': 'start'
    }

    get circleColor() {
        return this.state.running ? '#5db7e8' : '#ea5432'
    }

    get btnColor() {
        return this.state.running ? '#ea5432' : '#5db7e8'
    }

    //TODO runnningがtrueのときはresetボタンを押せないように
    get resetBtnColor() {
        return this.state.running ? '#aaa' : '#aaa'
    }

    get timerTextColor() {
        return this.state.running ? '#222' : '#777'
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={styles.timerView}>
                    <Text style={styles.icon}><Icon name={this.icon} size={40} color={this.timerTextColor} /></Text>
                    <Progress.Circle
                        size={285}
                        progress={this.state.progress}
                        unfilledColor={this.circleColor}
                        color={'#eee'}
                        thickness={10}
                        showsText={true}
                        formatText={(progress) => this.formatProgress(progress)}
                        textStyle={[styles.timerText, {color: this.timerTextColor}]}
                    />
                </View>
                <View style={styles.buttons}>
                    <View style={styles.button}>
                        <TouchableHighlight onPress={() => {
                            this.timer.reset()
                            this.setState({
                                progress: 0
                            })
                        }}>
                            <Text style={[styles.reset, {backgroundColor: this.resetBtnColor}]}>Reset</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.button}>
                        <TouchableHighlight onPress={() => {
                            this.timer.toggle()
                            this.setState({
                                running: !this.state.running
                            })
                        }}>
                        <Text style={[styles.stop, {backgroundColor: this.btnColor}]}>{this.btnText}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        backgroundColor: '#eee',
    },
    timerView: {
        justifyContent: 'center',
        flex: 5,
        alignSelf: 'center',
    },
    icon: {
        top: 85,
        alignSelf: 'center',
        textAlign: 'center',
    },
    timerText: {
        top: 10,
        fontFamily: 'avenir',
        fontSize: 70,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
    },
    button: {
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        flex: 1,
    },
    stop: {
        height: 100,
        paddingTop: 20,
        textAlign: 'center',
        color: '#eee',
        fontSize: 40,
        fontFamily: 'avenir',
        fontWeight: 'bold',
    },
    reset: {
        height: 100,
        paddingTop: 20,
        textAlign: 'center',
        color: '#eee',
        fontSize: 40,
        fontFamily: 'avenir',
        fontWeight: 'bold'
    }
})

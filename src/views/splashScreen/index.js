import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image } from 'react-native';
import { LoginPhone } from "../../action/authAction";
import { _retrieveData } from "../../utils/asynStorage";
import { connect } from 'react-redux';
import { USER_NAME, PASSWORD, IDSHOP } from "../../utils/asynStorage/store";
import {
    sizeFont,
    sizeHeight,
    sizeWidth,
} from "../../utils/helper/size.helper";


class SplashScreen extends Component {
    handload = async () => {
        let [username, password] = ['', ''];
        let id='';
        await _retrieveData(USER_NAME).then((result) => {
            if (result) {
                username = result.substr(1).slice(0, -1)
            }
        })
        await _retrieveData(IDSHOP).then((result) => {
            if (result) {
                id = result.substr(1).slice(0, -1)
            }
        })
        await _retrieveData(PASSWORD).then((result) => {
            if (result) {
                password = result.substr(1).slice(0, -1)
            }
        }).catch((err) => {
            console.log('err')
        })
        this.props.LoginPhone({
            IDSHOP: id,
            USERNAME: username,
            PASSWORD: password,
        })
            .then((result) => {
                console.log("this is spalce", result);
                if(result.data.ERROR==="0000"){
                    this.props.navigation.navigate('StartTwo');
                }else{
                    this.props.navigation.navigate('StartTwo');
                }
                console.log("login_result", result)
            }).catch((errr) => {
                this.props.navigation.navigate('StartTwo');
                console.log(errr)
            })
    }
    componentDidMount() {
        this.handload();
    }
    render() {
        return (
            <View>
                <Image
                    source={require('../../assets/images/first.png')}
                    style={{ width: sizeWidth(100), height: sizeHeight(100) }}
                />
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return { LoginPhone: (data) => dispatch(LoginPhone(data)) };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SplashScreen);

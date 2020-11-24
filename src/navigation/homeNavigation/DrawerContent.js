import React, { Component } from 'react'
import { StyleSheet, View, Image, Alert, Share } from 'react-native'
import { DrawerItem } from '@react-navigation/drawer'
import { _retrieveData } from "../../utils/asynStorage";
import {
    Avatar,
    Title,
    Drawer,
    Text,
} from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { _removeData } from "../../utils/asynStorage";
import { TOKEN, USER_NAME, PASSWORD, AUTH } from "../../utils/asynStorage/store";
import { connect } from "react-redux";
import { LogOut } from "../../action/authAction";
import { countNotify } from "../../action/notifyAction";
import { sizeHeight, sizeWidth } from '../../utils/helper/size.helper';

class DrawerContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlertOption: false,
            data: 12,
        };
    }
    show = () => {
        return Alert.alert(
            "Đăng xuất",
            "Bạn chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Cancel",
                    style: "destructive",
                },
                {
                    text: "OK",
                    onPress: () => {
                        Promise.all(_removeData(TOKEN));
                        Promise.all(_removeData(USER_NAME));
                        Promise.all(_removeData(PASSWORD));
                        this.props.countNotify(0);
                        this.props.LogOut();
                        this.props.navigation.navigate('HomePay')
                    },
                    style: "default",
                },
            ],
            { cancelable: false }
        );
    };
    shareApp = () => {
        const onShare = async () => {
            try {
                const result = await Share.share({
                    message:
                        'http://f5sell.com/buy/f5sell.jsp',
                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                    } else {
                        // shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (error) {
                alert(error.message);
            }
        }
        return Alert.alert(
            "Thông báo",
            `Hãy giới thiệu ${this.props.idshop.SHOP_NAME} cho bạn bè để cùng xây dựng cộng đồng ${this.props.idshop.SHOP_NAME} Xin cảm ơn`,
            [
                {
                    text: "Để sau",
                    style: "destructive",
                },
                {
                    text: "Chia sẻ",
                    onPress: () => { onShare() },
                    style: "default",
                },
            ],
            { cancelable: false }
        );
    };
    handleLoad = async () => {
        await _retrieveData(USER_NAME)
            .then((res) => {
                this.setState({
                    data: res
                })
            })
    }
    componentDidMount() {
        this.handleLoad();
    }
    render() {
        const { authUser, status } = this.props;
        const { data } = this.state;
        return (
            <View>
                {status != '' ? <View><TouchableOpacity style={{ flexDirection: 'row', backgroundColor: "#E1AC06", height: 100, alignItems: "center", paddingLeft: 10 }}
                    onPress={() => { this.props.navigation.navigate('Thông tin CTV') }}
                >
                    <View style={{
                        width: 60, height: 60, borderRadius: 50,
                        justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'
                    }}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={{ width: 50, height: 50 }}
                        />
                    </View>
                    <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                        <Title style={{ fontSize: 20, color: 'white' }}>{authUser.USERNAME}</Title>

                    </View>
                    <View>
                        <Image
                            source={require('../../assets/images/leftname.png')}
                            style={{ width: 30, height: 40, marginLeft: sizeWidth(30) }}
                        />
                    </View>

                </TouchableOpacity></View> : <View style={{ flexDirection: 'row', backgroundColor: "#E1AC06", height: 100, alignItems: "center", paddingLeft: 10, }}

                >
                        <View style={{
                            width: 60, height: 60, borderRadius: 50,
                            justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'
                        }}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={{ width: 50, height: 50 }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center'
                        
                    }}>
                            <TouchableOpacity
                                style={{ borderWidth:1,backgroundColor:'#E1AC06',borderColor:'white',width:sizeWidth(27),height:sizeHeight(5),alignItems:'center',justifyContent:'center',marginLeft:sizeWidth(4) }}
                                onPress={() => {
                                    this.setState({ showAlertOption: true });
                                    this.props.navigation.navigate('SignUp')

                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 14 }}>Đăng ký</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ borderWidth:1,backgroundColor:'white',borderColor:'white',width:sizeWidth(27),height:sizeHeight(5),alignItems:'center',justifyContent:'center',marginLeft:sizeWidth(2) }}
                                onPress={() => {
                                    this.props.navigation.navigate('SignIn')
                                }}
                            >
                                <Text style={{ color: '#E1AC06', fontSize: 14 }}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
                <Drawer.Section>
                    {/* {this.props.status === '' ? null : <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/info.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}
                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>Thông tin CTV</Text>}
                        onPress={() => { this.props.navigation.navigate('Thông tin CTV') }}
                    />} */}
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/report.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}
                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>Chính sách</Text>}

                        onPress={() => { this.props.navigation.navigate('Chính sách') }}
                    />
                    {this.props.status == '' ? null : <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/chinh.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}

                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>Báo cáo</Text>}

                        onPress={() => { this.props.navigation.navigate('report') }}
                    />}
                    {this.props.status == '' ? null : <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/teach.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}

                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>Đào tạo</Text>}

                        onPress={() => { this.props.navigation.navigate('Đào tạo') }}
                    />}
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/qrcode.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}
                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>Quét mã QR code</Text>}

                        onPress={() => { }}
                    />
                    {this.props.status == '' ? null : <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/new.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}

                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>Tin tức, sự kiện</Text>}

                        onPress={() => { this.props.navigation.navigate('Tin tức-sự kiện') }}
                    />}
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/share1.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}
                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>Chia sẻ ứng dụng</Text>}

                        onPress={() => this.shareApp()}

                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        )}
                        label={({ focused, color }) => <Text style={{ color: '#E1AC06', fontSize: 15, fontWeight: 'bold' }}>{`Giới thiệu ${this.props.idshop.SHOP_NAME}`}</Text>}

                        onPress={() => { this.props.navigation.navigate('Giới thiệu') }}
                    />
                </Drawer.Section>
                <View>
                    {this.props.status === "" ? null : (
                            <TouchableOpacity style={{ flexDirection: 'row', height: 100, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => {
                                    this.setState({ showAlertOption: true });
                                    this.show();
                                }}
                            >
                                <Image
                                    source={require('../../assets/images/logout.png')}
                                    style={{ width: 27, height: 27, marginRight: 10 }}
                                />
                                <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Đăng xuất</Text>
                            </TouchableOpacity>
                        )}
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('StartTwo')
                        }}
                    >
                        <Text >Đổi mã shop</Text>
                    </TouchableOpacity>
                </View>
                {/* <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Hello World!</Text>

                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View> */}
            </View>
        )
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        LogOut: (data) => dispatch(LogOut(data)),
        countNotify: (text) => dispatch(countNotify(text)),
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        status: state.authUser.status,
        authUser: state.authUser.authUser,
        idshop:state.product.database,
    }
}
const styles = StyleSheet.create({
    bottomDrawerSection: {
        marginTop: 25,
        borderBottomColor: 'white',
    },
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DrawerContent);

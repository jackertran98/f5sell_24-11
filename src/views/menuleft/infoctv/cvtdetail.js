
import React, { Component } from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, Modal,Alert, ScrollView } from 'react-native';
import { GetListCTV } from "../../../service/account";
import {resetPass} from "../../../service/auth";
var numeral = require("numeral");
import {
    sizeWidth,
    sizeFont,
    sizeHeight,
} from "../../../utils/helper/size.helper"
class cvtdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            modalVisible:false,
        }
    }
    componentDidMount() {
        const { ID_NAME, ID_CODE } = this.props.route.params;
        GetListCTV({
            USERNAME: '',
            SEARCH: ID_CODE,
            ID_CITY: '',
            I_PAGE: 1,
            NUMOFPAGE: 25,
            IDSHOP: this.props.idshop.USER_CODE,
        })
            .then((res) => {
                console.log("clg res",res)
                if (res.data.ERROR == "0000") {
                    this.setState({
                        data: res.data.INFO
                    })
                } else {
                    this.showToast(res);
                }
            })
            .catch((err) => {
                this.setState({ data: [] })
                alert('Không có dữ liệu')
            });
    }
    render() {
        const { data,modalVisible } = this.state;
        const {username}=this.props;
        const { ID_CODE,USERNAME } = this.props.route.params;
        console.log("abc_username",username)
        console.log({ data })
        return (
            <View>
                {data.map((Val, key) => {
                    return (
                        <View>
                            <View style={{ backgroundColor: '#E1AC06', height: sizeHeight(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <View>
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{Val.FULL_NAME}</Text>
                                    <Text style={{ color: 'white' }}>Mã user: {Val.USER_CODE}</Text>
                                </View>
                                <View>
                                    {/* picture */}
                                </View>
                            </View>

                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 60, height: 60 }}
                                            source={require('../../../assets/images/info.png')}
                                        />
                                        <Text style={{ fontSize: 16 }}>Thông tin cá nhân</Text>
                                    </View>
                                    {/* <TouchableOpacity
                                        onPress={() => {

                                        }}
                                    >
                                        <Image
                                            style={{ width: 60, height: 60 }}
                                            source={require('../../../assets/images/info2.png')}
                                        />
                                    </TouchableOpacity> */}
                                </View>
                                <View>
                                    <View style={styles.content}>
                                        <Text>Họ và tên:</Text>
                                        <Text>{Val.FULL_NAME}</Text>
                                    </View>
                                    <View style={styles.content}>
                                        <Text>Giới tính:</Text>
                                        <Text>{Val.GENDERNAME}</Text>
                                    </View>
                                    <View style={styles.content}>
                                        <Text>Số điện thoại:</Text>
                                        <Text>{Val.PHONE}</Text>
                                    </View>
                                    <View style={styles.content}>
                                        <Text>Địa chỉ:</Text>
                                        <Text>{Val.DISTRICT}</Text>
                                    </View>
                                </View>

                            </View>

                            <View>
                                <View style={{ height: 4.5, backgroundColor: '#AAAAAA' }}></View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 60, height: 60 }}
                                            source={require('../../../assets/images/bank.png')}
                                        />
                                        <Text style={{ fontSize: 16 }}>Tài khoản ngân hàng</Text>
                                    </View>
                                    {/* <TouchableOpacity
                                        onPress={() => {

                                        }}
                                    >
                                        <Image
                                            style={{ width: 60, height: 60 }}
                                            source={require('../../../assets/images/info2.png')}
                                        />
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                            <View>
                                <View style={styles.content}>
                                    <Text>Số tài khoản:</Text>
                                    <Text>{Val.STK}</Text>
                                </View>

                                <View style={styles.content}>
                                    <Text>Tên tài khoản:</Text>
                                    <Text>{Val.TENTK}</Text>
                                </View>
                                <View style={styles.content}>
                                    <Text>Ngân hàng, chi nhánh:</Text>
                                    <Text>{Val.TEN_NH}</Text>
                                </View>
                            </View>
                            <View style={{ height: 4.5, backgroundColor: '#AAAAAA' }}></View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomColor: '#AAAAAA', borderBottomWidth: 4.5, height: 60 }}>
                                <Image
                                    source={require('../../../assets/images/monney.png')}
                                    style={{ width: 50, height: 50 }}
                                />
                                <Text style={{ fontSize: 16}}>Số dư hoa hồng hiện tại 1 <Text style={{ color: '#FF5C03', fontSize: 20, fontWeight: 'bold' }}>
                                {numeral(Val.BALANCE).format("0,0")}</Text></Text>
                                <Image
                                    source={require('../../../assets/images/right.png')}
                                    style={{ width: 35, height: 35 }}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <TouchableOpacity

                                        onPress={() => {    
                                            this.setState({
                                                loading:true},
                                                async ()=>{
                                                    await resetPass({
                                                        USERNAME:username,
                                                        USER_CTV:USERNAME,
                                                        IDSHOP:this.props.idshop.USER_CODE
                                                    })
                                                    .then((res)=>{
                                                        Alert.alert('Thông báo',`${res.data.RESULT}`)
                                                    })
                                                    .catch((err) => {
                                                    });
                                                }
                                            )
                                        }}
                                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#149CC6', width: sizeWidth(55), margin: 10 }}
                                    >
                                        <Image
                                            source={require('../../../assets/images/setup.png')}
                                            style={{ width: 45, height: 45 }}
                                        />
                                        <Text style={{ color: 'white' }}>Reset mật khẩu cho CTV</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity

                                        onPress={() => {
                                            console.log("abc")
                                        }}
                                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF5C03', width: sizeWidth(37), margin: 10, paddingLeft: 10 }}
                                    >
                                        <Text style={{ color: 'white' }}>Cập nhật số dư</Text>
                                        <Image
                                            source={require('../../../assets/images/pen.png')}
                                            style={{ width: 45, height: 45 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        
                        </View>

                    )
                })}

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authUser.status,
        authUser: state.authUser.authUser,
        username: state.authUser.username,
        idshop:state.product.database,
    };
};


export default connect(
    mapStateToProps,
    null
)(cvtdetail);

const styles = StyleSheet.create({
    content: {
        height: sizeHeight(5),
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#AAAAAA',
        alignItems: 'center'
    }
})

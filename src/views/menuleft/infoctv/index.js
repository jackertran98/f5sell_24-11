import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, FlatList, ScrollView, Alert } from 'react-native';
import { connect } from "react-redux";
import { GetListCTV } from '../../../service/account';
import ListCTV from "../../../components/listctv";
import { GetCity } from "../../../service/countries"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DataTable } from 'react-native-paper';
import Loading from '../../../components/loading';
import { validate } from 'numeral';
import Usechildren from './usechildren';
import DropDownPicker from 'react-native-dropdown-picker';

import {
    sizeFont,
    sizeHeight,
    sizeWidth,
} from "../../../utils/helper/size.helper";
var numeral = require("numeral");

class InfoCTV extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataCountry: [],
            loading: false,
            selectedValue: 'Tất cả',
        }
    }
    handleLoad = () => {
        const { authUser } = this.props;
        console.log('authscreen', authUser);
        GetListCTV({
            USERNAME: authUser.USERNAME,
            SEARCH: '',
            I_CITY: '',
            I_PAGE: 1,
            NUMOFPAGE: 50,
            IDSHOP: this.props.idshop.USER_CODE,
        })
            .then((result) => {
                if (result.data.ERROR === "0000") {
                    this.setState({ data: result.data.INFO }
                    );
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
        GetCity({

        }).then((result) => {
            console.log("wring", result)
            if (result.data.ERROR === "0000") {
                this.setState({ dataCountry: result.data.INFO })
            }
        })
    }
    componentDidMount() {
        this.handleLoad();
    }
    render() {
        const { dataCountry, data } = this.state;
        const { selectedValue, loading } = this.state;
        const { GROUPS } = this.props.authUser;
        return (
            <View>
                {GROUPS === "3" ? <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18,padding:7,fontWeight:'bold' }}>Tỉnh</Text>
                        <View style={{ height: 50, width: 200, borderColor: '#E1AC06', borderWidth: 1,marginBottom:10,borderRadius:10 }}>
                            <Picker
                                selectedValue={this.state.selectedValue}
                                onValueChange={(itemValue) => this.setState({ selectedValue: itemValue })}
                            >
                                {dataCountry.map((Value) => {
                                    return (
                                        <Picker.Item label={Value.NAME} value={Value.MATP} />
                                    )
                                })}
                            </Picker>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ loading: true }, async () => {
                                    await GetListCTV({
                                        USERNAME: '',
                                        SEARCH: '',
                                        ID_CITY: selectedValue,
                                        I_PAGE: 1,
                                        NUMOFPAGE: 25,
                                        IDSHOP: this.props.idshop.USER_CODE,
                                    })
                                        .then((res) => {
                                            console.log('anc+errr', res)
                                            if (res.data.ERROR == "0000") {

                                                this.setState({
                                                    data: res.data.INFO,
                                                    loading: false
                                                })
                                            } else {
                                                this.showToast(res);
                                            }
                                        })
                                        .catch((err) => {
                                            this.setState({ data: [] })
                                            Alert.alert('Thông báo', 'Không có dữ liệu')
                                        });
                                    this.setState({ loading: false });
                                });
                            }}
                        >
                            <Text style={{ backgroundColor: '#E1AC06', padding: 9, color: 'white', paddingLeft: 40, paddingRight: 40,borderRadius:5 }}>Lọc</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{marginLeft:5,fontWeight:'bold'}}>Tổng số: {data.length} CTV</Text>
                    {loading === false ? <ScrollView>
                        <View style={{ flexDirection: 'row',height:sizeHeight(77)}}>
                            <View>
                                <View style={styles.container1}>
                                    <View style={styles.cuttoms}>
                                        <Text style={{ color: 'white' }}>Tên CTV</Text>
                                    </View>
                                    <View style={styles.cuttoms}>
                                        <Text style={{ color: 'white' }}>Mã CTV</Text>
                                    </View>
                                    <View style={styles.cuttoms}>
                                        <Text style={{ color: 'white' }}>Số điện thoại</Text>
                                    </View>
                                    <View style={styles.cuttoms}>
                                        <Text style={{ color: 'white' }}>Số dư</Text>
                                    </View>
                                </View>
                                <ScrollView style={{ borderColor: '#E1AC06', borderWidth: 2, backgroundColor: '#EFEFEF' }}>
                                    <View style={{ marginTop: -2 }}>
                                        {data.length === 0 ? null : data.map((Val, key) => (
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate("Detail container", {
                                                        ID_CODE: Val.USER_CODE,
                                                        USERNAME: Val.USERNAME,
                                                    })
                                                    }
                                                >
                                                    <View style={styles.container}>
                                                        <View style={styles.children}>
                                                            <Text >{Val.FULL_NAME}</Text>
                                                        </View>
                                                        <View style={styles.children}>
                                                            <Text >{Val.USER_CODE}</Text>
                                                        </View>
                                                        <View style={styles.children}>
                                                            <Text >{Val.FULL_NAME}</Text>
                                                        </View>
                                                        <View style={styles.children}>

                                                            <Text >{numeral(Val.BALANCE).format("0,0")}</Text>

                                                        </View>

                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        ))}

                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView> : <Loading />}
                </View> : <Usechildren navigation={this.props.navigation}/>}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authUser.status,
        authUser: state.authUser.authUser,
        username: state.authUser.username,
        idshop: state.product.database,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoCTV);


const styles = StyleSheet.create({
    container1: {
        flexDirection: 'row',
        

    },
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E1AC06',
    },
    children: {
        borderRightColor: '#E1AC06',
        borderRightWidth: 2,
        textAlign:'center',
        justifyContent:'center',
        width: sizeWidth(25),
        height:sizeHeight(5),
        paddingLeft:sizeWidth(2),
    },
    cuttoms: {
        borderLeftColor: 'white',
        height:sizeHeight(5),
        borderLeftWidth:2,
        backgroundColor: "#E1AC06",
        justifyContent:'center',
        alignItems: 'center',
        width: sizeWidth(25),
    },
})

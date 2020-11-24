import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, ScrollView, RefreshControl, Alert } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { sizeHeight, sizeWidth } from '../../../../../utils/helper/size.helper';
import { connect } from 'react-redux';
import { ReportCTVTT } from "../../../../../service/account";
var numeral = require("numeral");
import DropDownPicker from 'react-native-dropdown-picker';
class ReportList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectyear: '',
            selectmonth: '',
            selectisu: '',

        }
    }
    handLoad = () => {
        ReportCTVTT({
            USERNAME: this.props.username,
            YEAR: this.state.selectyear,
            MONTH: this.state.selectmonth,
            REPORT_TYPE: this.state.selectisu,
            IDSHOP: this.props.idshop.USER_CODE
        })
            .then((result) => {
                console.log("this is ReportCTVTT", result);
                if (result.data.ERROR == '0000') {
                    this.setState({
                        data: result.data.INFO
                    })
                } else {
                    Alert.alert("Thông báo", "Không có dữ liệu");
                }
            }).catch((err) => {
                console.log("errrro", err)
            })
    }
    componentDidMount() {
        this.handLoad();
    }
    render() {
        const { data, selectmonth, selectyear, selectisu } = this.state;
        console.log("state", selectmonth);
        return (
            <View >
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Chọn năm</Text>

                            <View
                                style={{

                                    // The solution: Apply zIndex to any device except Android
                                    ...(Platform.OS !== 'android' && {
                                        zIndex: 10
                                    })
                                }}
                            >
                                <DropDownPicker
                                    items={[
                                        { label: '2020', value: '2020' },
                                        { label: '2019', value: '2019' }
                                    ]}
                                    zIndex={5000}
                                    defaultValue={selectyear}
                                    placeholder="Chọn năm"
                                    containerStyle={{ height: 40 ,zIndex:10}}
                                    style={{ backgroundColor: '#fafafa', width: sizeWidth(30), borderColor: '#E1AC06', borderWidth: 2 }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa', width: sizeWidth(30) }}
                                    onChangeItem={item => this.setState({
                                        selectyear: item.value
                                    }, () => { this.handLoad() })}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Chọn tháng</Text>
                            <View
                                // style={{

                                //     // The solution: Apply zIndex to any device except Android
                                //     ...(Platform.OS !== 'android' && {
                                //         zIndex: 10
                                //     })

                                // }}
                            >
                                <DropDownPicker
                                    items={[
                                        { label: '4', value: '4' },
                                        { label: '10', value: '10' }
                                    ]}
                                    defaultValue={selectmonth}
                                    placeholder="4"
                                    containerStyle={{ height: 40 }}
                                    style={{ backgroundColor: '#fafafa', width: sizeWidth(20), borderColor: '#E1AC06', borderWidth: 2 }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa', width: sizeWidth(20) }}
                                    onChangeItem={item => this.setState({
                                        selectmonth: item.value
                                    }, () => { this.handLoad() })}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', margin: 15 }}>
                        <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Sắp xếp theo</Text>
                        <View
                            // style={{

                            //     // The solution: Apply zIndex to any device except Android
                            //     ...(Platform.OS !== 'android' && {
                            //         zIndex: -1
                            //     })

                            // }}
                        >
                            <DropDownPicker
                                items={[
                                    { label: 'Tên CTV', value: '1' },
                                    { label: 'Doanh số', value: '2' }
                                ]}
                                zIndex={500}
                                defaultValue={selectisu}
                                placeholder="Sắp xếp"
                                containerStyle={{ height: sizeHeight(6) }}
                                style={{ backgroundColor: '#fafafa', width: sizeWidth(35), borderColor: '#E1AC06', borderWidth: 2 }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa', width: sizeWidth(35) }}
                                onChangeItem={item => this.setState({
                                    selectisu: item.value
                                }, () => { this.handLoad() })}
                            />
                        </View>

                    </View>
                </View>
                <View style={{ height: 5, backgroundColor: '#E1AC06', marginBottom: 15,zIndex:-1 }}></View>
                <ScrollView horizontal={true} style={{zIndex:-1}}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[styles.mainUser, styles.custom, styles.customTop]}>
                            <Text style={styles.row1}>STT</Text>
                            <Text style={styles.row2}>Tên CTV</Text>
                            <Text style={styles.row3}>Mã CTV</Text>
                            <Text style={styles.row4}>Số ĐH</Text>
                            <Text style={styles.row5}>Doanh số</Text>
                            <Text style={styles.row6}>Hoa hồng</Text>
                        </View>
                        <View>
                            {data.map((val, key) => {
                                return (
                                    <View style={[styles.mainUser, styles.custom]}>
                                        <Text style={styles.row1}>{key}</Text>
                                        <Text style={styles.row2}>{val.FULL_NAME}</Text>
                                        <Text style={styles.row3}>{val.USER_CODE}</Text>
                                        <Text style={styles.row4}>{val.SUM_ORDER}</Text>
                                        <Text style={styles.row5}>{numeral(val.SUM_MONEY).format("0,0")}</Text>
                                        <Text style={styles.row6}>{numeral(val.SUM_COMMISSION).format("0,0")}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
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
const styles = StyleSheet.create({
    mainUser: {
        flexDirection: 'row',
    },
    row1: {
        textAlign: 'center',
        height: sizeHeight(5),
        paddingTop: sizeHeight(1),
        width: sizeWidth(10),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row2: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(40),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row3: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row4: {
        textAlign: 'center',
        paddingTop: sizeHeight(1),
        width: sizeWidth(13),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row5: {
        textAlign: 'left',
        paddingLeft: sizeWidth(5.5),
        paddingTop: sizeHeight(1),
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row6: {
        textAlign: 'left',
        paddingLeft: sizeWidth(5.5),
        paddingTop: sizeHeight(1),
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row7: {
        textAlign: 'center',
        paddingTop: sizeHeight(1),
        width: sizeWidth(20),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    custom: {
        borderBottomColor: '#E1AC06',
        borderBottomWidth: 1,

    },
    customTop: {
        borderTopColor: '#E1AC06',
        borderTopWidth: 1,
    }
})

export default connect(
    mapStateToProps,
    null
)(ReportList);
